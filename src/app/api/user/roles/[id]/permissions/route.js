import { NextResponse } from "next/server";
import { connectDB } from "@/config/db";
import Role from "@/models/role.model.js";
import { getCurrentUser } from "@/utils/auth";

export async function PUT(request, { params }) {
    try {
        await connectDB();
        const user = await getCurrentUser(request);
        if (!user) {
            return NextResponse.json({ success: false, message: "Unauthorized", }, { status: 401 });
        }

        const { id } = await params;
        const body = await request.json();
        const { permissions } = body;

        // VALIDATE PERMISSIONS
        if (!Array.isArray(permissions)) {
            return NextResponse.json({ success: false, message: "Permissions must be an array.", }, { status: 400 });
        }

        // FIND ROLE
        const role = await Role.findOne({ _id: id, companyId: user.companyId, });
        if (!role) {
            return NextResponse.json({ success: false, message: "Role not found.", }, { status: 404 });
        }

        // PROTECT SYSTEM ADMIN ROLE
        if (role.isSystemRole || role.name.toLowerCase() === "admin") {
            return NextResponse.json({ success: false, message: "Admin system role permissions cannot be changed.", },
                { status: 403 });
        }

        // CLEAN PERMISSIONS
        const cleanPermissions = [
            ...new Set(permissions.filter((permission) => typeof permission === "string")
                .map((permission) => permission.trim()).filter(Boolean)
            ),
        ];

        // UPDATE
        role.permissions = cleanPermissions;
        await role.save();

        // RESPONSE
        const updatedRole = await Role.findById(role._id).lean();
        return NextResponse.json(
            { success: true, message: "Permissions updated successfully.", data: updatedRole, },
            { status: 200 }
        );

    } catch (error) {
        console.error("UPDATE ROLE PERMISSIONS ERROR:", error);

        return NextResponse.json(
            { success: false, message: error.message || "Failed to update permissions.", },
            { status: error.name === "JsonWebTokenError" ? 401 : 400, }
        );
    }
}