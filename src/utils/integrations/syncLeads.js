// src/utils/integrations/syncLeads.js

import nodemailer from 'nodemailer';

import Integration from '@/models/integration.model';
import Lead from '@/models/leads.model';
import User from '@/models/user.model';
import Role from '@/models/role.model';

const BRAND_BNALO_API = process.env.BRAND_BNALO_API;

// ============================================================
// MAILER (inline — no new file)
// ============================================================

let mailerInstance = null;

function getMailer() {
    if (mailerInstance) return mailerInstance;

    const user = process.env.YOUR_EMAIL_ADDRESS;
    // Strip spaces — Gmail app passwords are shown with spaces for readability.
    const pass = (process.env.YOUR_APP_PASSWORD || '').replace(/\s+/g, '');

    if (!user || !pass) {
        console.warn('⚠️ Mailer disabled: YOUR_EMAIL_ADDRESS / YOUR_APP_PASSWORD missing.');
        return null;
    }

    mailerInstance = nodemailer.createTransport({
        service: 'gmail',
        auth: { user, pass },
    });

    return mailerInstance;
}

async function sendLeadEmail({ to, subject, html }) {
    if (!to) return;

    const transporter = getMailer();

    if (!transporter) return;

    try {
        await transporter.sendMail({
            from: `"CRM Leads" <${process.env.YOUR_EMAIL_ADDRESS}>`,
            to,
            subject,
            html,
        });

        console.log(`📧 Lead email sent → ${to}`);
    } catch (err) {
        // Never throw — email failures must not break the sync.
        console.error(`❌ Lead email failed → ${to}:`, err?.message);
    }
}

// ============================================================
// ADMIN LOOKUP
// ============================================================

async function findCompanyAdmins(companyId) {
    try {
        // Find the "admin" role(s). Your existing routes treat admin as
        // roleId.isSystemRole === true && roleId.name === 'admin'.
        const adminRoles = await Role.find({
            isSystemRole: true,
            name: { $regex: /^admin$/i },
        })
            .select('_id')
            .lean();

        if (!adminRoles.length) return [];

        const adminRoleIds = adminRoles.map((r) => r._id);

        const admins = await User.find({
            companyId,
            status: 'active',
            roleId: { $in: adminRoleIds },
        })
            .select('_id name email')
            .lean();

        return admins.filter((u) => u.email);
    } catch (err) {
        console.error('❌ Failed to load company admins:', err?.message);
        return [];
    }
}

// ============================================================
// EMAIL TEMPLATES
// ============================================================

function buildLeadEmailHtml({ lead, audience, assigneeName, appUrl }) {
    const safe = (v) => (v === undefined || v === null || v === '' ? '—' : String(v));

    const leadUrl = `${appUrl}/leads/edit/${lead._id}`;

    const heading =
        audience === 'admin' ? 'New Website Lead Received' : 'A New Lead Has Been Assigned to You';

    const intro =
        audience === 'admin'
            ? 'A new lead was imported from your website integration.'
            : `A new lead has been automatically assigned to you${assigneeName ? ` (${assigneeName})` : ''}.`;

    return `
        <div style="font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;line-height:1.5;color:#111;max-width:560px;margin:0 auto;">
            <h2 style="margin:0 0 8px;font-size:18px;">${heading}</h2>
            <p style="margin:0 0 16px;color:#444;">${intro}</p>

            <table style="width:100%;border-collapse:collapse;font-size:14px;">
                <tr><td style="padding:6px 0;color:#666;">Name</td><td style="padding:6px 0;font-weight:600;">${safe(lead.name)}</td></tr>
                <tr><td style="padding:6px 0;color:#666;">Phone</td><td style="padding:6px 0;">${safe(lead.phone)}</td></tr>
                <tr><td style="padding:6px 0;color:#666;">Email</td><td style="padding:6px 0;">${safe(lead.email)}</td></tr>
                <tr><td style="padding:6px 0;color:#666;">Company</td><td style="padding:6px 0;">${safe(lead.companyName)}</td></tr>
                <tr><td style="padding:6px 0;color:#666;">Place</td><td style="padding:6px 0;">${safe(lead.place)}</td></tr>
                <tr><td style="padding:6px 0;color:#666;">Product</td><td style="padding:6px 0;">${safe(lead.product)}</td></tr>
                <tr><td style="padding:6px 0;color:#666;">Message</td><td style="padding:6px 0;">${safe(lead.message)}</td></tr>
                <tr><td style="padding:6px 0;color:#666;">Source</td><td style="padding:6px 0;">${safe(lead.source)}</td></tr>
                <tr><td style="padding:6px 0;color:#666;">Assigned To</td><td style="padding:6px 0;">${safe(assigneeName || 'Unassigned')}</td></tr>
            </table>

            <p style="margin:20px 0 0;">
                <a href="${leadUrl}" style="display:inline-block;background:#2563eb;color:#fff;padding:10px 16px;border-radius:8px;text-decoration:none;font-weight:600;">View Lead</a>
            </p>

            <p style="margin:24px 0 0;font-size:12px;color:#888;">This is an automated message from your CRM.</p>
        </div>
    `;
}

// ============================================================
// NOTIFY (admin + assignee)
// ============================================================

async function notifyNewLead({ companyId, lead, assignedUser }) {
    try {
        const appUrl = (process.env.NEXT_PUBLIC_APP_URL || '').replace(/\/+$/, '');

        const assigneeEmail = assignedUser?.email || null;
        const assigneeName = assignedUser?.name || null;

        // Admin email(s)
        const admins = await findCompanyAdmins(companyId);
        const adminEmails = admins.map((a) => a.email).filter(Boolean);

        // Don't double-send to the assignee if they are also an admin.
        const adminRecipients = adminEmails.filter((e) => e.toLowerCase() !== (assigneeEmail || '').toLowerCase());

        const tasks = [];

        // --- Admin emails ---
        if (adminRecipients.length) {
            tasks.push(
                sendLeadEmail({
                    to: adminRecipients.join(','),
                    subject: `New Lead: ${lead.name || 'Website Lead'}`,
                    html: buildLeadEmailHtml({
                        lead,
                        audience: 'admin',
                        assigneeName,
                        appUrl,
                    }),
                })
            );
        }

        // --- Assignee email ---
        if (assigneeEmail) {
            tasks.push(
                sendLeadEmail({
                    to: assigneeEmail,
                    subject: `New Lead Assigned: ${lead.name || 'Website Lead'}`,
                    html: buildLeadEmailHtml({
                        lead,
                        audience: 'assignee',
                        assigneeName,
                        appUrl,
                    }),
                })
            );
        }

        if (tasks.length) {
            await Promise.allSettled(tasks);
        }
        
    } catch (err) {
        console.error('❌ notifyNewLead failed:', err?.message);
    }
}

// ============================================================
// MAIN SYNC
// ============================================================

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

        const connectedAt = integration.connectedAt;

        if (!connectedAt) {
            return emptyResult('Integration connectedAt is missing');
        }

        // ====================================================
        // 2. FIND THE WEBSITE SOURCE OWNER
        // ====================================================

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

                // --------------------------------------------
                // SEND EMAILS — admin + assignee
                // Fire-and-forget: never awaited, never blocks sync.
                // --------------------------------------------

                notifyNewLead({
                    companyId,
                    lead,
                    assignedUser: sourceOwner || null,
                }).catch((err) => {
                    console.error('❌ notifyNewLead threw:', err?.message);
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