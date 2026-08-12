import mongoose from "mongoose";

const RoleSchema = new mongoose.Schema({
    companyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Company",
        required: true,
        index: true,
    },

    name: {
        type: String,
        required: true,
        trim: true,
    },

    description: {
        type: String,
        trim: true,
        default: "",
    },

    permissions: [
        { type: [String], default: [], },
    ],

    isSystemRole: {
        type: Boolean,
        default: false,
    },

    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
}, { timestamps: true });

RoleSchema.index({ companyId: 1, name: 1 }, { unique: true });
export default mongoose.models.Role || mongoose.model("Role", RoleSchema);