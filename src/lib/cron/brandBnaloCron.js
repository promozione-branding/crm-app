// src/lib/cron/brandBnaloCron.js
//3
import cron from 'node-cron';
import { connectDB } from '@/config/db';
import Integration from '@/models/integration.model';
import { syncBrandBnaloLeads } from '@/utils/integrations/syncLeads';

let isRunning = false;

//
export function startBrandBnaloSyncCron() {
    console.log('🚀 BrandBnalo lead sync cron started');

    cron.schedule('* * * * *', async () => {
        if (isRunning) {
            console.log('⏳ Previous sync still running, skipping this tick');
            return;
        }

        isRunning = true;

        try {
            await connectDB();

            const integrations = await Integration.find({
                provider: 'website',
                status: 'connected',
            })
                .select('companyId metadata')
                .lean();

            if (integrations.length === 0) {
                // Nothing to do
                return;
            }

            console.log(`🔄 Sync tick: ${integrations.length} connected companies`);

            for (const integration of integrations) {
                try {
                    if (!integration.companyId) {
                        console.log('⚠️ Integration missing companyId:', integration._id);
                        continue;
                    }

                    if (!integration.metadata?.brandBnaloSellerId) {
                        console.log('⚠️ Missing brandBnaloSellerId for company:', String(integration.companyId));
                        continue;
                    }

                    const result = await syncBrandBnaloLeads(integration.companyId);

                    console.log(`✅ ${String(integration.companyId)}:`, {
                        imported: result.imported,
                        skipped: result.skipped,
                        failed: result.failed,
                    });
                } catch (err) {
                    console.error(`❌ Sync failed for ${String(integration.companyId)}:`, err?.message || err);
                }
            }
        } catch (error) {
            console.error('❌ BrandBnalo cron error:', error);
        } finally {
            isRunning = false;
        }
    });
}
