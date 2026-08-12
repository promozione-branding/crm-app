import { NextResponse } from "next/server";
import { connectDB } from "@/config/db";
import Role from "@/models/role.model.js";
import { getCurrentUser } from "@/utils/auth";

// GET ALL ROLES
export async function GET(req) {
    try {
        await connectDB();
        const user = await getCurrentUser(req);
        if (!user) {
            return NextResponse.json({ success: false, message: "User not found", }, { status: 404 });
        }

        const roles = await Role.find({ companyId: user.companyId })
            .populate("createdBy", "name email").sort({ createdAt: -1 });

        return NextResponse.json({ success: true, count: roles.length, roles, }, { status: 200 });
    } catch (error) {
        console.error("GET ROLES ERROR:", error);
        return NextResponse.json({ success: false, message: "Failed to fetch roles", }, { status: 500 });
    }
}

// CREATE ROLE
export async function POST(req) {
    try {
        await connectDB();
        const body = await req.json();
        const { name, description = "", permissions = [], } = body;
        const user = await getCurrentUser(req);
        if (!user) {
            return NextResponse.json({ success: false, message: "User not found", }, { status: 404 });
        }

        // Validate role name
        if (!name?.trim()) {
            return NextResponse.json({ success: false, message: "Role name is required", }, { status: 400 });
        }

        // Check duplicate role
        const existingRole = await Role.findOne({ companyId: user.companyId, name: name.trim(), });
        if (existingRole) {
            return NextResponse.json({ success: false, message: "A role with this name already exists", }, { status: 409 });
        }

        // Create role
        const role = await Role.create({
            companyId: user.companyId,
            name: name.trim(),
            description: description.trim(),
            permissions,
            createdBy: user._id,
        });

        return NextResponse.json({ success: true, message: "Role created successfully", role, }, { status: 201 });
    } catch (error) {
        console.error("CREATE ROLE ERROR:", error);
        return NextResponse.json({ success: false, message: "Failed to create role", }, { status: 500 });
    }
}