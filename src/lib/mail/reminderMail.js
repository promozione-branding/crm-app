import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    service: "gmail",

    auth: {
        user: process.env.YOUR_EMAIL_ADDRESS,
        pass: process.env.YOUR_APP_PASSWORD,
    },
});

// FORMAT DATE
function formatDate(date) {
    return new Date(date).toLocaleDateString(
        "en-IN", { day: "2-digit", month: "short", year: "numeric", }
    );
}

// FORMAT TIME
function formatTime(date) {
    return new Date(date).toLocaleTimeString(
        "en-IN", { hour: "2-digit", minute: "2-digit", }
    );
}

// MEETING REMINDER
export async function sendMeetingReminderEmail({ to, userName, meeting, }) {
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

                ${meeting.location?.address
                ? `
                            <p>
                                <strong>Location:</strong>
                                ${meeting.location.address}
                            </p>
                        `
                : ""
            }

                ${meeting.meetingLink
                ? `
                            <p>
                                <strong>Meeting Link:</strong>
                                <a href="${meeting.meetingLink}">
                                    Join Meeting
                                </a>
                            </p>
                        `
                : ""
            }

                ${meeting.description
                ? `
                            <p>
                                <strong>Description:</strong>
                                ${meeting.description}
                            </p>
                        `
                : ""
            }

                <hr />

                <p>
                    Please be ready before the meeting.
                </p>

            </div>
        `,
    });
}

// TASK REMINDER
export async function sendTaskReminderEmail({ to, userName, task, }) {
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

                ${task.description
                ? `
                            <p>
                                <strong>Description:</strong>
                                ${task.description}
                            </p>
                        `
                : ""
            }

                <hr />

                <p>
                    Please complete the task before the due time.
                </p>

            </div>
        `,
    });
}