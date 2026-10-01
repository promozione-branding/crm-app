
import { NextResponse } from 'next/server';

import { connectDB } from '@/config/db';
import { getCurrentUser } from '@/utils/auth';

import Notification from '@/models/notification.model';
import ReminderCenter from '@/models/reminderCenter.model';
import LeadTask from '@/models/task.model';
import Meeting from '@/models/meeting.model';

export const dynamic = 'force-dynamic';

function getId(value) {
    return value?._id?.toString() ?? value?.toString() ?? null;
}

function errorResponse(message, status) {
    return NextResponse.json({ success: false, message }, { status });
}

async function authenticate(request) {
    const user = await getCurrentUser(request);

    if (!user?._id || !user?.companyId) {
        return { error: errorResponse('Unauthorized', 401) };
    }

    return { user };
}

export async function GET(request) {
    try {
        await connectDB();

        const auth = await authenticate(request);

        if (auth.error) return auth.error;

        const user = auth.user;
        const companyId = user.companyId;
        const userId = user._id;
        const now = new Date();

        // Existing assignment notifications remain unchanged.
        const assignments = await Notification.find({
            companyId,
            recipient: userId,
        })
            .populate('actor', 'name firstName lastName')
            .sort({ isRead: 1, createdAt: -1 })
            .limit(100)
            .lean();

        // Only fetch tasks belonging to this company and assigned to this user.
        const [overdueTasks, dueTaskReminders, dueMeetingReminders] =
            await Promise.all([
                LeadTask.find({
                    companyId,
                    assignedTo: userId,
                    status: 'pending',
                    dueDate: { $lt: now },
                })
                    .select('_id title dueDate leadId reminderAt')
                    .lean(),

                LeadTask.find({
                    companyId,
                    assignedTo: userId,
                    status: 'pending',
                    reminderAt: { $ne: null, $lte: now },
                    dueDate: { $gte: now },
                })
                    .select('_id title dueDate leadId reminderAt')
                    .lean(),

                Meeting.find({
                    companyId,
                    assignedTo: userId,
                    status: 'scheduled',
                    reminderAt: { $ne: null, $lte: now },
                })
                    .select('_id title startAt leadId reminderAt')
                    .lean(),
            ]);

        const reminderRecords = [];

        for (const task of overdueTasks) {
            reminderRecords.push({
                companyId,
                recipient: userId,
                type: 'overdue_task',
                title: 'Overdue task',
                message: `${task.title} is past its due date.`,
                refModel: 'LeadTask',
                refId: task._id,
            });
        }

        for (const task of dueTaskReminders) {
            reminderRecords.push({
                companyId,
                recipient: userId,
                type: 'task_reminder',
                title: 'Task reminder',
                message: task.title,
                refModel: 'LeadTask',
                refId: task._id,
            });
        }

        for (const meeting of dueMeetingReminders) {
            reminderRecords.push({
                companyId,
                recipient: userId,
                type: 'meeting_reminder',
                title: 'Meeting reminder',
                message: `${meeting.title} is scheduled for ${
                    meeting.startAt
                        ? new Date(meeting.startAt).toLocaleString()
                        : 'an upcoming time'
                }.`,
                refModel: 'Meeting',
                refId: meeting._id,
            });
        }

        // Create a reminder only once for each item.
        // Existing read and dismissed states are preserved.
        if (reminderRecords.length) {
            await ReminderCenter.bulkWrite(
                reminderRecords.map((record) => ({
                    updateOne: {
                        filter: {
                            companyId: record.companyId,
                            recipient: record.recipient,
                            type: record.type,
                            refModel: record.refModel,
                            refId: record.refId,
                        },
                        update: {
                            $setOnInsert: record,
                        },
                        upsert: true,
                    },
                })),
                { ordered: false }
            );
        }

        const activeReminderIds = reminderRecords.map((item) =>
            getId(item.refId)
        );

        const activeKeys = new Set(
            reminderRecords.map(
                (item) => `${item.type}:${item.refModel}:${getId(item.refId)}`
            )
        );

        // Return only reminders that are still relevant to active items.
        const reminders = await ReminderCenter.find({
            companyId,
            recipient: userId,
            dismissedAt: null,
        })
            .sort({ isRead: 1, createdAt: -1 })
            .lean();

        const activeTaskIds = new Set([
            ...overdueTasks.map((item) => getId(item._id)),
            ...dueTaskReminders.map((item) => getId(item._id)),
        ]);

        const activeMeetingIds = new Set(
            dueMeetingReminders.map((item) => getId(item._id))
        );

        const filteredReminders = reminders.filter((item) => {
            const refId = getId(item.refId);

            if (item.refModel === 'Meeting') {
                return activeMeetingIds.has(refId);
            }

            if (item.refModel === 'LeadTask') {
                return activeTaskIds.has(refId);
            }

            return activeKeys.has(
                `${item.type}:${item.refModel}:${refId}`
            );
        });

        const normalizedAssignments = assignments.map((item) => ({
            _id: getId(item._id),
            source: 'assignment',
            type: item.type,
            title: item.title,
            message: item.message || '',
            isRead: Boolean(item.isRead),
            createdAt: item.createdAt,
            actor: item.actor
                ? {
                    _id: getId(item.actor),
                    name:
                        item.actor.name ||
                        [item.actor.firstName, item.actor.lastName]
                            .filter(Boolean)
                            .join(' ') ||
                        'Team member',
                }
                : null,
            refModel: item.refModel,
            refId: getId(item.refId),
        }));

        const normalizedReminders = filteredReminders.map((item) => ({
            _id: getId(item._id),
            source: 'reminder',
            type: item.type,
            title: item.title,
            message: item.message,
            isRead: Boolean(item.isRead),
            createdAt: item.createdAt,
            dismissedAt: item.dismissedAt,
            refModel: item.refModel,
            refId: getId(item.refId),
        }));

        const notifications = [
            ...normalizedAssignments,
            ...normalizedReminders,
        ].sort((a, b) => {
            const priority = (item) => {
                if (item.type === 'overdue_task') return 0;
                if (!item.isRead) return 1;
                return 2;
            };

            const difference = priority(a) - priority(b);

            if (difference !== 0) return difference;

            return (
                new Date(b.createdAt).getTime() -
                new Date(a.createdAt).getTime()
            );
        });

        return NextResponse.json({
            success: true,
            notifications,
            unreadCount: notifications.filter((item) => !item.isRead).length,
        });
    } catch (error) {
        console.error('Notification center GET error:', error);

        return errorResponse(
            'Unable to load notifications.',
            500
        );
    }
}

