// src/components/user/team/Role.jsx

import {
    EllipsisVertical,
    Plus,
    Search,
    ShieldCheck,
    Pencil,
} from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import Modal from "../ui/Modal";
import Input from "../ui/Input";
import TextArea from "../ui/TextArea";
import toast from "react-hot-toast";
import axios from "axios";
import PermissionModal from "./PermissionModal";

const initialForm = {
    name: "",
    description: "",
};

export default function Roles({ fetchRoles, roles = [], loading }) {
    const menuRef = useRef(null);

    const [open, setOpen] = useState(false);
    const [saving, setSaving] = useState(false);
    const [search, setSearch] = useState("");
    const [menuOpen, setMenuOpen] = useState(null);

    const [permissionModal, setPermissionModal] = useState(false);
    const [selectedRole, setSelectedRole] = useState(null);

    const [form, setForm] = useState(initialForm);

    const handleChange = ({ target: { name, value } }) => {
        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const resetForm = () => {
        setForm(initialForm);
    };

    const closeFormModal = () => {
        if (saving) return;

        setOpen(false);
        resetForm();
    };

    const handleAddRole = () => {
        resetForm();
        setOpen(true);
    };

    const handleEditRole = (role) => {
        setForm({
            _id: role._id,
            name: role.name || "",
            description: role.description || "",
        });

        setOpen(true);
        setMenuOpen(null);
    };

    const handleSave = async () => {
        const name = form.name?.trim();

        if (!name) {
            toast.error("Role name is required");
            return;
        }

        const isEdit = Boolean(form._id);

        const toastId = toast.loading(
            isEdit ? "Updating role..." : "Creating role..."
        );

        try {
            setSaving(true);

            const payload = {
                name,
                description: form.description?.trim() || "",
            };

            let response;

            if (isEdit) {
                response = await axios.put(
                    `/api/user/roles/${form._id}`,
                    payload,
                    {
                        withCredentials: true,
                    }
                );
            } else {
                response = await axios.post(
                    "/api/user/roles",
                    {
                        ...payload,
                        permissions: [],
                    },
                    {
                        withCredentials: true,
                    }
                );
            }

            if (!response.data.success) {
                throw new Error(
                    response.data.message ||
                    `Failed to ${isEdit ? "update" : "create"} role`
                );
            }

            toast.success(
                response.data.message ||
                `Role ${isEdit ? "updated" : "created"} successfully`,
                { id: toastId }
            );

            await fetchRoles();

            closeFormModal();

        } catch (error) {
            console.error(
                isEdit
                    ? "UPDATE ROLE ERROR:"
                    : "CREATE ROLE ERROR:",
                error
            );

            toast.error(
                error?.response?.data?.message ||
                error.message ||
                `Failed to ${isEdit ? "update" : "create"} role`,
                {
                    id: toastId,
                }
            );
        } finally {
            setSaving(false);
        }
    };

    useEffect(() => {
        fetchRoles();
    }, []);

    const filteredRoles = roles.filter((role) =>
        role.name
            ?.toLowerCase()
            .includes(search.toLowerCase())
    );

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                menuRef.current &&
                !menuRef.current.contains(event.target)
            ) {
                setMenuOpen(null);
            }
        };

        document.addEventListener(
            "mousedown",
            handleClickOutside
        );

        return () => {
            document.removeEventListener(
                "mousedown",
                handleClickOutside
            );
        };
    }, []);

    return (
        <div className="max-w-7xl mx-auto py-4 px-3 space-y-4">

            {/* TOP BAR */}
            <div className="flex justify-end items-center gap-2">

                <button
                    onClick={handleAddRole}
                    className="h-8 text-sm px-3 rounded-lg btn-primary flex items-center gap-2 transition"
                >
                    <Plus size={16} />
                    Add Role
                </button>

                <div className="relative">
                    <Search
                        size={16}
                        className="absolute left-3 top-1/2 -translate-y-1/2 opacity-60"
                    />

                    <input
                        placeholder="Search role..."
                        value={search}
                        onChange={(e) => {
                            setSearch(e.target.value);
                        }}
                        className="h-9 w-60 rounded-lg text-sm border border-app bg-app bg-transparent pl-10 pr-3 outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
            </div>

            {/* ROLE LIST */}
            <div className="border border-app rounded-lg">

                {loading ? (
                    <div className="p-6 text-center text-sm">
                        Loading roles...
                    </div>
                ) : filteredRoles.length === 0 ? (
                    <div className="p-6 text-center text-sm opacity-60">
                        No roles found
                    </div>
                ) : (
                    filteredRoles.map((role) => (
                        <div
                            key={role._id}
                            className="px-4 py-3 border-b border-app last:border-0 flex justify-between items-center"
                        >

                            <div className="flex flex-col">
                                <div className="text-sm font-medium">
                                    {role.name}
                                </div>

                                <div className="text-xs opacity-60 mt-1">
                                    {role.description ||
                                        "No description"}
                                </div>
                            </div>

                            {/* ACTION MENU */}
                            <div
                                className="relative"
                                ref={
                                    menuOpen === role._id
                                        ? menuRef
                                        : null
                                }
                            >
                                <button
                                    onClick={() =>
                                        setMenuOpen(
                                            menuOpen === role._id
                                                ? null
                                                : role._id
                                        )
                                    }
                                    className="p-2 rounded-xl border bg-app border-app hover-app text-app"
                                >
                                    <EllipsisVertical size={18} />
                                </button>

                                {menuOpen === role._id && (
                                    <div className="absolute right-0 top-full mt-2 w-44 rounded-lg border border-app bg-app shadow-lg z-50 overflow-hidden">

                                        <button
                                            onClick={() => {
                                                setSelectedRole(role);
                                                setPermissionModal(true);
                                                setMenuOpen(null);
                                            }}
                                            className="w-full px-3 py-2.5 flex items-center gap-2 text-sm text-left hover-app"
                                        >
                                            <ShieldCheck size={16} />

                                            <span>
                                                View Permissions
                                            </span>
                                        </button>

                                        <button
                                            onClick={() =>
                                                handleEditRole(role)
                                            }
                                            className="w-full px-3 py-2.5 flex items-center gap-2 text-sm text-left hover-app"
                                        >
                                            <Pencil size={16} />

                                            <span>
                                                Edit Role
                                            </span>
                                        </button>

                                    </div>
                                )}
                            </div>

                        </div>
                    ))
                )}

            </div>

            {/* ADD / EDIT ROLE MODAL */}
            <Modal
                isOpen={open}
                onClose={closeFormModal}
                size="md"
            >
                <Modal.Header>
                    {form?._id
                        ? "Update Role"
                        : "Add Role"}
                </Modal.Header>

                <Modal.Body>
                    <div className="space-y-4">

                        <Input
                            label="Role Name"
                            required
                            name="name"
                            value={form?.name || ""}
                            onChange={handleChange}
                            placeholder="Enter role name"
                        />

                        <TextArea
                            label="Description"
                            name="description"
                            value={form?.description || ""}
                            onChange={handleChange}
                            placeholder="Describe what this role can do."
                        />

                    </div>
                </Modal.Body>

                <Modal.Footer>

                    <button
                        onClick={closeFormModal}
                        disabled={saving}
                        className="px-4 py-2 text-xs rounded-lg border border-app hover-app text-app"
                    >
                        Cancel
                    </button>

                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="px-4 py-2 text-xs rounded-lg btn-primary"
                    >
                        {saving
                            ? "Saving..."
                            : "Save"}
                    </button>

                </Modal.Footer>
            </Modal>

            {/* PERMISSION MODAL */}
            <PermissionModal
                role={selectedRole}
                isOpen={permissionModal}
                onClose={() => {
                    setPermissionModal(false);
                    setSelectedRole(null);
                }}
                fetchRoles={fetchRoles}
            />

        </div>
    );
}