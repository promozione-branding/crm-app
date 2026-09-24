// src/controllers/user/leadsController.js

import User from '@/models/user.model.js';
import Lead from '@/models/leads.model.js';
import mongoose from 'mongoose';
import LeadTask from '@/models/task.model.js';
import Meeting from '@/models/meeting.model.js';
import { hasPermission } from '@/utils/permissions.js';
import { applyLeadScope } from '@/utils/dataScope.js';
import Role from '@/models/role.model';
import {
    sendNewLeadAdminEmail,
    sendLeadStatusChangedAdminEmail,
    sendLeadAssignedEmail,
} from '@/lib/mail/notificationMail.js';

export const createLeadService = async (userId, companyId, body) => {
    if (!userId || !companyId) {
        throw new Error('User Info not found.');
    }

    console.log(
        `[EMAIL FLOW] 🆕 Creating lead. User: ${userId}, Company: ${companyId}`
    );

    const lead = await Lead.create({
        ...body,

        companyId: companyId,
        assignedTo: body.assignedTo || null,
        assignedAt: body.assignedTo ? new Date() : null,

        activities: [
            {
                type: 'lead_created',
                description: 'Lead created.',
                createdBy: userId,
            },
        ],

        stageHistory: [
            {
                stage: body.stage || 'new',
                description: 'Lead created',
                updatedBy: userId,
            },
        ],
    });

    console.log(
        `[EMAIL FLOW] ✅ Lead created: ${lead._id}`
    );

    // --------------------------------------------------------
    // NEW LEAD → ADMIN
    // --------------------------------------------------------

    try {
        const createdBy = await User.findById(userId)
            .select('name email');

        await sendNewLeadAdminEmail({
            lead,
            createdBy,
        });
    } catch (error) {
        console.error(
            '[EMAIL FLOW] ❌ New lead admin email failed:',
            error
        );
    }

    // --------------------------------------------------------
    // NEW LEAD ASSIGNED → ASSIGNED USER
    // --------------------------------------------------------

    if (body.assignedTo) {
        try {
            const assignedUser = await User.findOne({
                _id: body.assignedTo,
                companyId,
                status: 'active',
            }).select('name email');

            if (!assignedUser) {
                console.error(
                    `[EMAIL FLOW] ❌ Assigned user not found: ${body.assignedTo}`
                );
            } else {
                const assignedBy = await User.findById(userId)
                    .select('name email');

                await sendLeadAssignedEmail({
                    lead,
                    assignedUser,
                    assignedBy,
                });
            }
        } catch (error) {
            console.error(
                '[EMAIL FLOW] ❌ New lead assignment email failed:',
                error
            );
        }
    }

    return lead;
};

export const getAllLeadsService = async (user, query) => {
    if (!user) {
        throw new Error('User not found');
    }

    const { stage, source, assignedTo, search, page = 1, limit = 10 } = query;

    const role = await Role.findById(user.roleId);

    if (!role) {
        throw new Error('User role not found');
    }

    // PERMISSION
    if (!hasPermission(role, 'leads', 'access')) {
        throw new Error("You don't have permission to access leads");
    }

    // BASE FILTER
    let filter = { companyId: user.companyId };

    // DATA SCOPE
    filter = applyLeadScope({ filter, user, role });

    // FILTERS
    if (stage) {
        filter.stage = stage;
    }

    if (source) {
        filter.source = source;
    }

    const leadPermission = role.permissions.find((item) => item.module === 'leads');
    if (assignedTo && leadPermission?.scope !== 'own') {
        filter.assignedTo = assignedTo;
    }

    // SEARCH
    if (search) {
        filter.$or = [
            { name: { $regex: search, $options: 'i' } },
            { phone: { $regex: search, $options: 'i' } },
            { email: { $regex: search, $options: 'i' } },
            { companyName: { $regex: search, $options: 'i' } },
        ];
    }

    const skip = (page - 1) * limit;
    const [leads, total] = await Promise.all([
        Lead.find(filter)
            .populate('assignedTo', 'name email phone')
            .populate('activities.createdBy', 'name email')
            .sort({
                createdAt: -1,
            })
            .skip(skip)
            .limit(limit),

        Lead.countDocuments(filter),
    ]);

    return {
        leads,

        pagination: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        },
    };
};

export const getLeadByIdService = async (user, leadId) => {
    if (!mongoose.Types.ObjectId.isValid(leadId)) {
        throw new Error('Invalid lead id.');
    }

    if (!user) {
        throw new Error('User not found.');
    }

    const lead = await Lead.findOne({ _id: leadId, companyId: user?.companyId })
        .populate('assignedTo', 'name email phone role')
        .populate('activities.createdBy', 'name email')
        .populate('stageHistory.updatedBy', 'name email')
        .populate('notes.createdBy', 'name email');

    if (!lead) {
        throw new Error('Lead not found.');
    }

    const taskCount = await LeadTask.countDocuments({ leadId: lead._id, companyId: user.companyId });
    const meetingCount = await Meeting.countDocuments({ leadId: lead._id, companyId: user.companyId });

    return {
        ...lead.toObject(),
        taskCount,
        meetingCount,
    };
};

