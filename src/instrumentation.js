// instrumentation.js

export async function register() {
    // Only run in Node.js runtime
    if (process.env.NEXT_RUNTIME !== "nodejs") {
        return;
    }

    // ============================================================
    // 🔧 MANUAL SWITCH — TYPE HERE
    //
    //   "no"          → do not run any cron
    //   "production"  → run only in production
    //   "development" → run only in development
    //   "both"        → run in both environments
    // ============================================================

    const activate = "both";

    // ============================================================
    // Decide whether to run
    // ============================================================

    const isProd = process.env.NODE_ENV === "production";
    const isDev = process.env.NODE_ENV === "development";

    const shouldRun =
        activate === "both" ||
        (activate === "production" && isProd) ||
        (activate === "development" && isDev);

    if (!shouldRun) {
        console.log(`⏭️  Crons skipped (activate = "${activate}")`);
        return;
    }

    console.log(`✅ Crons activated (activate = "${activate}")`);

    // ============================================================
    // START REMINDER CRON
    // ============================================================

    try {
        const { startReminderCron } = await import(
            "./lib/cron/reminderCron.js"
        );

        startReminderCron();
        console.log("✅ Reminder cron started");
    } catch (error) {
        console.error("❌ Reminder cron failed:", error);
    }

    // ============================================================
    // START BRANDBNAO WEBSITE LEAD SYNC CRON
    // ============================================================

    try {
        const { startBrandBnaloSyncCron } = await import(
            "./lib/cron/brandBnaloCron.js"
        );

        startBrandBnaloSyncCron();
        console.log("✅ BrandBnalo cron started");
    } catch (error) {
        console.error("❌ BrandBnalo cron failed:", error);
    }
}