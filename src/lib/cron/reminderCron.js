import cron from "node-cron";
import { connectDB } from "@/config/db";
import Meeting from "@/models/meeting.model";
import LeadTask from "@/models/task.model.js";
import { sendMeetingReminderEmail, sendTaskReminderEmail, } from "@/lib/mail/reminderMail";

let cronStarted = false;
export function startReminderCron() {
    if (cronStarted) {
        return;
    }

    cronStarted = true;
    console.log("Reminder cron started");

    // Every minute
    cron.schedule("* * * * *", async () => {
        try {
            await connectDB();
            const now = new Date();
            console.log(`[Reminder Cron] Checking: ${now.toISOString()}`);

            // MEETINGS
            const meetings = await Meeting.find({
                status: "scheduled",
                reminderAt: { $ne: null, $lte: now, },
                reminderSent: false,
            }).populate({ path: "assignedTo", select: "name email", }).limit(50);

            for (const meeting of meetings) {
                try {
                    const user = meeting.assignedTo;
                    if (!user?.email) {
                        console.log(`Meeting ${meeting._id}: user email missing`);
                        continue;
                    }

                    await sendMeetingReminderEmail({ to: user.email, userName: user.name, meeting, });
                    await Meeting.updateOne(
                        { _id: meeting._id, reminderSent: false, },
                        { $set: { reminderSent: true, }, }
                    );

                    console.log(`Meeting reminder sent to ${user.email}`);
                } catch (error) {
                    console.error(`Meeting reminder failed: ${meeting._id}`, error);
                }
            }

            // TASKS
            const tasks = await LeadTask.find({
                status: "pending",
                reminderAt: { $ne: null, $lte: now, },
                reminderSent: false,
            }).populate({ path: "assignedTo", select: "name email", }).limit(50);

            for (const task of tasks) {
                try {
                    const user = task.assignedTo;
                    if (!user?.email) {
                        console.log(`Task ${task._id}: user email missing`);
                        continue;
                    }

                    await sendTaskReminderEmail({ to: user.email, userName: user.name, task, });
                    await LeadTask.updateOne(
                        { _id: task._id, reminderSent: false, },
                        { $set: { reminderSent: true, }, }
                    );

                    console.log(`Task reminder sent to ${user.email}`);
                } catch (error) {
                    console.error(`Task reminder failed: ${task._id}`, error);
                }
            }

        } catch (error) {
            console.error("[Reminder Cron] Error:", error);
        }
    });
}