// src/components/user/team/Role.jsx

import { EllipsisVertical, Plus, Search, ShieldCheck, Pencil } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import Modal from '../ui/Modal';
import Input from '../ui/Input';
import TextArea from '../ui/TextArea';
import toast from 'react-hot-toast';
import axios from 'axios';
import PermissionModal from './PermissionModal';

const initialForm = {
    name: '',
    description: '',
};

export default function Roles({ fetchRoles, roles = [], loading }) {
    const menuRef = useRef(null);

    const [open, setOpen] = useState(false);
    const [saving, setSaving] = useState(false);
    const [search, setSearch] = useState('');
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
            name: role.name || '',
            description: role.description || '',
        });

        setOpen(true);
        setMenuOpen(null);
    };

    const handleSave = async () => {
    const name = form.name?.trim();

    if (!name) {
        toast.error('Role name is required');
        return;
    }

    const isEdit = Boolean(form._id);

    const toastId = toast.loading(
        isEdit ? 'Updating role...' : 'Creating role...'
    );

    try {
        setSaving(true);

        const payload = {
            name,
            description: form.description?.trim() || '',
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
                '/api/user/roles',
                payload,
                {
                    withCredentials: true,
                }
            );
        }

        if (!response.data.success) {
            throw new Error(
                response.data.message ||
                    `Failed to ${isEdit ? 'update' : 'create'} role`
            );
        }

        toast.success(
            response.data.message ||
                `Role ${isEdit ? 'updated' : 'created'} successfully`,
            {
                id: toastId,
            }
        );

        await fetchRoles();

        closeFormModal();
    } catch (error) {
        console.error(
            isEdit ? 'UPDATE ROLE ERROR:' : 'CREATE ROLE ERROR:',
            error
        );

        toast.error(
            error?.response?.data?.message ||
                error.message ||
                `Failed to ${isEdit ? 'update' : 'create'} role`,
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

    const filteredRoles = roles.filter((role) => role.name?.toLowerCase().includes(search.toLowerCase()));

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setMenuOpen(null);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div className="mx-auto max-w-7xl space-y-4 px-3 py-4">
            {/* TOP BAR */}
            <div className="flex items-center justify-end gap-2">
                <button onClick={handleAddRole} className="btn-primary flex h-8 items-center gap-2 rounded-lg px-3 text-sm transition">
                    <Plus size={16} />
                    Add Role
                </button>

                <div className="relative">
                    <Search size={16} className="absolute top-1/2 left-3 -translate-y-1/2 opacity-60" />

                    <input
                        placeholder="Search role..."
                        value={search}
                        onChange={(e) => {
                            setSearch(e.target.value);
                        }}
                        className="border-app bg-app h-9 w-60 rounded-lg border bg-transparent pr-3 pl-10 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
            </div>

            {/* ROLE LIST */}
            <div className="border-app rounded-lg border">
                {loading ? (
                    <div className="p-6 text-center text-sm">Loading roles...</div>
                ) : filteredRoles.length === 0 ? (
                    <div className="p-6 text-center text-sm opacity-60">No roles found</div>
                ) : (
                    filteredRoles.map((role) => (
                        <div key={role._id} className="border-app flex items-center justify-between border-b px-4 py-3 last:border-0">
                            <div className="flex flex-col">
                                <div className="text-sm font-medium">{role.name}</div>

                                <div className="mt-1 text-xs opacity-60">{role.description || 'No description'}</div>
                            </div>

                            {/* ACTION MENU */}
                            <div className="relative" ref={menuOpen === role._id ? menuRef : null}>
                                <button
                                    onClick={() => setMenuOpen(menuOpen === role._id ? null : role._id)}
                                    className="bg-app border-app hover-app text-app rounded-xl border p-2"
                                >
                                    <EllipsisVertical size={18} />
                                </button>

                                {menuOpen === role._id && (
                                    <div className="border-app bg-app absolute top-full right-0 z-50 mt-2 w-44 overflow-hidden rounded-lg border shadow-lg">
                                        <button
                                            onClick={() => {
                                                setSelectedRole(role);
                                                setPermissionModal(true);
                                                setMenuOpen(null);
                                            }}
                                            className="hover-app flex w-full items-center gap-2 px-3 py-2.5 text-left text-sm"
                                        >
                                            <ShieldCheck size={16} />

                                            <span>View Permissions</span>
                                        </button>

                                        <button
                                            onClick={() => handleEditRole(role)}
                                            className="hover-app flex w-full items-center gap-2 px-3 py-2.5 text-left text-sm"
                                        >
                                            <Pencil size={16} />

                                            <span>Edit Role</span>
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* ADD / EDIT ROLE MODAL */}
            <Modal isOpen={open} onClose={closeFormModal} size="md">
                <Modal.Header>{form?._id ? 'Update Role' : 'Add Role'}</Modal.Header>

                <Modal.Body>
                    <div className="space-y-4">
                        <Input label="Role Name" required name="name" value={form?.name || ''} onChange={handleChange} placeholder="Enter role name" />

                        <TextArea
                            label="Description"
                            name="description"
                            value={form?.description || ''}
                            onChange={handleChange}
                            placeholder="Describe what this role can do."
                        />
                    </div>
                </Modal.Body>

                <Modal.Footer>
                    <button onClick={closeFormModal} disabled={saving} className="border-app hover-app text-app rounded-lg border px-4 py-2 text-xs">
                        Cancel
                    </button>

                    <button onClick={handleSave} disabled={saving} className="btn-primary rounded-lg px-4 py-2 text-xs">
                        {saving ? 'Saving...' : 'Save'}
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
