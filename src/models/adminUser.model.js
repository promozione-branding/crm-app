import mongoose from "mongoose";

const adminUserSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },

        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },

        phone: {
            type: String,
            default: "",
            trim: true,
        },

        password: {
            type: String,
            required: true,
            select: false,
        },

        profileImage: {
            type: String,
            default: "",
        },

        role: {
            type: String,
            enum: [
                "owner",
                "superadmin",
                "sales",
                "support",
                "accounts",
                "developer",
            ],
            default: "support",
            index: true,
        },

        permissions: {
            type: [String],
            default: [],
        },

        status: {
            type: String,
            enum: ["active", "inactive", "blocked"],
            default: "active",
            index: true,
        },

        lastLogin: {
            type: Date,
            default: null,
        },

        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "AdminUser",
            default: null,
        },
    },
    { timestamps: true, }
);

// Indexes
adminUserSchema.index({ email: 1 });
adminUserSchema.index({ role: 1, status: 1 });

export default mongoose.models.AdminUser || mongoose.model("AdminUser", adminUserSchema);