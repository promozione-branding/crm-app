import mongoose from "mongoose";

const NoteSchema = new mongoose.Schema({
    message: {
        type: String,
        required: true,
        trim: true,
    },

    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
}, { timestamps: true, _id: true, });

const ActivitySchema = new mongoose.Schema({
    type: {
        type: String,
        enum: [
            "lead_created",
            "lead_updated",
            "task_created",
            "task_updated",
            "stage_changed",
            "status_changed",
            "assigned",
            "note_added",
            "call",
            "email",
            "whatsapp",
            "meeting",
        ],
    },

    description: String,

    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
}, { timestamps: true, });

const StageHistorySchema = new mongoose.Schema({
    stage: {
        type: String,
        required: true,
    },

    description: String,
    reason: String,

    updatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
}, { timestamps: true, _id: true, });

const LeadSchema = new mongoose.Schema({
    companyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Company",
        required: true,
        index: true,
    },

    source: {
        type: String,
        enum: [
            "facebook",
            "google",
            "website",
            "whatsapp",
            "manual",
            "indiamart",
            "tradeindia",
            "other",
        ],
        default: "facebook",
        index: true,
    },

    metaLeadId: {
        type: String,
        sparse: true,
        unique: true,
        index: true,
    },

    name: {
        type: String,
        trim: true,
        required: true,
    },

    phone: {
        type: String,
        trim: true,
        index: true,
    },

    email: {
        type: String,
        trim: true,
        lowercase: true,
    },

    companyName: {
        type: String,
        trim: true,
    },

    gstNumber: {
        type: String,
        uppercase: true,
        trim: true,
    },

    place: {
        type: String,
        trim: true,
    },

    product: {
        type: String,
        trim: true,
    },

    message: {
        type: String,
        trim: true,
    },

    priceRange: Number,

    dealValue: {
        type: Number,
        default: 0,
    },

    expectedClosureDate: Date,

    stage: {
        type: String,
        enum: [
            "new",
            "contacted",
            "qualified",
            "proposal_sent",
            "negotiation",
            "won",
            "lost",
        ],
        default: "new",
        index: true,
    },

    status: {
        type: String,
        enum: [
            "open",
            "closed",
            "junk",
        ],
        default: "open",
    },

    assignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: null,
        index: true,
    },

    assignedAt: Date,

    campaignId: String,
    campaignName: String,

    notes: [NoteSchema],
    stageHistory: [StageHistorySchema],
    activities: [ActivitySchema],
}, { timestamps: true, });

LeadSchema.index({ companyId: 1, stage: 1, });
LeadSchema.index({ companyId: 1, assignedTo: 1, });
LeadSchema.index({ companyId: 1, source: 1, });
LeadSchema.index({ companyId: 1, createdAt: -1, });

export default mongoose.models.Lead || mongoose.model("Lead", LeadSchema);