import mongoose from "mongoose";

const LeadTaskSchema = new mongoose.Schema({
    companyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Company",
        required: true,
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
    },

    description: String,

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

    reminderAt: Date,

    status: {
        type: String,
        enum: [
            "pending",
            "completed",
            "cancelled",
        ],
        default: "pending",
    },

    completedAt: Date,

    completedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
}, { timestamps: true, });

export default mongoose.models.LeadTask || mongoose.model("LeadTask", LeadTaskSchema);