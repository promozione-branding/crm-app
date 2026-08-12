import { NextResponse } from "next/server";
import { connectDB } from "@/config/db";
import Role from "@/models/role.model.js";
import { getCurrentUser } from "@/utils/auth";

export async function PUT(request, { params }) {
    try {
        await connectDB();
        const user = await getCurrentUser(request);
        const { id } = await params;
        const body = await request.json();
        const { name, description = "", } = body;

        if (!name?.trim()) {
            return NextResponse.json({ success: false, message: "Role name is required.", }, { status: 400 });
        }

        const role = await Role.findOne({ _id: id, companyId: user.companyId, });
        if (!role) {
            return NextResponse.json({ success: false, message: "Role not found.", }, { status: 404 });
        }

        if (role.isSystemRole && role.permissions.includes("*")) {
            return NextResponse.json({
                success: false,
                message: "System Admin role cannot be edited.",
            }, { status: 403 }
            );
        }

        const existingRole = await Role.findOne({
            companyId: user.companyId,
            name: { $regex: `^${name.trim()}$`, $options: "i", },
            _id: { $ne: id, },
        });
        if (existingRole) {
            return NextResponse.json({
                success: false,
                message: "A role with this name already exists.",
            }, { status: 409 });
        }

        role.name = name.trim();
        role.description = description?.trim() || "";
        await role.save();
        const updatedRole = await Role.findById(role._id).lean();

        return NextResponse.json({
            success: true,
            message: "Role updated successfully.",
            data: updatedRole,
        }, { status: 200 });

    } catch (error) {
        console.error("UPDATE ROLE ERROR:", error);

        return NextResponse.json(
            { success: false, message: error.message || "Failed to update role.", },
            { status: error.name === "JsonWebTokenError" ? 401 : 400, }
        );
    }
}