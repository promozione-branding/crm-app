import mongoose from "mongoose";
import Meeting from "@/models/meeting.model.js";
import Lead from "@/models/leads.model.js";
import User from "@/models/user.model.js";

// CREATE MEETING
export const createMeetingService = async (user, body) => {
    if (!user) {
        throw new Error("User not found.");
    }

    const {
        leadId,
        metPersonName,
        title,
        description,
        assignedTo,
        startAt,
        endAt,
        meetingType,
        location,
        meetingLink,
        reminderMinutes,
        notes,
    } = body;

    // Validation
    if (!leadId || !mongoose.Types.ObjectId.isValid(leadId)) {
        throw new Error("Invalid lead id.");
    }

    if (!title?.trim()) {
        throw new Error("Meeting title is required.");
    }

    if (!metPersonName?.trim()) {
        throw new Error("Meeting person name is required.");
    }

    if (!assignedTo || !mongoose.Types.ObjectId.isValid(assignedTo)) {
        throw new Error("Invalid assigned user.");
    }

    if (!startAt) {
        throw new Error("Meeting start date and time is required.");
    }

    const startDate = new Date(startAt);
    if (isNaN(startDate.getTime())) {
        throw new Error("Invalid start date.");
    }

    let endDate = null;
    if (endAt) {
        endDate = new Date(endAt);
        if (isNaN(endDate.getTime())) {
            throw new Error("Invalid end date.");
        }

        if (endDate <= startDate) {
            throw new Error("End time must be after start time.");
        }
    }

    // Check Lead
    const lead = await Lead.findOne({ _id: leadId, companyId: user.companyId, });
    if (!lead) {
        throw new Error("Lead not found.");
    }

    // Check Assigned User
    const assignedUser = await User.findOne({ _id: assignedTo, companyId: user.companyId, status: "active", });
    if (!assignedUser) {
        throw new Error("Assigned user not found.");
    }

    // Reminder
    const reminder = Number(reminderMinutes || 0);
    if (![0, 5, 10, 15, 30, 60].includes(reminder)) {
        throw new Error("Invalid reminder option.");
    }

    let reminderAt = null;
    if (reminder > 0) {
        reminderAt = new Date(startDate.getTime() - reminder * 60 * 1000);
    }

    // Create
    const meeting = await Meeting.create({
        companyId: user.companyId,
        leadId,
        metPersonName: metPersonName.trim(),
        title: title.trim(),
        description: description?.trim() || "",
        assignedTo,
        startAt: startDate,
        endAt: endDate,
        meetingType: meetingType || "in_person",

        location: {
            type: location?.type || "custom",
            address: location?.address?.trim() || "",
            latitude: location?.latitude !== undefined && location?.latitude !== "" ? Number(location.latitude) : undefined,
            longitude: location?.longitude !== undefined && location?.longitude !== "" ? Number(location.longitude) : undefined,
        },

        meetingLink: meetingLink?.trim() || "",
        reminderMinutes: reminder,
        reminderAt,
        notes: notes?.trim() || "",
        createdBy: user._id,
    });

    // Add Lead Activity
    lead.activities.push({
        type: "meeting",
        title: "Meeting Scheduled",
        description: `${meeting.title} scheduled with ${meeting.metPersonName}.`,
        createdBy: user._id,
    });

    await lead.save();
    return await Meeting.findById(meeting._id)
        .populate("leadId", "name phone email companyName")
        .populate("assignedTo", "name email phone role")
        .populate("createdBy", "name email");
};

// GET ALL MEETINGS BY LEAD
export const getMeetingsByLeadService = async (user, leadId) => {
    if (!user) {
        throw new Error("User not found.");
    }

    if (!leadId || !mongoose.Types.ObjectId.isValid(leadId)) {
        throw new Error("Invalid lead id.");
    }

    // Make sure lead belongs to company
    const lead = await Lead.findOne({ _id: leadId, companyId: user.companyId, });
    if (!lead) {
        throw new Error("Lead not found.");
    }

    const meetings = await Meeting.find({ companyId: user.companyId, leadId, })
        .populate("assignedTo", "name email phone role")
        .populate("createdBy", "name email")
        .sort({ startAt: -1, }).lean();

    return meetings;
};

// GET SINGLE MEETING
export const getMeetingByIdService = async (user, meetingId) => {
    if (!user) {
        throw new Error("User not found.");
    }

    if (!mongoose.Types.ObjectId.isValid(meetingId)) {
        throw new Error("Invalid meeting id.");
    }

    const meeting = await Meeting.findOne({ _id: meetingId, companyId: user.companyId, })
        .populate("leadId", "name phone email companyName")
        .populate("assignedTo", "name email phone role")
        .populate("createdBy", "name email");

    if (!meeting) {
        throw new Error("Meeting not found.");
    }

    return meeting;
};

