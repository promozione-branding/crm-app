import { NextResponse } from "next/server";
import { connectDB } from "@/config/db";
import User from "@/models/user.model.js";
import { getCurrentUser } from "@/utils/auth";

export async function PATCH(request) {
    try {
        await connectDB();
        const userId = await getCurrentUser(request);
        if (!userId) {
            return NextResponse.json({ success: false, message: "Unauthorized", }, { status: 401 });
        }

        const body = await request.json();
        const { name, email, phone } = body;
        if (!name?.trim()) {
            return NextResponse.json({ success: false, message: "Name is required", }, { status: 400 });
        }

        if (!email?.trim()) {
            return NextResponse.json({ success: false, message: "Email is required", }, { status: 400 });
        }

        const normalizedEmail = email.trim().toLowerCase();
        const existingUser = await User.findOne({ email: normalizedEmail, _id: { $ne: userId._id }, });
        if (existingUser) {
            return NextResponse.json({ success: false, message: "Email is already in use", }, { status: 409 });
        }

        const user = await User.findByIdAndUpdate(userId._id,
            { $set: { name: name.trim(), email: normalizedEmail, phone: phone?.trim() || "", }, },
            { new: true, runValidators: true, }).populate("roleId", "name").select("-password");

        if (!user) {
            return NextResponse.json({ success: false, message: "User not found", }, { status: 404 });
        }

        return NextResponse.json({ success: true, message: "Profile updated successfully", user, }, { status: 200 });

    } catch (error) {
        console.error("Update profile error:", error);
        return NextResponse.json({ success: false, message: "Failed to update profile", }, { status: 500 });
    }
}