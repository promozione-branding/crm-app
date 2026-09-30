// src/utils/integrations/syncLeads.js

import Integration from '@/models/integration.model';
import Lead from '@/models/leads.model';
import User from '@/models/user.model';

const BRAND_BNALO_API = process.env.BRAND_BNALO_API;

export async function syncBrandBnaloLeads(companyId) {
    console.log('🔄 Website lead sync started:', String(companyId));

    try {
        if (!companyId) {
            return emptyResult('companyId is required');
        }

        if (!BRAND_BNALO_API) {
            return emptyResult('BRAND_BNALO_API environment variable is missing');
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

        const sellerId = integration.metadata?.brandBnaloSellerId;

        if (!sellerId) {
            return emptyResult('BrandBnalo seller ID missing. Reconnect from the Integrations page.');
        }

        // Only import leads created after the integration was connected.
        const connectedAt = integration.connectedAt;

        if (!connectedAt) {
            return emptyResult('Integration connectedAt is missing');
        }

        // ====================================================
        // 2. FIND THE WEBSITE SOURCE OWNER
        // ====================================================

        // The company ID comes from the existing integration context.
        // Never use a company ID supplied by an external lead payload.
        const sourceOwner = await User.findOne({
            companyId,
            status: 'active',
            leadSources: 'website',
        })
            .sort({ createdAt: 1, _id: 1 })
            .select('_id name email')
            .lean();

        const assignedUserId = sourceOwner?._id || null;

        if (sourceOwner) {
            console.log(`🌐 Website source owner: ${sourceOwner.name} (${sourceOwner._id})`);
        } else {
            console.log('⚠️ No active user is configured for the website source.');
        }

        // ====================================================
        // 3. FETCH LEADS FROM BRANDBNALO
        // ====================================================

        const url = `${BRAND_BNALO_API.replace(/\/+$/, '')}/${encodeURIComponent(sellerId)}`;

        const response = await fetch(url, {
            method: 'GET',
            cache: 'no-store',
            headers: {
                Accept: 'application/json',
            },
        });

        console.log('📡 Vendor API status:', response.status);

        if (!response.ok) {
            throw new Error(`Vendor API returned ${response.status}`);
        }

        const result = await response.json();

        if (!result?.success) {
            throw new Error(result?.message || 'BrandBnalo API request failed');
        }

        const leads = Array.isArray(result?.data) ? result.data : [];

        // ====================================================
        // 4. PROCESS INCOMING LEADS
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

                // --------------------------------------------
                // Validate the vendor's creation date
                // --------------------------------------------

                let leadCreatedAt = null;

                if (item.createdAt) {
                    const date = new Date(item.createdAt);

                    if (!Number.isNaN(date.getTime())) {
                        leadCreatedAt = date;
                    }
                }

                if (!leadCreatedAt) {
                    skipped++;
                    continue;
                }

                // --------------------------------------------
                // Ignore leads created before integration
                // --------------------------------------------

                if (leadCreatedAt.getTime() < new Date(connectedAt).getTime()) {
                    skipped++;
                    continue;
                }

                // --------------------------------------------
                // Normalize incoming fields
                // --------------------------------------------

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
                    const date = new Date(item.updatedAt);

                    if (!Number.isNaN(date.getTime())) {
                        leadUpdatedAt = date;
                    }
                }

                let priceRange;

                if (item.priceRange !== undefined && item.priceRange !== null && item.priceRange !== '') {
                    const parsedPrice = Number(item.priceRange);

                    if (Number.isFinite(parsedPrice)) {
                        priceRange = parsedPrice;
                    }
                }

                // --------------------------------------------
                // Check duplicates within this company
                // --------------------------------------------

                const duplicateQuery = {
                    companyId,
                    source: 'website',
                    createdAt: {
                        $gte: new Date(leadCreatedAt.getTime() - 1000),
                        $lte: new Date(leadCreatedAt.getTime() + 1000),
                    },
                };

                if (phone) {
                    duplicateQuery.phone = phone;
                }

                const existingLead = await Lead.findOne(duplicateQuery).lean();

                if (existingLead) {
                    skipped++;
                    continue;
                }

                // --------------------------------------------
                // Create the lead with automatic assignment
                // --------------------------------------------

                const lead = await Lead.create({
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

                    // Assign only to the configured source owner.
                    // If no owner exists, leave the lead unassigned.
                    assignedTo: assignedUserId,
                    assignedAt: assignedUserId ? new Date() : null,

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

                console.log('✅ Website lead imported:', {
                    leadId: String(lead._id),
                    companyId: String(companyId),
                    source: lead.source,
                    assignedTo: assignedUserId ? String(assignedUserId) : null,
                    assignedUser: sourceOwner?.name || null,
                });
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
        // 5. ASSIGN PREVIOUSLY IMPORTED, UNASSIGNED LEADS
        // ====================================================

        // Only assign leads belonging to this company.
        // Do not overwrite leads already assigned to another user.
        let assignedExisting = 0;

        if (assignedUserId) {
            const assignmentResult = await Lead.updateMany(
                {
                    companyId,
                    source: 'website',
                    $or: [{ assignedTo: null }, { assignedTo: { $exists: false } }],
                },
                {
                    $set: {
                        assignedTo: assignedUserId,
                        assignedAt: new Date(),
                    },
                }
            );

            assignedExisting = assignmentResult.modifiedCount || 0;

            if (assignedExisting > 0) {
                console.log(`🔄 Previously unassigned website leads assigned: ${assignedExisting}`);
            }
        }

        // ====================================================
        // 6. UPDATE INTEGRATION SYNC STATUS
        // ====================================================

        await Integration.updateOne(
            {
                _id: integration._id,
                companyId,
            },
            {
                $set: {
                    lastSyncAt: new Date(),
                    errorMessage: null,
                },
            }
        );

        console.log(
            `✅ Website sync completed — ` +
                `API: ${leads.length}, ` +
                `Imported: ${imported}, ` +
                `Existing assigned: ${assignedExisting}, ` +
                `Skipped: ${skipped}, ` +
                `Failed: ${failed}`
        );

        return {
            success: true,
            message: 'Website leads synced successfully',
            total: leads.length,
            imported,
            assignedExisting,
            skipped,
            failed,
            errors,
        };
    } catch (error) {
        console.error('❌ Website lead sync error:', error);

        // Record the failure against this company's integration.
        try {
            if (companyId) {
                await Integration.updateOne(
                    {
                        companyId,
                        provider: 'website',
                    },
                    {
                        $set: {
                            lastSyncAt: new Date(),
                            errorMessage: error?.message || 'Website lead sync failed',
                        },
                    }
                );
            }
        } catch (updateError) {
            console.error('❌ Failed to update integration status:', updateError);
        }

        return emptyResult(error?.message || 'Website lead sync failed');
    }
}

// ============================================================
// HELPERS
// ============================================================

function trim(value) {
    return typeof value === 'string' ? value.trim() : '';
}

function emptyResult(message) {
    return {
        success: false,
        message,
        total: 0,
        imported: 0,
        assignedExisting: 0,
        skipped: 0,
        failed: 0,
        errors: [],
    };
}
