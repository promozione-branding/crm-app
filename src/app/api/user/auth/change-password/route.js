import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/config/db";
import User from "@/models/user.model.js";
import { getCurrentUser } from "@/utils/auth";
import { comparePassword, hashPassword } from "@/utils/hashPassword";

export async function PATCH(request) {
    try {
        await connectDB();
        const userId = await getCurrentUser(request);
        if (!userId) {
            return NextResponse.json({ success: false, message: "Unauthorized", }, { status: 401 });
        }

        const body = await request.json();
        const { currentPassword, newPassword, confirmPassword, } = body;
        if (!currentPassword) {
            return NextResponse.json({ success: false, message: "Current password is required", }, { status: 400 });
        }

        if (!newPassword) {
            return NextResponse.json({ success: false, message: "New password is required", }, { status: 400 });
        }

        if (newPassword.length < 8) {
            return NextResponse.json({ success: false, message: "New password must be at least 8 characters", }, { status: 400 });
        }

        if (newPassword !== confirmPassword) {
            return NextResponse.json({ success: false, message: "Passwords do not match", }, { status: 400 });
        }

        const user = await User.findById(userId._id).select("+password");
        if (!user) {
            return NextResponse.json({ success: false, message: "User not found", }, { status: 404 });
        }

        // Verify old password
        const isPasswordCorrect = await comparePassword(currentPassword, user.password);
        if (!isPasswordCorrect) {
            return NextResponse.json({ success: false, message: "Current password is incorrect", }, { status: 400 });
        }

        // Don't allow the same password
        const isSamePassword = await comparePassword(newPassword, user.password);
        if (isSamePassword) {
            return NextResponse.json({ success: false, message: "New password must be different from current password", },
                { status: 400 });
        }

        // Hash new password
        const hashedPassword = await hashPassword(newPassword);
        user.password = hashedPassword;
        await user.save();
        return NextResponse.json({ success: true, message: "Password changed successfully", }, { status: 200 });

    } catch (error) {
        console.error("Change password error:", error);

        return NextResponse.json({ success: false, message: "Failed to change password", }, { status: 500 });
    }
}