import mongoose from "mongoose";

const companySchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
            index: true,
        },

        email: {
            type: String,
            unique: true,
            lowercase: true,
            trim: true,
        },

        phone: {
            type: String,
            trim: true,
        },

        website: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },

        crmDomain: {
            type: String,
            unique: true,
            sparse: true,
            required: true,
            trim: true,
            // Example: crm.astride.in
        },

        logoUrl: {
            type: String,
            default: "",
        },

        logoField: {
            type: String,
            default: "",
        },

        address: {
            type: String,
            default: "",
        },

        state: {
            type: String,
            default: "",
        },

        country: {
            type: String,
            default: "India",
        },

        plan: {
            type: String,
            enum: ["free", "starter", "growth", "pro", "elite"],
            default: "free",
            index: true,
        },

        maxEmployees: {
            type: Number,
            default: 2,
        },

        status: {
            type: String,
            enum: ["active", "inactive", "blocked"],
            default: "active",
            index: true,
        },

        subscriptionStart: {
            type: Date,
            default: null,
        },

        subscriptionEnd: {
            type: Date,
            default: null,
        },

        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "AdminUser",
            required: true,
            index: true,
        },
    },
    { timestamps: true, }
);


companySchema.index({ createdAt: -1 });
companySchema.index({ status: 1, plan: 1 });
companySchema.index({ website: 1 });
companySchema.index({ crmDomain: 1 });
export default mongoose.models.Company || mongoose.model("Company", companySchema);