// src/lib/mail/reminderMail.js

import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    service: 'gmail',

    auth: {
        user: process.env.YOUR_EMAIL_ADDRESS,
        pass: process.env.YOUR_APP_PASSWORD,
    },
});

// ============================================================
// HARD-CODED TEST EMAIL
// ============================================================

export async function testMail() {
    console.log('📧 Sending hard-coded test email...');

    try {
        const result = await transporter.sendMail({
            from: `"CRM" <${process.env.YOUR_EMAIL_ADDRESS}>`,
            to: 'y85880@gmail.com',
            subject: 'CRM Nodemailer Test',
            html: `
                <div style="
                    font-family: Arial, sans-serif;
                    max-width: 600px;
                    margin: auto;
                    padding: 20px;
                ">
                    <h2>🚀 Nodemailer Test</h2>

                    <p>
                        This is a hard-coded test email from the CRM.
                    </p>

                    <p>
                        If you received this email,
                        Gmail SMTP + Nodemailer is working correctly.
                    </p>

                    <hr />

                    <p>
                        <strong>Sent from:</strong>
                        ${process.env.YOUR_EMAIL_ADDRESS}
                    </p>

                    <p>
                        <strong>Time:</strong>
                        ${new Date().toLocaleString('en-IN')}
                    </p>
                </div>
            `,
        });

        console.log('✅ EMAIL SENT SUCCESSFULLY');
        console.log('📨 Message ID:', result.messageId);

        return result;
    } catch (error) {
        console.error('❌ EMAIL FAILED');
        console.error(error);

        throw error;
    }
}

// NEW LEAD CLIENT EMAIL
// NEW LEAD CLIENT EMAIL
export async function sendNewLeadEmail({ lead }) {
    console.log('========================================');
    console.log('📧 NEW LEAD EMAIL FUNCTION CALLED');
    console.log('========================================');

    console.log('Lead ID:', lead?._id);
    console.log('Lead Name:', lead?.name);
    console.log('Lead Email:', lead?.email);

    if (!lead) {
        console.error('❌ No lead object received.');
        return;
    }

    if (!lead.email) {
        console.error('❌ Lead was created WITHOUT an email address.');
        return;
    }

    console.log(`📧 Attempting to send email to: ${lead.email}`);

    try {
        // Verify SMTP connection
        await transporter.verify();

        console.log('✅ Gmail SMTP connection verified.');

        const result = await transporter.sendMail({
            from: `"CRM" <${process.env.YOUR_EMAIL_ADDRESS}>`,

            to: lead.email,

            subject: 'Thank you for contacting us',

            html: `
                    <div style="
                        font-family: Arial, sans-serif;
                        max-width: 600px;
                        margin: auto;
                        padding: 20px;
                        color: #333;
                    ">

                        <h2>
                            Thank You for Contacting Us
                        </h2>

                        <p>
                            Hi <strong>
                                ${lead.name || 'there'}
                            </strong>,
                        </p>

                        <p>
                            Thank you for contacting us.
                            We have received your enquiry successfully.
                        </p>

                        <p>
                            Our team will review your request
                            and get back to you shortly.
                        </p>

                        ${
                            lead.product
                                ? `
                                    <p>
                                        <strong>
                                            Product:
                                        </strong>
                                        ${lead.product}
                                    </p>
                                `
                                : ''
                        }

                        ${
                            lead.message
                                ? `
                                    <p>
                                        <strong>
                                            Your Message:
                                        </strong>
                                        ${lead.message}
                                    </p>
                                `
                                : ''
                        }

                        <hr />

                        <p>
                            Regards,<br />
                            <strong>CRM Team</strong>
                        </p>

                    </div>
                `,
        });

        console.log('========================================');

        console.log('✅ NEW LEAD EMAIL SENT SUCCESSFULLY');

        console.log('📨 Message ID:', result.messageId);

        console.log('📬 Sent To:', lead.email);

        console.log('========================================');

        return result;
    } catch (error) {
        console.error('========================================');

        console.error('❌ NEW LEAD EMAIL FAILED');

        console.error('Recipient:', lead.email);

        console.error('Error:', error);

        console.error('========================================');
    }
}
// ============================================================
// FORMAT DATE
// ============================================================

function formatDate(date) {
    return new Date(date).toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    });
}

// ============================================================
// FORMAT TIME
// ============================================================

function formatTime(date) {
    return new Date(date).toLocaleTimeString('en-IN', {
        hour: '2-digit',
        minute: '2-digit',
    });
}

// ============================================================
// MEETING REMINDER
// ============================================================

export async function sendMeetingReminderEmail({ to, userName, meeting }) {
    const date = formatDate(meeting.startAt);
    const time = formatTime(meeting.startAt);

    return transporter.sendMail({
        from: `"CRM" <${process.env.YOUR_EMAIL_ADDRESS}>`,
        to,
        subject: `Meeting Reminder - ${meeting.title}`,
        html: `
            <div style="
                font-family: Arial;
                max-width: 600px;
                margin: auto;
                padding: 20px;
            ">
                <h2>Meeting Reminder</h2>

                <p>
                    Hi <strong>${userName}</strong>,
                </p>

                <p>
                    You have an upcoming meeting.
                </p>

                <hr />

                <p>
                    <strong>Meeting:</strong>
                    ${meeting.title}
                </p>

                <p>
                    <strong>Person:</strong>
                    ${meeting.metPersonName}
                </p>

                <p>
                    <strong>Date:</strong>
                    ${date}
                </p>

                <p>
                    <strong>Time:</strong>
                    ${time}
                </p>

                <p>
                    <strong>Type:</strong>
                    ${meeting.meetingType}
                </p>

                ${
                    meeting.location?.address
                        ? `
                            <p>
                                <strong>Location:</strong>
                                ${meeting.location.address}
                            </p>
                        `
                        : ''
                }

                ${
                    meeting.meetingLink
                        ? `
                            <p>
                                <strong>Meeting Link:</strong>
                                <a href="${meeting.meetingLink}">
                                    Join Meeting
                                </a>
                            </p>
                        `
                        : ''
                }

                ${
                    meeting.description
                        ? `
                            <p>
                                <strong>Description:</strong>
                                ${meeting.description}
                            </p>
                        `
                        : ''
                }

                <hr />

                <p>
                    Please be ready before the meeting.
                </p>

            </div>
        `,
    });
}

// ============================================================
// TASK REMINDER
// ============================================================

export async function sendTaskReminderEmail({ to, userName, task }) {
    const date = formatDate(task.dueDate);
    const time = formatTime(task.dueDate);

    return transporter.sendMail({
        from: `"CRM" <${process.env.YOUR_EMAIL_ADDRESS}>`,
        to,
        subject: `Task Reminder - ${task.title}`,
        html: `
            <div style="
                font-family: Arial;
                max-width: 600px;
                margin: auto;
                padding: 20px;
            ">
                <h2>Task Reminder</h2>

                <p>
                    Hi <strong>${userName}</strong>,
                </p>

                <p>
                    You have an upcoming task.
                </p>

                <hr />

                <p>
                    <strong>Task:</strong>
                    ${task.title}
                </p>

                <p>
                    <strong>Priority:</strong>
                    ${task.priority}
                </p>

                <p>
                    <strong>Due Date:</strong>
                    ${date}
                </p>

                <p>
                    <strong>Due Time:</strong>
                    ${time}
                </p>

                ${
                    task.description
                        ? `
                            <p>
                                <strong>Description:</strong>
                                ${task.description}
                            </p>
                        `
                        : ''
                }

                <hr />

                <p>
                    Please complete the task before the due time.
                </p>

            </div>
        `,
    });
}