export async function PATCH(request) {
    try {
        await connectDB();

        const auth = await authenticate(request);

        if (auth.error) return auth.error;

        const { user } = auth;
        const body = await request.json();

        const { id, source, action } = body;

        if (!id || !['assignment', 'reminder'].includes(source)) {
            return errorResponse('Invalid notification details.', 400);
        }

        if (!['read', 'dismiss'].includes(action)) {
            return errorResponse('Invalid notification action.', 400);
        }

        // Existing assignment notifications support isRead only.
        // Dismiss marks an assignment notification as read rather than
        // deleting or altering its schema.
        if (source === 'assignment') {
            const updated = await Notification.findOneAndUpdate(
                {
                    _id: id,
                    companyId: user.companyId,
                    recipient: user._id,
                },
                { $set: { isRead: true } },
                { new: true }
            );

            if (!updated) {
                return errorResponse('Notification not found.', 404);
            }

            return NextResponse.json({
                success: true,
                message: 'Notification marked as read.',
            });
        }

        const update =
            action === 'dismiss'
                ? { $set: { dismissedAt: new Date(), isRead: true } }
                : { $set: { isRead: true } };

        const updated = await ReminderCenter.findOneAndUpdate(
            {
                _id: id,
                companyId: user.companyId,
                recipient: user._id,
            },
            update,
            { new: true }
        );

        if (!updated) {
            return errorResponse('Reminder not found.', 404);
        }

        return NextResponse.json({
            success: true,
            message:
                action === 'dismiss'
                    ? 'Reminder dismissed.'
                    : 'Reminder marked as read.',
        });
    } catch (error) {
        console.error('Notification center PATCH error:', error);

        return errorResponse(
            'Unable to update notification.',
            500
        );
    }
}
