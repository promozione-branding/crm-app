export async function register() {
    // ============================================================
    // NODE RUNTIME ONLY
    // ============================================================

    if (process.env.NEXT_RUNTIME !== 'nodejs') {
        console.log(
            '[Instrumentation] Skipping - not Node.js runtime'
        );

        return;
    }

    console.log('========================================');
    console.log('🚀 CRM INSTRUMENTATION STARTING');
    console.log('========================================');

    console.log(
        '[Instrumentation] YOUR_EMAIL_ADDRESS:',
        process.env.YOUR_EMAIL_ADDRESS
            ? '✅ FOUND'
            : '❌ NOT FOUND'
    );

    console.log(
        '[Instrumentation] YOUR_APP_PASSWORD:',
        process.env.YOUR_APP_PASSWORD
            ? '✅ FOUND'
            : '❌ NOT FOUND'
    );

    console.log(
        '[Instrumentation] NODE_ENV:',
        process.env.NODE_ENV
    );

    console.log('========================================');

    // ============================================================
    // START CRON IN ALL NODE ENVIRONMENTS
    // ============================================================

    try {
        const { startReminderCron } =
            await import('./lib/cron/reminderCron.js');

        startReminderCron();

        console.log(
            '[Instrumentation] ✅ Reminder cron initialized'
        );
    } catch (error) {
        console.error(
            '[Instrumentation] ❌ Failed to start reminder cron:',
            error
        );
    }

    // ============================================================
    // SMTP TEST - DEVELOPMENT ONLY
    // ============================================================

    if (process.env.NODE_ENV === 'development') {
        try {
            const { testMail } =
                await import('./lib/mail/reminderMail.js');

            console.log(
                '[Instrumentation] 🧪 Running development SMTP test...'
            );

            await testMail();

            console.log(
                '[Instrumentation] ✅ SMTP test completed'
            );
        } catch (error) {
            console.error(
                '[Instrumentation] ❌ SMTP TEST FAILED:',
                error
            );
        }
    }

    console.log('========================================');
    console.log('🚀 CRM INSTRUMENTATION READY');
    console.log('========================================');
}
