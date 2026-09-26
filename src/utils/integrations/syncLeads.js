// src/utils/integrations/syncLeads.js
//2
import Integration from '@/models/integration.model';
import Lead from '@/models/leads.model';

const BRAND_BNALO_API = 'https://brandbnalo.com/api/form/get-forms';

export async function syncBrandBnaloLeads(companyId) {
    console.log('🔄 Website lead sync started:', String(companyId));

    try {
        if (!companyId) {
            return emptyResult('companyId is required');
        }

        // ====================================================
        // 1. FIND WEBSITE INTEGRATION FOR THIS COMPANY
        // ====================================================

        const integration = await Integration.findOne({
            companyId,
            provider: 'website',
            status: 'connected',
        });

        if (!integration) {
            return emptyResult('Website integration is not connected');
        }

        // The vendor's sellerId (e.g. 6a19599b...)
        const sellerId = integration.metadata?.brandBnaloSellerId;
        if (!sellerId) {
            return emptyResult('BrandBnalo seller ID missing. Reconnect from the Integrations page.');
        }

        // We only import leads created AFTER the connection time
        const connectedAt = integration.connectedAt;
        if (!connectedAt) {
            return emptyResult('Integration connectedAt is missing');
        }

        // ====================================================
        // 2. FETCH LEADS FROM VENDOR
        // ====================================================

        const url = `${BRAND_BNALO_API}/${encodeURIComponent(sellerId)}`;

        const response = await fetch(url, {
            method: 'GET',
            cache: 'no-store',
            headers: { Accept: 'application/json' },
        });

        console.log('📡 Vendor API status:', response.status);

        if (!response.ok) {
            throw new Error(`Vendor API returned ${response.status}`);
        }

        const result = await response.json();

        if (!result?.success) {
            throw new Error(result?.message || 'Vendor API request failed');
        }

        const leads = Array.isArray(result?.data) ? result.data : [];

        // ====================================================
        // 3. PROCESS LEADS
        // ====================================================

        let imported = 0;
        let skipped = 0;
        let failed = 0;
        const errors = [];

        for (const item of leads) {
            try {
                if (!item) {
                    skipped++;
                    continue;
                }

                // ---- Created date ----
                let leadCreatedAt = null;
                if (item.createdAt) {
                    const d = new Date(item.createdAt);
                    if (!Number.isNaN(d.getTime())) leadCreatedAt = d;
                }

                if (!leadCreatedAt) {
                    skipped++;
                    continue;
                }

                // ---- Ignore pre-connection leads ----
                if (leadCreatedAt.getTime() < new Date(connectedAt).getTime()) {
                    skipped++;
                    continue;
                }

                // ---- Normalise ----
                const name = trim(item.name);
                const phone = trim(item.phone);
                const email = trim(item.email);
                const companyName = trim(item.companyName);
                const gstNumber = trim(item.gstNumber);
                const place = trim(item.place);
                const product = trim(item.product);
                const message = trim(item.message);

                let leadUpdatedAt = leadCreatedAt;
                if (item.updatedAt) {
                    const d = new Date(item.updatedAt);
                    if (!Number.isNaN(d.getTime())) leadUpdatedAt = d;
                }

                let priceRange;
                if (item.priceRange !== undefined && item.priceRange !== null && item.priceRange !== '') {
                    const p = Number(item.priceRange);
                    if (!Number.isNaN(p)) priceRange = p;
                }

                // ---- Duplicate check (scoped to companyId) ----
                const dupQuery = {
                    companyId,
                    source: 'website',
                };
                if (phone) dupQuery.phone = phone;
                dupQuery.createdAt = {
                    $gte: new Date(leadCreatedAt.getTime() - 1000),
                    $lte: new Date(leadCreatedAt.getTime() + 1000),
                };

                const existing = await Lead.findOne(dupQuery).lean();
                if (existing) {
                    skipped++;
                    continue;
                }

                // ---- Create lead (companyId, not userId) ----
                await Lead.create({
                    companyId,
                    source: 'website',
                    name: name || 'Website Lead',
                    phone,
                    email: email || undefined,
                    companyName,
                    gstNumber,
                    place,
                    product,
                    message,
                    priceRange,
                    dealValue: 0,
                    stage: 'new',
                    status: 'open',
                    createdAt: leadCreatedAt,
                    updatedAt: leadUpdatedAt,
                    activities: [
                        {
                            type: 'lead_created',
                            description: 'Lead imported from BrandBnalo website',
                        },
                    ],
                });

                imported++;
            } catch (err) {
                failed++;
                console.error('❌ Lead import failed:', err?.message);
                errors.push({
                    id: item?._id || null,
                    name: item?.name || null,
                    phone: item?.phone || null,
                    error: err?.message || 'Unknown error',
                });
            }
        }

        // ====================================================
        // 4. UPDATE LAST SYNC TIME
        // ====================================================

        await Integration.updateOne({ _id: integration._id }, { $set: { lastSyncAt: new Date(), errorMessage: null } });

        console.log(`✅ Sync done — API: ${leads.length}, Imported: ${imported}, Skipped: ${skipped}, Failed: ${failed}`);

        return {
            success: true,
            message: 'Latest website leads synced successfully',
            total: leads.length,
            imported,
            skipped,
            failed,
            errors,
        };
    } catch (error) {
        console.error('❌ Website lead sync error:', error);

        // Record error on the integration
        try {
            await Integration.updateOne(
                { companyId, provider: 'website' },
                {
                    $set: {
                        lastSyncAt: new Date(),
                        errorMessage: error?.message || 'Website lead sync failed',
                    },
                }
            );
        } catch (updateErr) {
            console.error('❌ Failed to update integration:', updateErr);
        }

        return emptyResult(error?.message || 'Website lead sync failed');
    }
}

// ============================================================
// HELPERS
// ============================================================

function trim(v) {
    return typeof v === 'string' ? v.trim() : '';
}

function emptyResult(message) {
    return {
        success: false,
        message,
        total: 0,
        imported: 0,
        skipped: 0,
        failed: 0,
        errors: [],
    };
}