export const updateLeadService = async (user, leadId, body) => {
    if (!mongoose.Types.ObjectId.isValid(leadId)) {
        throw new Error('Invalid lead id.');
    }

    if (!user) {
        throw new Error('User not found.');
    }

    const lead = await Lead.findOne({ _id: leadId, companyId: user.companyId });
    if (!lead) {
        throw new Error('Lead not found.');
    }

    // ============================================================
    // CAPTURE PREVIOUS VALUES FOR EMAIL NOTIFICATIONS
    // ============================================================

    const previousStatus = lead.status;
    const previousStage = lead.stage;
    const previousAssignedTo =
        lead.assignedTo?.toString() || null;

    const changedFields = [];

    // Basic Fields
    const fields = [
        'name',
        'phone',
        'email',
        'companyName',
        'gstNumber',
        'place',
        'product',
        'message',
        'source',
        'dealValue',
        'campaignId',
        'campaignName',
        'status',
    ];

    fields.forEach((field) => {
        if (body[field] !== undefined) {
            const oldValue = lead[field];

            if (String(oldValue) !== String(body[field])) {
                lead[field] = body[field];
                changedFields.push(field);
            }
        }
    });

    // Expected Closure Date
    if (body.expectedClosureDate !== undefined) {
        const oldDate = lead.expectedClosureDate ? new Date(lead.expectedClosureDate).toISOString() : '';
        const newDate = body.expectedClosureDate ? new Date(body.expectedClosureDate).toISOString() : '';

        if (oldDate !== newDate) {
            lead.expectedClosureDate = body.expectedClosureDate || null;
            changedFields.push('expectedClosureDate');
        }
    }

    // Price Range
    if (body.priceRange !== undefined) {
        if (JSON.stringify(body.priceRange) !== JSON.stringify(lead.priceRange)) {
            lead.priceRange = body.priceRange;
            changedFields.push('priceRange');
        }
    }

    // Assigned User
    const oldAssigned = previousAssignedTo || '';
    const newAssigned = body.assignedTo || '';
    if (oldAssigned !== newAssigned) {
        lead.assignedTo = newAssigned || null;
        lead.assignedAt = newAssigned ? new Date() : null;
        changedFields.push('assignedTo');

        lead.activities.push({
            type: 'assigned',
            title: 'Lead Assigned',
            description: 'Lead reassigned.',
            createdBy: user._id,
        });
    }

    // Stage
    if (body.stage && body.stage !== lead.stage) {
        const oldStage = lead.stage;
        lead.stage = body.stage;
        changedFields.push('stage');

        lead.stageHistory.push({
            stage: body.stage,
            updatedBy: user._id,
            reason: body.reason || '',
            description: body.description || '',
        });

        lead.activities.push({
            type: 'status_changed',
            title: 'Stage Changed',
            description: `${oldStage} → ${body.stage}`,
            createdBy: user._id,
        });
    }

    // Nothing Changed
    if (!changedFields.length) {
        return lead;
    }

    // Update Activity
    lead.activities.push({
        type: 'lead_updated',
        title: 'Lead Updated',
        description: `Updated: ${changedFields.join(', ')}`,
        createdBy: user._id,
    });

    await lead.save();

    // ============================================================
    // EMAIL NOTIFICATIONS
    // ============================================================

    try {
        const updatedBy = await User.findById(user._id)
            .select('name email');

        // --------------------------------------------------------
        // STATUS / STAGE CHANGE → ADMIN
        // --------------------------------------------------------

        const statusChanged =
            previousStatus !== lead.status;

        const stageChanged =
            previousStage !== lead.stage;

        if (statusChanged || stageChanged) {
            console.log(
                `[EMAIL FLOW] 🔄 Lead status/stage changed: ${lead._id}`
            );

            await sendLeadStatusChangedAdminEmail({
                lead,
                changedBy: updatedBy,
                oldStatus: previousStatus,
                newStatus: lead.status,
                oldStage: previousStage,
                newStage: lead.stage,
            });
        }

        // --------------------------------------------------------
        // ASSIGNMENT CHANGE → ASSIGNED USER
        // --------------------------------------------------------

        const newAssignedTo =
            lead.assignedTo?.toString() || null;

        if (
            newAssignedTo &&
            previousAssignedTo !== newAssignedTo
        ) {
            console.log(
                `[EMAIL FLOW] 👤 Lead assignment changed: ${previousAssignedTo} → ${newAssignedTo}`
            );

            const assignedUser = await User.findById(newAssignedTo)
                .select('name email');

            if (!assignedUser) {
                console.error(
                    `[EMAIL FLOW] ❌ Assigned user not found: ${newAssignedTo}`
                );
            } else {
                await sendLeadAssignedEmail({
                    lead,
                    assignedUser,
                    assignedBy: updatedBy,
                });
            }
        }
    } catch (error) {
        console.error(
            '[EMAIL FLOW] ❌ Lead update email processing failed:',
            error
        );
    }

    return await Lead.findById(lead._id)
        .populate('assignedTo', 'name email phone role')
        .populate('activities.createdBy', 'name email')
        .populate('stageHistory.updatedBy', 'name email');
};

export const addLeadNoteService = async (userId, leadId, message) => {
    if (!mongoose.Types.ObjectId.isValid(leadId)) {
        throw new Error('Invalid lead id.');
    }

    if (!message || !message.trim()) {
        throw new Error('Note message is required.');
    }

    const user = await User.findById(userId).select('companyId');

    if (!user) {
        throw new Error('User not found.');
    }

    const lead = await Lead.findOne({
        _id: leadId,
        companyId: user.companyId,
    });

    if (!lead) {
        throw new Error('Lead not found.');
    }

    // Add note
    lead.notes.push({
        message: message.trim(),
        createdBy: userId,
    });

    // Add activity
    lead.activities.push({
        type: 'note_added',
        title: 'Note Added',
        description: `Note Added: ${message.trim()}`,
        createdBy: userId,
    });

    await lead.save();

    // Return updated lead
    return await Lead.findById(lead._id).populate('notes.createdBy', 'name email').populate('activities.createdBy', 'name email');
};
