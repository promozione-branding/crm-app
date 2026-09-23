export async function register() {
    if (process.env.NEXT_RUNTIME !== 'nodejs') {
        return;
    }

    console.log('========================================');
    console.log('🔍 ENVIRONMENT CHECK');
    console.log('========================================');

    console.log(
        'YOUR_EMAIL_ADDRESS:',
        process.env.YOUR_EMAIL_ADDRESS || '❌ NOT FOUND'
    );

    console.log(
        'YOUR_APP_PASSWORD:',
        process.env.YOUR_APP_PASSWORD
            ? '✅ FOUND'
            : '❌ NOT FOUND'
    );

    console.log('========================================');

    if (process.env.NODE_ENV !== 'development') {
        return;
    }

    const { testMail } =
        await import('./lib/mail/reminderMail.js');

    try {
        await testMail();
    } catch (error) {
        console.error(
            'SMTP TEST FAILED:',
            error.message
        );
    }

    const { startReminderCron } =
        await import('./lib/cron/reminderCron.js');

    startReminderCron();
}