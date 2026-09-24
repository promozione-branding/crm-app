import nodemailer from 'nodemailer';
import User from '@/models/user.model.js';
import Role from '@/models/role.model.js';

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.YOUR_EMAIL_ADDRESS,
        pass: process.env.YOUR_APP_PASSWORD,
    },
});

// ============================================================
// HELPERS
// ============================================================

function escapeHtml(value) {
    if (value === null || value === undefined) return '';

    return String(value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

function formatDateTime(date) {
    if (!date) return 'N/A';

    return new Date(date).toLocaleString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
}

function getFrom() {
    return `"CRM" <${process.env.YOUR_EMAIL_ADDRESS}>`;
}

// ============================================================
// FIND COMPANY ADMINS
// ============================================================

export async function getCompanyAdmins(companyId) {
    try {
        console.log(
            `[EMAIL] 🔎 Finding admins for company: ${companyId}`
        );

        const adminRoles = await Role.find({
            companyId,
            name: {
                $regex: /^admin$/i,
            },
        }).select('_id name');

        if (!adminRoles.length) {
            console.error(
                `[EMAIL] ❌ No Admin role found for company: ${companyId}`
            );

            return [];
        }

        const roleIds = adminRoles.map((role) => role._id);

        const admins = await User.find({
            companyId,
            roleId: { $in: roleIds },
            status: 'active',
        }).select('name email');

        console.log(
            `[EMAIL] 👑 Found ${admins.length} active admin(s)`
        );

        return admins;
    } catch (error) {
        console.error(
            '[EMAIL] ❌ Failed to find company admins:',
            error
        );

        return [];
    }
}

// ============================================================
// NEW LEAD → ADMIN
// ============================================================

export async function sendNewLeadAdminEmail({
    lead,
    createdBy,
}) {
    try {
        console.log(
            `[EMAIL] 🆕 Preparing new lead email: ${lead?._id}`
        );

        const admins = await getCompanyAdmins(lead.companyId);

        const recipients = admins
            .map((admin) => admin.email)
            .filter(Boolean);

        if (!recipients.length) {
            console.error(
                `[EMAIL] ❌ No admin email found for lead: ${lead?._id}`
            );
            return;
        }

        const html = `
            <div style="font-family:Arial,sans-serif;max-width:650px;margin:auto;padding:24px;border:1px solid #ddd;border-radius:8px">
                <h2>🆕 New Lead Created</h2>

                <p>A new lead has been created in the CRM.</p>

                <hr>

                <h3>Lead Information</h3>

                <p><strong>Name:</strong> ${escapeHtml(lead.name)}</p>
                <p><strong>Phone:</strong> ${escapeHtml(lead.phone || 'N/A')}</p>
                <p><strong>Email:</strong> ${escapeHtml(lead.email || 'N/A')}</p>
                <p><strong>Company:</strong> ${escapeHtml(lead.companyName || 'N/A')}</p>
                <p><strong>Source:</strong> ${escapeHtml(lead.source || 'N/A')}</p>
                <p><strong>Product:</strong> ${escapeHtml(lead.product || 'N/A')}</p>
                <p><strong>Stage:</strong> ${escapeHtml(lead.stage || 'N/A')}</p>
                <p><strong>Status:</strong> ${escapeHtml(lead.status || 'N/A')}</p>
                <p><strong>Created At:</strong> ${formatDateTime(lead.createdAt)}</p>
                <p><strong>Created By:</strong> ${escapeHtml(createdBy?.name || 'System')}</p>

                <hr>

                <p style="color:#666">
                    This is an automated CRM notification.
                </p>
            </div>
        `;

        console.log(
            `[EMAIL] 📤 Sending new lead email to: ${recipients.join(', ')}`
        );

        const result = await transporter.sendMail({
            from: getFrom(),
            to: recipients.join(', '),
            subject: `New Lead Created - ${lead.name}`,
            html,
        });

        console.log(
            `[EMAIL] ✅ New lead email sent: ${result.messageId}`
        );
    } catch (error) {
        console.error(
            `[EMAIL] ❌ New lead email failed:`,
            error
        );
    }
}

// ============================================================
// LEAD STATUS / STAGE CHANGED → ADMIN
// ============================================================

export async function sendLeadStatusChangedAdminEmail({
    lead,
    changedBy,
    oldStatus,
    newStatus,
    oldStage,
    newStage,
}) {
    try {
        console.log(
            `[EMAIL] 🔄 Preparing lead status email: ${lead?._id}`
        );

        const admins = await getCompanyAdmins(lead.companyId);

        const recipients = admins
            .map((admin) => admin.email)
            .filter(Boolean);

        if (!recipients.length) {
            console.error(
                `[EMAIL] ❌ No admin email found for status change`
            );
            return;
        }

        const statusChanged =
            oldStatus !== newStatus;

        const stageChanged =
            oldStage !== newStage;

        if (!statusChanged && !stageChanged) {
            console.log(
                `[EMAIL] ℹ️ No status/stage change detected`
            );
            return;
        }

        let changes = '';

        if (statusChanged) {
            changes += `
                <p>
                    <strong>Status:</strong>
                    ${escapeHtml(oldStatus)}
                    →
                    ${escapeHtml(newStatus)}
                </p>
            `;
        }

        if (stageChanged) {
            changes += `
                <p>
                    <strong>Stage:</strong>
                    ${escapeHtml(oldStage)}
                    →
                    ${escapeHtml(newStage)}
                </p>
            `;
        }

        const html = `
            <div style="font-family:Arial,sans-serif;max-width:650px;margin:auto;padding:24px;border:1px solid #ddd;border-radius:8px">
                <h2>🔄 Lead Updated</h2>

                <p>A lead's status or stage has been changed.</p>

                <hr>

                <p><strong>Lead:</strong> ${escapeHtml(lead.name)}</p>
                <p><strong>Phone:</strong> ${escapeHtml(lead.phone || 'N/A')}</p>

                <h3>Changes</h3>

                ${changes}

                <p><strong>Updated By:</strong> ${escapeHtml(changedBy?.name || 'System')}</p>
                <p><strong>Updated At:</strong> ${formatDateTime(new Date())}</p>

                <hr>

                <p style="color:#666">
                    This is an automated CRM notification.
                </p>
            </div>
        `;

        console.log(
            `[EMAIL] 📤 Sending lead status email to: ${recipients.join(', ')}`
        );

        const result = await transporter.sendMail({
            from: getFrom(),
            to: recipients.join(', '),
            subject: `Lead Updated - ${lead.name}`,
            html,
        });

        console.log(
            `[EMAIL] ✅ Lead status email sent: ${result.messageId}`
        );
    } catch (error) {
        console.error(
            `[EMAIL] ❌ Lead status email failed:`,
            error
        );
    }
}

// ============================================================
// LEAD ASSIGNED → ASSIGNED USER
// ============================================================

export async function sendLeadAssignedEmail({
    lead,
    assignedUser,
    assignedBy,
}) {
    try {
        console.log(
            `[EMAIL] 👤 Preparing lead assignment email: ${lead?._id}`
        );

        if (!assignedUser?.email) {
            console.error(
                `[EMAIL] ❌ Assigned user email missing`
            );
            return;
        }

        const html = `
            <div style="font-family:Arial,sans-serif;max-width:650px;margin:auto;padding:24px;border:1px solid #ddd;border-radius:8px">
                <h2>👤 New Lead Assigned</h2>

                <p>
                    Hello ${escapeHtml(assignedUser.name || 'User')},
                </p>

                <p>A lead has been assigned to you.</p>

                <hr>

                <h3>Lead Information</h3>

                <p><strong>Name:</strong> ${escapeHtml(lead.name)}</p>
                <p><strong>Phone:</strong> ${escapeHtml(lead.phone || 'N/A')}</p>
                <p><strong>Email:</strong> ${escapeHtml(lead.email || 'N/A')}</p>
                <p><strong>Company:</strong> ${escapeHtml(lead.companyName || 'N/A')}</p>
                <p><strong>Product:</strong> ${escapeHtml(lead.product || 'N/A')}</p>
                <p><strong>Stage:</strong> ${escapeHtml(lead.stage || 'N/A')}</p>
                <p><strong>Status:</strong> ${escapeHtml(lead.status || 'N/A')}</p>

                <hr>

                <p><strong>Assigned By:</strong> ${escapeHtml(assignedBy?.name || 'System')}</p>
                <p><strong>Assigned At:</strong> ${formatDateTime(new Date())}</p>

                <hr>

                <p style="color:#666">
                    This is an automated CRM notification.
                </p>
            </div>
        `;

        console.log(
            `[EMAIL] 📤 Sending lead assignment email to: ${assignedUser.email}`
        );

        const result = await transporter.sendMail({
            from: getFrom(),
            to: assignedUser.email,
            subject: `New Lead Assigned - ${lead.name}`,
            html,
        });

        console.log(
            `[EMAIL] ✅ Lead assignment email sent: ${result.messageId}`
        );
    } catch (error) {
        console.error(
            `[EMAIL] ❌ Lead assignment email failed:`,
            error
        );
    }
}

// ============================================================
// TASK ASSIGNED → ASSIGNED USER
// ============================================================

export async function sendTaskAssignedEmail({
    task,
    assignedUser,
    assignedBy,
}) {
    try {
        console.log(
            `[EMAIL] 📋 Preparing task assignment email: ${task?._id}`
        );

        if (!assignedUser?.email) {
            console.error(
                `[EMAIL] ❌ Task assigned user email missing`
            );
            return;
        }

        const lead = task.leadId;

        const html = `
            <div style="font-family:Arial,sans-serif;max-width:650px;margin:auto;padding:24px;border:1px solid #ddd;border-radius:8px">
                <h2>📋 New Task Assigned</h2>

                <p>
                    Hello ${escapeHtml(assignedUser.name || 'User')},
                </p>

                <p>A task has been assigned to you.</p>

                <hr>

                <h3>Task Information</h3>

                <p><strong>Task:</strong> ${escapeHtml(task.title)}</p>
                <p><strong>Description:</strong> ${escapeHtml(task.description || 'N/A')}</p>
                <p><strong>Priority:</strong> ${escapeHtml(task.priority || 'N/A')}</p>
                <p><strong>Due Date:</strong> ${formatDateTime(task.dueDate)}</p>

                <hr>

                <h3>Lead Information</h3>

                <p><strong>Name:</strong> ${escapeHtml(lead?.name || 'N/A')}</p>
                <p><strong>Phone:</strong> ${escapeHtml(lead?.phone || 'N/A')}</p>
                <p><strong>Email:</strong> ${escapeHtml(lead?.email || 'N/A')}</p>

                <hr>

                <p><strong>Assigned By:</strong> ${escapeHtml(assignedBy?.name || 'System')}</p>
                <p><strong>Assigned At:</strong> ${formatDateTime(new Date())}</p>

                <hr>

                <p style="color:#666">
                    This is an automated CRM notification.
                </p>
            </div>
        `;

        console.log(
            `[EMAIL] 📤 Sending task assignment email to: ${assignedUser.email}`
        );

        const result = await transporter.sendMail({
            from: getFrom(),
            to: assignedUser.email,
            subject: `New Task Assigned - ${task.title}`,
            html,
        });

        console.log(
            `[EMAIL] ✅ Task assignment email sent: ${result.messageId}`
        );
    } catch (error) {
        console.error(
            `[EMAIL] ❌ Task assignment email failed:`,
            error
        );
    }
}

// ============================================================
// MEETING ASSIGNED → ASSIGNED USER
// ============================================================

export async function sendMeetingAssignedEmail({
    meeting,
    assignedUser,
    assignedBy,
}) {
    try {
        console.log(
            `[EMAIL] 📅 Preparing meeting assignment email: ${meeting?._id}`
        );

        if (!assignedUser?.email) {
            console.error(
                `[EMAIL] ❌ Meeting assigned user email missing`
            );
            return;
        }

        const lead = meeting.leadId;

        const html = `
            <div style="font-family:Arial,sans-serif;max-width:650px;margin:auto;padding:24px;border:1px solid #ddd;border-radius:8px">
                <h2>📅 New Meeting Assigned</h2>

                <p>
                    Hello ${escapeHtml(assignedUser.name || 'User')},
                </p>

                <p>A meeting has been assigned to you.</p>

                <hr>

                <h3>Meeting Information</h3>

                <p><strong>Title:</strong> ${escapeHtml(meeting.title)}</p>
                <p><strong>Person:</strong> ${escapeHtml(meeting.metPersonName)}</p>
                <p><strong>Date & Time:</strong> ${formatDateTime(meeting.startAt)}</p>
                <p><strong>Meeting Type:</strong> ${escapeHtml(meeting.meetingType || 'N/A')}</p>
                <p><strong>Location:</strong> ${escapeHtml(meeting.location?.address || 'N/A')}</p>
                <p><strong>Meeting Link:</strong> ${escapeHtml(meeting.meetingLink || 'N/A')}</p>
                <p><strong>Description:</strong> ${escapeHtml(meeting.description || 'N/A')}</p>

                <hr>

                <h3>Lead Information</h3>

                <p><strong>Name:</strong> ${escapeHtml(lead?.name || 'N/A')}</p>
                <p><strong>Phone:</strong> ${escapeHtml(lead?.phone || 'N/A')}</p>
                <p><strong>Email:</strong> ${escapeHtml(lead?.email || 'N/A')}</p>

                <hr>

                <p><strong>Assigned By:</strong> ${escapeHtml(assignedBy?.name || 'System')}</p>
                <p><strong>Assigned At:</strong> ${formatDateTime(new Date())}</p>

                <hr>

                <p style="color:#666">
                    This is an automated CRM notification.
                </p>
            </div>
        `;

        console.log(
            `[EMAIL] 📤 Sending meeting assignment email to: ${assignedUser.email}`
        );

        const result = await transporter.sendMail({
            from: getFrom(),
            to: assignedUser.email,
            subject: `New Meeting Assigned - ${meeting.title}`,
            html,
        });

        console.log(
            `[EMAIL] ✅ Meeting assignment email sent: ${result.messageId}`
        );
    } catch (error) {
        console.error(
            `[EMAIL] ❌ Meeting assignment email failed:`,
            error
        );
    }
}
