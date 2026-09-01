export async function register() {
    if (process.env.NODE_ENV === "production") {
        const { startReminderCron, } = await import("./lib/cron/reminderCron.js");
        startReminderCron();
    }
}