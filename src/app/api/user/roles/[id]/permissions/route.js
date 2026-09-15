import { NextResponse } from "next/server";
import { connectDB } from "@/config/db";
import Role from "@/models/role.model.js";
import { getCurrentUser } from "@/utils/auth";
import { PERMISSION_MODULES } from "@/constants/permissions.js";

export async function PUT(request, { params }) {
    try {
        await connectDB();

        const user = await getCurrentUser(request);

        if (!user) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Unauthorized",
                },
                { status: 401 }
            );
        }

        const { id } = await params;
        const body = await request.json();

        const { permissions } = body;

        // ---------------------------------------
        // VALIDATE ARRAY
        // ---------------------------------------

        if (!Array.isArray(permissions)) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Permissions must be an array.",
                },
                { status: 400 }
            );
        }

        // ---------------------------------------
        // FIND ROLE
        // ---------------------------------------

        const role = await Role.findOne({
            _id: id,
            companyId: user.companyId,
        });

        if (!role) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Role not found.",
                },
                { status: 404 }
            );
        }

        // ---------------------------------------
        // PROTECT SYSTEM ADMIN ROLE
        // ---------------------------------------

        if (
            role.isSystemRole ||
            role.name?.toLowerCase() === "admin"
        ) {
            return NextResponse.json(
                {
                    success: false,
                    message:
                        "Admin system role permissions cannot be changed.",
                },
                { status: 403 }
            );
        }

        // ---------------------------------------
        // VALID MODULES
        // ---------------------------------------

        const validModules = new Map(
            PERMISSION_MODULES.map((module) => [
                module.key,
                module,
            ])
        );

        // ---------------------------------------
        // CLEAN + VALIDATE PERMISSIONS
        // ---------------------------------------

        const cleanPermissions = [];

        for (const permission of permissions) {
            if (!permission || typeof permission !== "object") {
                continue;
            }

            const moduleKey = permission.module;

            const module = validModules.get(moduleKey);

            // Ignore unknown modules
            if (!module) {
                continue;
            }

            // ---------------------------------------
            // VALID ACTIONS
            // ---------------------------------------

            const actions = Array.isArray(
                permission.actions
            )
                ? permission.actions
                : [];

            const validActions = [
                ...new Set(
                    actions.filter(
                        (action) =>
                            typeof action === "string" &&
                            module.actions.includes(action)
                    )
                ),
            ];

            // ---------------------------------------
            // VALID SCOPE
            // ---------------------------------------

            const allowedScopes = [
                "own",
                "team",
                "all",
            ];

            const scope = allowedScopes.includes(
                permission.scope
            )
                ? permission.scope
                : "own";

            // ---------------------------------------
            // ONLY SAVE MODULE IF IT HAS ACTIONS
            // ---------------------------------------

            if (validActions.length > 0) {
                cleanPermissions.push({
                    module: moduleKey,
                    actions: validActions,
                    scope,
                });
            }
        }

        // ---------------------------------------
        // REMOVE DUPLICATE MODULES
        // ---------------------------------------

        const uniquePermissions = [];

        const usedModules = new Set();

        for (const permission of cleanPermissions) {
            if (usedModules.has(permission.module)) {
                continue;
            }

            usedModules.add(permission.module);

            uniquePermissions.push(permission);
        }

        // ---------------------------------------
        // UPDATE ROLE
        // ---------------------------------------

        role.permissions = uniquePermissions;

        await role.save();

        // ---------------------------------------
        // RETURN UPDATED ROLE
        // ---------------------------------------

        const updatedRole = await Role.findById(
            role._id
        )
            .populate("createdBy", "name email")
            .lean();

        return NextResponse.json(
            {
                success: true,
                message:
                    "Permissions updated successfully.",
                data: updatedRole,
            },
            { status: 200 }
        );

    } catch (error) {
        console.error(
            "UPDATE ROLE PERMISSIONS ERROR:",
            error
        );

        return NextResponse.json(
            {
                success: false,
                message:
                    error.message ||
                    "Failed to update permissions.",
            },
            {
                status:
                    error.name ===
                        "JsonWebTokenError"
                        ? 401
                        : 400,
            }
        );
    }
}