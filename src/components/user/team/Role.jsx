import { EllipsisVertical, Plus, Search, ShieldCheck, Pencil } from 'lucide-react'
import React, { useEffect, useRef, useState } from 'react'
import Modal from '../ui/Modal'
import Input from '../ui/Input'
import TextArea from '../ui/TextArea'
import toast from 'react-hot-toast';
import axios from 'axios'
import PermissionModal from './PermissionModal'

export default function Roles({ fetchRoles, roles, loading }) {
    const menuRef = useRef(null);
    const [open, setOpen] = useState(false);
    const [saving, setSaving] = useState(false);
    const [search, setSearch] = useState("");
    const [menuOpen, setMenuOpen] = useState(null);
    const [permissionModal, setPermissionModal] = useState(false);
    const [selectedRole, setSelectedRole] = useState(null);
    const [form, setForm] = useState({
        name: "",
        description: "",
    });

    const handleChange = ({ target: { name, value } }) => {
        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSave = async () => {
        if (!form.name?.trim()) {
            toast.error("Role name is required");
            return;
        }
        const isEdit = Boolean(form._id);
        const toastId = toast.loading(isEdit ? "Updating role..." : "Creating role...");
        try {
            setSaving(true);
            const payload = { name: form.name.trim(), description: form.description?.trim() || "", };

            let response;

            if (isEdit) {
                response = await axios.put(`/api/user/roles/${form._id}`, payload);
            } else {
                response = await axios.post("/api/user/roles", { ...payload, permissions: [], });
            }

            if (response.data.success) {
                toast.success(response.data.message, { id: toastId });
                await fetchRoles();
                setForm({
                    name: "",
                    description: "",
                });
                setOpen(false);
            } else {
                toast.error(response.data.message || "Something went wrong", { id: toastId });
            }

        } catch (error) {
            console.error(isEdit ? "Update role error:" : "Create role error:", error);
            toast.error(
                error?.response?.data?.message ||
                `Failed to ${isEdit ? "update" : "create"} role`,
                { id: toastId }
            );
        } finally {
            setSaving(false);
        }
    };

    useEffect(() => {
        fetchRoles();
    }, []);

    const filteredRoles = roles.filter((role) =>
        role.name?.toLowerCase().includes(search.toLowerCase())
    );

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setMenuOpen(null);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <div className="max-w-7xl mx-auto py-4 px-3 space-y-4">
            <div className='flex justify-end items-center gap-2'>
                <button onClick={() => setOpen(true)} className="h-8 text-sm px-3 rounded-lg btn-primary flex items-center gap-2 transition">
                    <Plus size={16} />
                    Add Role
                </button>

                <div className="relative">
                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 opacity-60" />

                    <input placeholder="Search role..." value={search} onChange={(e) => setSearch(e.target.value)}
                        className="h-9 w-60 rounded-lg text-sm border border-app bg-app bg-transparent pl-10 pr-3 outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
            </div>

            <div className="border border-app rounded-lg">
                {loading ? (
                    <div className="p-6 text-center text-sm">
                        Loading roles...
                    </div>
                ) : filteredRoles.length === 0 ? (
                    <div className="p-6 text-center text-sm opacity-60">
                        No roles found
                    </div>
                ) : (filteredRoles.map((role) => (
                    <div key={role._id} className="px-4 py-3 border-b border-app last:border-0 flex justify-between items-center">
                        <div className='flex flex-col'>
                            <div className="text-sm font-medium">
                                {role.name}
                            </div>

                            <div className="text-xs opacity-60 mt-1">
                                {role.description || "No description"}
                            </div>
                        </div>

                        <div className="relative" ref={menuOpen === role._id ? menuRef : null}>
                            <button onClick={() => setMenuOpen(menuOpen === role._id ? null : role._id)}
                                className="p-2 rounded-xl border bg-app border-app hover-app text-app">
                                <EllipsisVertical size={18} />
                            </button>

                            {menuOpen === role._id && (
                                <div className="absolute right-0 top-full mt-2 w-44 rounded-lg border border-app bg-app shadow-lg z-50 overflow-hidden">
                                    <button onClick={() => { setSelectedRole(role); setPermissionModal(true); setMenuOpen(null); }}
                                        className="w-full px-3 py-2.5 flex items-center gap-2 text-sm text-left hover-app">
                                        <ShieldCheck size={16} />
                                        <span>View Permissions</span>
                                    </button>

                                    <button onClick={() => { setOpen(true); setForm(role); setMenuOpen(null); }} className="w-full px-3 py-2.5 flex items-center gap-2 text-sm text-left hover-app">
                                        <Pencil size={16} />
                                        <span>Edit Role</span>
                                    </button>
                                </div>)}
                        </div>
                    </div>
                )))}
            </div>

            <Modal isOpen={open} onClose={() => { setOpen(false); setForm() }} size="md">
                <Modal.Header>
                    {form?._id ? "Update Role" : "Add Role"}
                </Modal.Header>

                <Modal.Body>
                    <div className="space-y-4">
                        <Input
                            label="Role Name"
                            required
                            name="name"
                            value={form?.name}
                            onChange={handleChange}
                            placeholder="Enter role name"
                        />

                        <TextArea
                            label="Description"
                            name="description"
                            value={form?.description}
                            onChange={handleChange}
                            placeholder="Describe what this role can do."
                        />
                    </div>
                </Modal.Body>

                <Modal.Footer>
                    <button onClick={() => { setOpen(false); setForm() }}
                        className="px-4 py-2 text-xs rounded-lg border border-app hover-app text-app"
                    >
                        Cancel
                    </button>

                    <button onClick={handleSave} disabled={saving} className="px-4 py-2 text-xs rounded-lg btn-primary">
                        {saving ? "Saving..." : "Save"}
                    </button>
                </Modal.Footer>
            </Modal>

            <PermissionModal
                role={selectedRole}
                isOpen={permissionModal}
                onClose={() => { setPermissionModal(false); setSelectedRole(null); }}
                fetchRoles={fetchRoles}
            />
        </div>
    )
}