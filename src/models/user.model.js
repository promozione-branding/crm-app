import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    companyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Company",
        required: true,
        index: true
    },

    name: {
        type: String,
        required: true,
        trim: true
    },

    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },

    phone: {
        type: String
    },

    password: {
        type: String,
        required: true
    },

    role: {
        type: String,
        enum: ["admin", "sub-admin", "manager", "employee"],
        default: "employee"
    },

    permissions: [String],

    status: {
        type: String,
        enum: ["active", "inactive"],
        default: "active"
    }

}, { timestamps: true });

export default mongoose.models.User || mongoose.model("User", UserSchema);