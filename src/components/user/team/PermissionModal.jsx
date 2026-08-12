"use client";

import React, { useEffect, useState } from "react";
import { X, Pencil, Check } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";
import Modal from "../ui/Modal";
import { PERMISSION_ACTIONS, PERMISSION_MODULES, } from "@/constants/permissions.js";

export default function PermissionModal({ role, isOpen, onClose, fetchRoles, }) {
    const [editing, setEditing] = useState(false);
    const [saving, setSaving] = useState(false);
    const [permissions, setPermissions] = useState({});

    // BUILD PERMISSION STATE
    useEffect(() => {
        if (!role) return;
        const permissionState = {};
        PERMISSION_MODULES.forEach((module) => {
            permissionState[module.key] = {};

            PERMISSION_ACTIONS.forEach((action) => {
                const permissionKey = `${module.key}.${action.key}`;
                permissionState[module.key][action.key] = role.permissions?.includes(permissionKey) || false;
            });
        });

        setPermissions(permissionState);
    }, [role]);

    // TOGGLE PERMISSION
    const togglePermission = (moduleKey, actionKey) => {
        if (!editing) return;

        setPermissions((prev) => ({
            ...prev,

            [moduleKey]: {
                ...prev[moduleKey],
                [actionKey]: !prev[moduleKey]?.[actionKey],
            },
        }));
    };

    const handleSave = async () => {
        if (!role?._id) return;
        const toastId = toast.loading("Updating permissions...");

        try {
            setSaving(true);
            const permissionArray = [];

            Object.entries(permissions).forEach(([moduleKey, actions]) => {
                Object.entries(actions).forEach(([actionKey, enabled]) => {
                    if (enabled) {
                        permissionArray.push(`${moduleKey}.${actionKey}`);
                    }
                });
            });

            const response = await axios.put(`/api/user/roles/${role._id}/permissions`, { permissions: permissionArray, });
            if (response.data.success) {
                toast.success(response.data.message || "Permissions updated successfully.", { id: toastId, });
                setEditing(false);
                await fetchRoles();
                onClose();
            } else {
                toast.error(response.data.message || "Failed to update permissions.", { id: toastId, });
            }

        } catch (error) {
            console.error("UPDATE PERMISSIONS ERROR:", error);
            toast.error(error?.response?.data?.message || "Failed to update permissions.", { id: toastId, });
        } finally {
            setSaving(false);
        }
    };

    const handleClose = () => {
        setEditing(false);
        onClose();
    };

    if (!role) return null;

    return (
        <Modal isOpen={isOpen} onClose={handleClose} size="full">
            <Modal.Header>
                <div className="flex items-center justify-between w-full">
                    <div>
                        <div className="text-base font-semibold">
                            {role.name} — Permissions
                        </div>

                        <div className="text-xs opacity-60 mt-1">
                            {editing
                                ? "Edit permissions and save your changes"
                                : "Live from database · Click Edit to make changes"
                            }
                        </div>
                    </div>
                </div>
            </Modal.Header>

            <Modal.Body>
                <div className="border border-app rounded-xl overflow-hidden">
                    <div className="grid grid-cols-[minmax(180px,1fr)_repeat(8,70px)] items-center border-b border-app bg-app px-4 py-3 text-xs font-medium opacity-70 min-w-[850px]">
                        <div>
                            Module
                        </div>

                        {PERMISSION_ACTIONS.map((action) => (
                            <div key={action.key} className="text-center">
                                {action.label}
                            </div>
                        ))}
                    </div>

                    <div className="overflow-x-auto">
                        <div className="min-w-[850px]">
                            {PERMISSION_MODULES.map((module) => (
                                <div key={module.key} className="grid grid-cols-[minmax(180px,1fr)_repeat(8,70px)] items-center border-b border-app last:border-0 px-4 py-3">
                                    <div className="text-sm font-medium">
                                        <div>
                                            {module.name}
                                        </div>

                                        <div className="text-[10px] opacity-50 mt-0.5">
                                            {module.path}
                                        </div>
                                    </div>

                                    {/* ACTIONS */}
                                    {PERMISSION_ACTIONS.map((action) => {
                                        const available = module.actions.includes(action.key);
                                        const checked = permissions[module.key]?.[action.key] || false;
                                        if (!available) {
                                            return (<div key={action.key} className="flex justify-center text-sm opacity-40">
                                                —
                                            </div>);
                                        }

                                        return (
                                            <div key={action.key} className="flex justify-center">
                                                <button type="button" disabled={!editing} onClick={() => togglePermission(module.key, action.key)}
                                                    className={`w-4 h-4 rounded flex items-center justify-center transition
                                                                ${checked ? "bg-blue-600 text-white" : "border border-app bg-transparent"}
                                                                ${!editing ? "cursor-default" : "cursor-pointer"}`}>
                                                    {checked && (<Check size={11} strokeWidth={3} />)}
                                                </button>
                                            </div>
                                        );
                                    })}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </Modal.Body>

            <Modal.Footer>
                {!editing ? (
                    <>
                        <button onClick={handleClose} className="px-4 py-2  text-xs rounded-lg border border-app hover-app text-app" >
                            Close
                        </button>

                        <button onClick={() => setEditing(true)} className="px-4 py-2 text-xs rounded-lg btn-primary flex items-center gap-2">
                            <Pencil size={14} />
                            Edit Permissions
                        </button>
                    </>
                ) : (
                    <>
                        <button
                            onClick={() => {
                                setEditing(false);

                                if (role) {
                                    const state = {};
                                    PERMISSION_MODULES.forEach((module) => {
                                        state[module.key] = {};
                                        PERMISSION_ACTIONS.forEach((action) => {
                                            const key = `${module.key}.${action.key}`;
                                            state[module.key][action.key] = role.permissions?.includes(key) || false;
                                        });
                                    });
                                    setPermissions(state);
                                }
                            }}
                            disabled={saving} className="px-4 py-2 text-xs rounded-lg border border-app hover-app text-app">
                            Cancel
                        </button>

                        <button onClick={handleSave} disabled={saving} className=" px-4 py-2 text-xs rounded-lg btn-primary">
                            {saving ? "Saving..." : "Save Permissions"}
                        </button>
                    </>
                )}
            </Modal.Footer>
        </Modal>
    );
}