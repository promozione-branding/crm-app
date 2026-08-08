import mongoose from "mongoose";

const LeadTaskSchema = new mongoose.Schema({
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

    priority: {
        type: String,
        enum: ["low", "medium", "high", "urgent"],
        default: "medium",
    },

    assignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },

    dueDate: {
        type: Date,
        required: true,
    },

    reminderMinutes: {
        type: Number,
        enum: [0, 5, 10, 15],
        default: 0,
    },

    reminderAt: {
        type: Date,
        default: null,
    },

    status: {
        type: String,
        enum: ["pending", "completed", "cancelled",],
        default: "pending",
        index: true,
    },

    completedAt: {
        type: Date,
        default: null,
    },

    completedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: null,
    },

    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
}, { timestamps: true, });

LeadTaskSchema.index({ companyId: 1, leadId: 1, });
export default mongoose.models.LeadTask || mongoose.model("LeadTask", LeadTaskSchema);