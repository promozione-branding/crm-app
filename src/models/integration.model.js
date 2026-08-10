import mongoose from "mongoose";

const IntegrationSchema = new mongoose.Schema({
    companyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Company",
        required: true,
        index: true,
    },

    provider: {
        type: String,
        required: true,
        enum: ["meta", "google_ads", "whatsapp", "marketplace", "website", "calling",],
    },

    status: {
        type: String,
        enum: ["connected", "disconnected", "error", "pending",],
        default: "connected",
    },

    credentials: {
        accessToken: {
            type: String,
            default: null,
        },

        refreshToken: {
            type: String,
            default: null,
        },

        apiKey: {
            type: String,
            default: null,
        },

        apiSecret: {
            type: String,
            default: null,
        },

        expiresAt: {
            type: Date,
            default: null,
        },
    },

    account: {
        id: {
            type: String,
            default: null,
        },

        name: {
            type: String,
            default: null,
        },
    },

    metadata: {
        type: mongoose.Schema.Types.Mixed,
        default: {},
    },

    connectedAt: {
        type: Date,
        default: null,
    },

    lastSyncAt: {
        type: Date,
        default: null,
    },

    errorMessage: {
        type: String,
        default: null,
    },
}, { timestamps: true, });

IntegrationSchema.index({ companyId: 1, provider: 1 }, { unique: true });
export default mongoose.models.Integration || mongoose.model("Integration", IntegrationSchema);