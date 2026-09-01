export async function register() {
    if (process.env.NEXT_RUNTIME !== "nodejs") {
        return;
    }

    if (process.env.NODE_ENV !== "production") {
        return;
    }

    const { startReminderCron } = await import(
        "./lib/cron/reminderCron.js"
    );

    startReminderCron();
}
