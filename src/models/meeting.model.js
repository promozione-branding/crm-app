import mongoose from "mongoose";

const MeetingSchema = new mongoose.Schema({
    companyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Company",
        required: true,
        index: true,
    },

    leadId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Lead",
        required: true,
        index: true,
    },

    metPersonName: {
        type: String,
        required: true,
        trim: true,
    },

    title: {
        type: String,
        required: true,
        trim: true,
    },

    description: {
        type: String,
        trim: true,
        default: "",
    },

    assignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true,
    },

    startAt: {
        type: Date,
        required: true,
        index: true,
    },

    endAt: {
        type: Date,
    },

    status: {
        type: String,
        enum: [
            "scheduled",
            "completed",
            "cancelled",
            "no_show",
        ],
        default: "scheduled",
        index: true,
    },

    meetingType: {
        type: String,
        enum: [
            "in_person",
            "phone",
            "video",
            "other",
        ],
        default: "in_person",
    },

    location: {
        type: {
            type: String,
            enum: [
                "office",
                "client",
                "online",
            ],
            default: "custom",
        },

        address: {
            type: String,
            trim: true,
            default: "",
        },

        latitude: {
            type: Number,
        },

        longitude: {
            type: Number,
        },
    },

    meetingLink: {
        type: String,
        trim: true,
        default: "",
    },

    phoneNo: {
        type: String,
        default: "",
    },

    reminderMinutes: {
        type: Number,
        enum: [0, 5, 10, 15, 30, 60],
        default: 0,
    },

    reminderAt: {
        type: Date,
        default: null,
        index: true,
    },

    notes: {
        type: String,
        trim: true,
        default: "",
    },

    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
}, { timestamps: true, });

MeetingSchema.index({ companyId: 1, leadId: 1, startAt: -1, });
MeetingSchema.index({ companyId: 1, assignedTo: 1, startAt: 1, });
export default mongoose.models.Meeting || mongoose.model("Meeting", MeetingSchema);