// UPDATE MEETING
export const updateMeetingService = async (user, meetingId, body) => {
    if (!user) {
        throw new Error("User not found.");
    }

    if (!mongoose.Types.ObjectId.isValid(meetingId)) {
        throw new Error("Invalid meeting id.");
    }

    const meeting = await Meeting.findOne({ _id: meetingId, companyId: user.companyId, });
    if (!meeting) {
        throw new Error("Meeting not found.");
    }

    // Basic fields
    if (body.title !== undefined) {
        if (!body.title.trim()) {
            throw new Error("Meeting title is required.");
        }

        meeting.title = body.title.trim();
    }

    if (body.metPersonName !== undefined) {
        if (!body.metPersonName.trim()) {
            throw new Error("Meeting person name is required.");
        }

        meeting.metPersonName = body.metPersonName.trim();
    }

    if (body.description !== undefined) {
        meeting.description = body.description.trim();
    }

    if (body.notes !== undefined) {
        meeting.notes = body.notes.trim();
    }

    if (body.meetingType !== undefined) {
        const allowed = ["in_person", "phone", "video", "other",];
        if (!allowed.includes(body.meetingType)) {
            throw new Error("Invalid meeting type.");
        }

        meeting.meetingType = body.meetingType;
    }

    if (body.meetingLink !== undefined) {
        meeting.meetingLink = body.meetingLink.trim();
    }

    // Assigned User
    if (body.assignedTo !== undefined) {
        if (!mongoose.Types.ObjectId.isValid(body.assignedTo)) {
            throw new Error("Invalid assigned user.");
        }

        const assignedUser = await User.findOne({ _id: body.assignedTo, companyId: user.companyId, status: "active", });
        if (!assignedUser) {
            throw new Error("Assigned user not found.");
        }

        meeting.assignedTo = body.assignedTo;
    }

    // Date
    if (body.startAt !== undefined) {
        const startDate = new Date(body.startAt);
        if (isNaN(startDate.getTime())) {
            throw new Error("Invalid start date.");
        }

        meeting.startAt = startDate;
    }

    if (body.endAt !== undefined) {
        if (!body.endAt) {
            meeting.endAt = null;
        } else {
            const endDate = new Date(body.endAt);
            if (isNaN(endDate.getTime())) {
                throw new Error("Invalid end date.");
            }

            meeting.endAt = endDate;
        }
    }

    if (meeting.endAt && meeting.endAt <= meeting.startAt) {
        throw new Error("End time must be after start time.");
    }

    // Status
    if (body.status !== undefined) {
        const allowed = ["scheduled", "completed", "cancelled", "no_show",];
        if (!allowed.includes(body.status)) {
            throw new Error("Invalid meeting status.");
        }

        meeting.status = body.status;
    }

    // Location
    if (body.location !== undefined) {
        meeting.location = {
            type: body.location?.type || meeting.location?.type || "custom",
            address: body.location?.address?.trim() || "",
            latitude: body.location?.latitude !== undefined && body.location?.latitude !== ""
                ? Number(body.location.latitude) : undefined,

            longitude: body.location?.longitude !== undefined && body.location?.longitude !== ""
                ? Number(body.location.longitude) : undefined,
        };
    }

    // Reminder
    if (body.reminderMinutes !== undefined) {
        const reminder = Number(body.reminderMinutes);
        if (![0, 5, 10, 15, 30, 60].includes(reminder)) {
            throw new Error("Invalid reminder option.");
        }

        meeting.reminderMinutes = reminder;
        if (reminder === 0) {
            meeting.reminderAt = null;
        } else {
            meeting.reminderAt = new Date(meeting.startAt.getTime() - reminder * 60 * 1000);
        }
    } else if (body.startAt !== undefined && meeting.reminderMinutes > 0) {
        meeting.reminderAt = new Date(meeting.startAt.getTime() - meeting.reminderMinutes * 60 * 1000);
    }

    await meeting.save();
    return await Meeting.findById(meeting._id)
        .populate("leadId", "name phone email companyName")
        .populate("assignedTo", "name email phone role")
        .populate("createdBy", "name email");
};

// DELETE MEETING
export const deleteMeetingService = async (user, meetingId) => {
    if (!user) {
        throw new Error("User not found.");
    }

    if (!mongoose.Types.ObjectId.isValid(meetingId)) {
        throw new Error("Invalid meeting id.");
    }

    const meeting = await Meeting.findOne({ _id: meetingId, companyId: user.companyId, });
    if (!meeting) {
        throw new Error("Meeting not found.");
    }

    await Meeting.deleteOne({ _id: meetingId, });
    return true;
};