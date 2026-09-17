// src/components/user/team/PermissionModal.jsx

"use client";

import React, { useEffect, useState } from "react";
import { Pencil, Check } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";
import Modal from "../ui/Modal";
import {
    PERMISSION_ACTIONS,
    PERMISSION_MODULES,
} from "@/constants/permissions.js";

const SCOPES = [
    {
        key: "own",
        label: "Own",
    },
    {
        key: "team",
        label: "Team",
    },
    {
        key: "all",
        label: "All",
    },
];

export default function PermissionModal({
    role,
    isOpen,
    onClose,
    fetchRoles,
}) {
    const [editing, setEditing] = useState(false);
    const [saving, setSaving] = useState(false);
    const [permissions, setPermissions] = useState({});

    /*
     * Convert database permissions into UI state
     *
     * DB:
     * [
     *   {
     *      module: "leads",
     *      actions: ["access", "add", "edit"],
     *      scope: "own"
     *   }
     * ]
     *
     * UI:
     * {
     *   leads: {
     *      access: true,
     *      add: true,
     *      edit: true,
     *      delete: false,
     *      scope: "own"
     *   }
     * }
     */

    const buildPermissionState = (rolePermissions = []) => {
        const state = {};

        PERMISSION_MODULES.forEach((module) => {
            const existingPermission = rolePermissions.find(
                (permission) =>
                    permission?.module === module.key
            );

            state[module.key] = {
                scope:
                    existingPermission?.scope || "own",
            };

            PERMISSION_ACTIONS.forEach((action) => {
                state[module.key][action.key] =
                    existingPermission?.actions?.includes(
                        action.key
                    ) || false;
            });
        });

        return state;
    };

    // LOAD PERMISSIONS
    useEffect(() => {
        if (!role) {
            setPermissions({});
            return;
        }

        setPermissions(
            buildPermissionState(role.permissions)
        );
    }, [role]);

    // TOGGLE ACTION
    const togglePermission = (
        moduleKey,
        actionKey
    ) => {
        if (!editing) return;

        setPermissions((prev) => ({
            ...prev,

            [moduleKey]: {
                ...prev[moduleKey],

                [actionKey]:
                    !prev[moduleKey]?.[actionKey],
            },
        }));
    };

    // CHANGE SCOPE
    const changeScope = (
        moduleKey,
        scope
    ) => {
        if (!editing) return;

        setPermissions((prev) => ({
            ...prev,

            [moduleKey]: {
                ...prev[moduleKey],
                scope,
            },
        }));
    };

    // SAVE
    const handleSave = async () => {
        if (!role?._id) return;

        const toastId = toast.loading(
            "Updating permissions..."
        );

        try {
            setSaving(true);

            const permissionArray = [];

            PERMISSION_MODULES.forEach((module) => {
                const modulePermission =
                    permissions[module.key];

                if (!modulePermission) return;

                const actions =
                    PERMISSION_ACTIONS
                        .filter(
                            (action) =>
                                module.actions.includes(
                                    action.key
                                ) &&
                                modulePermission[
                                action.key
                                ]
                        )
                        .map(
                            (action) => action.key
                        );

                /*
                 * Only save modules that have at least
                 * one permission.
                 */
                if (actions.length > 0) {
                    permissionArray.push({
                        module: module.key,
                        actions,
                        scope:
                            modulePermission.scope ||
                            "own",
                    });
                }
            });

            const response = await axios.put(
                `/api/user/roles/${role._id}/permissions`,
                {
                    permissions: permissionArray,
                },
                {
                    withCredentials: true,
                }
            );

            if (!response.data.success) {
                throw new Error(
                    response.data.message ||
                    "Failed to update permissions."
                );
            }

            toast.success(
                response.data.message ||
                "Permissions updated successfully.",
                {
                    id: toastId,
                }
            );

            setEditing(false);

            await fetchRoles();

            onClose();

        } catch (error) {
            console.error(
                "UPDATE PERMISSIONS ERROR:",
                error
            );

            toast.error(
                error?.response?.data?.message ||
                error.message ||
                "Failed to update permissions.",
                {
                    id: toastId,
                }
            );
        } finally {
            setSaving(false);
        }
    };

    // CANCEL EDITING
    const handleCancelEdit = () => {
        setEditing(false);

        if (role) {
            setPermissions(
                buildPermissionState(
                    role.permissions
                )
            );
        }
    };

    const handleClose = () => {
        if (saving) return;

        setEditing(false);

        if (role) {
            setPermissions(
                buildPermissionState(
                    role.permissions
                )
            );
        }

        onClose();
    };

    if (!role) return null;

    return (
        <Modal
            isOpen={isOpen}
            onClose={handleClose}
            size="full"
        >
            <Modal.Header>

                <div className="flex items-center justify-between w-full">

                    <div>
                        <div className="text-base font-semibold">
                            {role.name} — Permissions
                        </div>

                        <div className="text-xs opacity-60 mt-1">
                            {editing
                                ? "Edit permissions and save your changes"
                                : "Live from database · Click Edit to make changes"}
                        </div>
                    </div>

                </div>

            </Modal.Header>

            <Modal.Body>

                <div className="border border-app rounded-xl overflow-hidden">

                    {/* HEADER */}
                    <div className="overflow-x-auto">

                        <div
                            className="
                                grid
                                grid-cols-[minmax(180px,1fr)_repeat(8,70px)_100px]
                                items-center
                                border-b
                                border-app
                                bg-app
                                px-4
                                py-3
                                text-xs
                                font-medium
                                opacity-70
                                min-w-[950px]
                            "
                        >

                            <div>
                                Module
                            </div>

                            {PERMISSION_ACTIONS.map(
                                (action) => (
                                    <div
                                        key={action.key}
                                        className="text-center"
                                    >
                                        {action.label}
                                    </div>
                                )
                            )}

                            <div className="text-center">
                                Scope
                            </div>

                        </div>

                    </div>

                    {/* ROWS */}
                    <div className="overflow-x-auto">

                        <div className="min-w-[950px]">

                            {PERMISSION_MODULES.map(
                                (module) => {

                                    const moduleState =
                                        permissions[
                                        module.key
                                        ] || {};

                                    return (
                                        <div
                                            key={
                                                module.key
                                            }
                                            className="
                                                grid
                                                grid-cols-[minmax(180px,1fr)_repeat(8,70px)_100px]
                                                items-center
                                                border-b
                                                border-app
                                                last:border-0
                                                px-4
                                                py-3
                                            "
                                        >

                                            {/* MODULE */}
                                            <div className="text-sm font-medium">

                                                <div>
                                                    {
                                                        module.name
                                                    }
                                                </div>

                                                <div className="text-[10px] opacity-50 mt-0.5">
                                                    {
                                                        module.path
                                                    }
                                                </div>

                                            </div>

                                            {/* ACTIONS */}
                                            {PERMISSION_ACTIONS.map(
                                                (action) => {

                                                    const available =
                                                        module.actions.includes(
                                                            action.key
                                                        );

                                                    const checked =
                                                        moduleState[
                                                        action.key
                                                        ] ||
                                                        false;

                                                    if (
                                                        !available
                                                    ) {
                                                        return (
                                                            <div
                                                                key={
                                                                    action.key
                                                                }
                                                                className="
                                                                    flex
                                                                    justify-center
                                                                    text-sm
                                                                    opacity-40
                                                                "
                                                            >
                                                                —
                                                            </div>
                                                        );
                                                    }

                                                    return (
                                                        <div
                                                            key={
                                                                action.key
                                                            }
                                                            className="flex justify-center"
                                                        >

                                                            <button
                                                                type="button"
                                                                disabled={
                                                                    !editing
                                                                }
                                                                onClick={() =>
                                                                    togglePermission(
                                                                        module.key,
                                                                        action.key
                                                                    )
                                                                }
                                                                className={`
                                                                    w-4
                                                                    h-4
                                                                    rounded
                                                                    flex
                                                                    items-center
                                                                    justify-center
                                                                    transition

                                                                    ${checked
                                                                        ? "bg-blue-600 text-white"
                                                                        : "border border-app bg-transparent"
                                                                    }

                                                                    ${!editing
                                                                        ? "cursor-default"
                                                                        : "cursor-pointer"
                                                                    }
                                                                `}
                                                            >

                                                                {checked && (
                                                                    <Check
                                                                        size={
                                                                            11
                                                                        }
                                                                        strokeWidth={
                                                                            3
                                                                        }
                                                                    />
                                                                )}

                                                            </button>

                                                        </div>
                                                    );
                                                }
                                            )}

                                            {/* SCOPE */}
                                            <div className="flex justify-center">

                                                <select
                                                    value={
                                                        moduleState.scope ||
                                                        "own"
                                                    }
                                                    disabled={
                                                        !editing
                                                    }
                                                    onChange={(e) =>
                                                        changeScope(
                                                            module.key,
                                                            e.target
                                                                .value
                                                        )
                                                    }
                                                    className="
                                                        h-8
                                                        w-[90px]
                                                        rounded-lg
                                                        border
                                                        border-app
                                                        bg-app
                                                        px-2
                                                        text-xs
                                                        outline-none
                                                        disabled:opacity-60
                                                    "
                                                >

                                                    {SCOPES.map(
                                                        (scope) => (
                                                            <option
                                                                key={
                                                                    scope.key
                                                                }
                                                                value={
                                                                    scope.key
                                                                }
                                                            >
                                                                {
                                                                    scope.label
                                                                }
                                                            </option>
                                                        )
                                                    )}

                                                </select>

                                            </div>

                                        </div>
                                    );
                                }
                            )}

                        </div>

                    </div>

                </div>

            </Modal.Body>

            <Modal.Footer>

                {!editing ? (
                    <>

                        <button
                            onClick={
                                handleClose
                            }
                            className="
                                px-4
                                py-2
                                text-xs
                                rounded-lg
                                border
                                border-app
                                hover-app
                                text-app
                            "
                        >
                            Close
                        </button>

                        <button
                            onClick={() =>
                                setEditing(true)
                            }
                            className="
                                px-4
                                py-2
                                text-xs
                                rounded-lg
                                btn-primary
                                flex
                                items-center
                                gap-2
                            "
                        >
                            <Pencil size={14} />

                            Edit Permissions
                        </button>

                    </>
                ) : (
                    <>

                        <button
                            onClick={
                                handleCancelEdit
                            }
                            disabled={saving}
                            className="
                                px-4
                                py-2
                                text-xs
                                rounded-lg
                                border
                                border-app
                                hover-app
                                text-app
                            "
                        >
                            Cancel
                        </button>

                        <button
                            onClick={
                                handleSave
                            }
                            disabled={saving}
                            className="
                                px-4
                                py-2
                                text-xs
                                rounded-lg
                                btn-primary
                            "
                        >
                            {saving
                                ? "Saving..."
                                : "Save Permissions"}
                        </button>

                    </>
                )}

            </Modal.Footer>

        </Modal>
    );
}