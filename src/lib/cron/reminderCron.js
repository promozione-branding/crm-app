// src/lib/cron/reminderCron.js

import cron from 'node-cron';
import { connectDB } from '@/config/db';
import Meeting from '@/models/meeting.model';
import LeadTask from '@/models/task.model.js';
import { sendMeetingReminderEmail, sendTaskReminderEmail } from '@/lib/mail/reminderMail';

let cronStarted = false;
let cronRunning = false;

export function startReminderCron() {
    if (cronStarted) {
        console.log('[Reminder Cron] ⚠️ Cron already started. Skipping duplicate start.');

        return;
    }

    cronStarted = true;

    console.log('========================================');
    console.log('⏰ REMINDER CRON STARTED');
    console.log('⏰ Schedule: Every minute');
    console.log('========================================');

    cron.schedule('* * * * *', async () => {
        if (cronRunning) {
            console.log('[Reminder Cron] ⏭️ Previous cron execution is still running. Skipping this run.');

            return;
        }

        cronRunning = true;

        try {
            await connectDB();

            const now = new Date();

            console.log('----------------------------------------');
            console.log(`[Reminder Cron] ⏰ Checking: ${now.toISOString()}`);

            // ====================================================
            // MEETINGS
            // ====================================================

            const meetings = await Meeting.find({
                status: 'scheduled',
                reminderAt: {
                    $ne: null,
                    $lte: now,
                },
                reminderSent: false,
            })
                .populate({
                    path: 'assignedTo',
                    select: 'name email',
                })
                .limit(50);

            console.log(`[Reminder Cron] 📅 Meetings found: ${meetings.length}`);

            for (const meeting of meetings) {
                try {
                    const user = meeting.assignedTo;

                    if (!user?.email) {
                        console.error(`[Reminder Cron] ❌ Meeting ${meeting._id}: assigned user email missing`);

                        continue;
                    }

                    console.log(`[Reminder Cron] 📤 Sending meeting reminder ${meeting._id} → ${user.email}`);

                    await sendMeetingReminderEmail({
                        to: user.email,
                        userName: user.name,
                        meeting,
                    });

                    await Meeting.updateOne(
                        {
                            _id: meeting._id,
                            reminderSent: false,
                        },
                        {
                            $set: {
                                reminderSent: true,
                            },
                        }
                    );

                    console.log(`[Reminder Cron] ✅ Meeting reminder sent: ${meeting._id}`);
                } catch (error) {
                    console.error(`[Reminder Cron] ❌ Meeting reminder failed: ${meeting._id}`, error);
                }
            }

            // ====================================================
            // TASKS
            // ====================================================

            const tasks = await LeadTask.find({
                status: 'pending',
                reminderAt: {
                    $ne: null,
                    $lte: now,
                },
                reminderSent: false,
            })
                .populate({
                    path: 'assignedTo',
                    select: 'name email',
                })
                .limit(50);

            console.log(`[Reminder Cron] 📋 Tasks found: ${tasks.length}`);

            for (const task of tasks) {
                try {
                    const user = task.assignedTo;

                    if (!user?.email) {
                        console.error(`[Reminder Cron] ❌ Task ${task._id}: assigned user email missing`);

                        continue;
                    }

                    console.log(`[Reminder Cron] 📤 Sending task reminder ${task._id} → ${user.email}`);

                    await sendTaskReminderEmail({
                        to: user.email,
                        userName: user.name,
                        task,
                    });

                    await LeadTask.updateOne(
                        {
                            _id: task._id,
                            reminderSent: false,
                        },
                        {
                            $set: {
                                reminderSent: true,
                            },
                        }
                    );

                    console.log(`[Reminder Cron] ✅ Task reminder sent: ${task._id}`);
                } catch (error) {
                    console.error(`[Reminder Cron] ❌ Task reminder failed: ${task._id}`, error);
                }
            }

            console.log(`[Reminder Cron] ✅ Check completed: ${new Date().toISOString()}`);

            console.log('----------------------------------------');
        } catch (error) {
            console.error('[Reminder Cron] ❌ CRON ERROR:', error);
        } finally {
            cronRunning = false;
        }
    });
}
