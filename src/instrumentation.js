export async function register() {
    // Only run in Node.js runtime
    if (process.env.NEXT_RUNTIME !== 'nodejs') {
        return;
    }

    // ============================================================
    // START REMINDER CRON
    // ============================================================

    try {
        const { startReminderCron } =
            await import('./lib/cron/reminderCron.js');

        startReminderCron();
    } catch (error) {
        console.error(
            '[Instrumentation] Failed to start reminder cron:',
            error
        );
    }
}