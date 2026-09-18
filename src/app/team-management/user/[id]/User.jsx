// src/app/team-management/user/[id]/User.jsx

'use client';
import { ArrowLeft, Edit, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import Input from '@/components/user/ui/Input';
import SelectInput from '@/components/user/ui/SelectInput';

export default function User() {
    const params = useParams();
    const router = useRouter();
    const id = params.id;

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [roles, setRoles] = useState([]);
    const [form, setForm] = useState({
        name: '',
        email: '',
        phone: '',
        password: '',
        roleId: '',
        status: 'active',
        leadSources: [],
    });

    const handleChange = ({ target: { name, value } }) => {
        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // GET USER
    const getUser = async () => {
        try {
            setLoading(true);

            const res = await axios.get(`/api/user/${id}`);

            if (res.data.success) {
                const user = res.data.user;

                setForm({
                    name: user.name || '',
                    email: user.email || '',
                    phone: user.phone || '',
                    password: '',
                    roleId: user.roleId?._id || user.roleId || '',
                    status: user.status || 'active',
                    leadSources: user.leadSources || [],
                });
            }
        } catch (error) {
            console.error(error);

            toast.error(error.response?.data?.message || 'Failed to load user');

            router.push('/team-management');
        } finally {
            setLoading(false);
        }
    };

    // GET ROLES
    const getRoles = async () => {
        try {
            const res = await axios.get('/api/user/roles');
            if (res.data.success) {
                setRoles(res.data.roles || []);
            }
        } catch (error) {
            console.error('Role error:', error);
        }
    };

    // LOAD DATA
    useEffect(() => {
        if (!id) return;
        getUser();
        getRoles();
    }, [id]);

    // UPDATE USER
    const handleUpdateUser = async () => {
        try {
            setSaving(true);
            const payload = {
                name: form.name,
                email: form.email,
                phone: form.phone,
                roleId: form.roleId,
                status: form.status,
                leadSources: form.leadSources,
            };

            // Only send password if entered
            if (form.password.trim()) {
                payload.password = form.password;
            }

            const res = await axios.put(`/api/user/${id}`, payload);
            if (res.data.success) {
                toast.success(res.data.message || 'User updated successfully');
                // Optional:
                // router.push("/team-management");
            }
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || 'Failed to update user');
        } finally {
            setSaving(false);
        }
    };

    const handleDeleteUser = async () => {
        try {
            const confirmed = window.confirm('Are you sure you want to delete this user?');

            if (!confirmed) return;
            const res = await axios.delete(`/api/user/${id}`);

            if (res.data.success) {
                toast.success(res.data.message || 'User deleted successfully');
                router.push('/team-management');
            }
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || 'Failed to delete user');
        }
    };

    // LOADING
    if (loading) {
        return (
            <div className="bg-surface text-app flex min-h-screen items-center justify-center">
                <p className="text-sm opacity-60">Loading user...</p>
            </div>
        );
    }

    return (
        <div className="bg-surface text-app min-h-screen">
            {/* ================= HEADER ================= */}
            <div className="bg-surface border-app sticky top-16 z-40 flex h-16 items-center justify-between border-b px-1 md:px-8">
                <div className="flex items-center gap-1 md:gap-2">
                    <Link href="/team-management" className="bg-app border-app hover-app text-app rounded-xl border p-2">
                        <ArrowLeft size={20} />
                    </Link>

                    <h1 className="text-app text-sm font-bold">Edit User</h1>
                </div>

                <div className="flex items-center gap-1 text-sm md:gap-2">
                    <button
                        onClick={handleUpdateUser}
                        disabled={saving}
                        className="btn-primary border-app hover-app text-app flex items-center gap-2 rounded-lg border px-4 py-2 disabled:opacity-50"
                    >
                        <Edit size={16} />
                        {saving ? 'Saving...' : 'Save Changes'}
                    </button>

                    <button onClick={handleDeleteUser} className="border-app rounded-lg border bg-red-600 p-2 text-white hover:bg-red-700">
                        <Trash2 size={18} />
                    </button>
                </div>
            </div>

            {/* ================= FORM ================= */}
            <div className="mx-auto max-w-5xl px-3 py-6">
                <div className="bg-app border-app rounded-xl border p-5">
                    <h2 className="mb-5 text-base font-semibold">User Information</h2>

                    <div className="space-y-4">
                        <div className="grid gap-3 md:grid-cols-2">
                            <Input label="Name" required name="name" value={form.name} onChange={handleChange} placeholder="Enter name" />

                            <Input label="Email" required type="email" name="email" value={form.email} onChange={handleChange} placeholder="Enter email" />
                        </div>

                        <div className="grid gap-3 md:grid-cols-2">
                            <Input label="Phone" required name="phone" value={form.phone} onChange={handleChange} placeholder="Enter phone" />

                            <Input
                                label="Password"
                                type="password"
                                name="password"
                                value={form.password}
                                onChange={handleChange}
                                placeholder="Leave blank to keep current password"
                            />
                        </div>

                        <div className="grid gap-3 md:grid-cols-2">
                            <SelectInput
                                label="Role"
                                name="roleId"
                                required
                                value={form.roleId}
                                onChange={handleChange}
                                options={[
                                    ...roles.map((role) => ({
                                        label: role.name,
                                        value: role._id,
                                    })),
                                ]}
                            />

                            <SelectInput
                                label="Status"
                                name="status"
                                required
                                value={form.status}
                                onChange={handleChange}
                                options={[
                                    {
                                        label: 'Active',
                                        value: 'active',
                                    },
                                    {
                                        label: 'Inactive',
                                        value: 'inactive',
                                    },
                                ]}
                            />
                        </div>

                        <div className="">
                            <label className="mb-3 block text-sm font-medium">Lead Sources</label>

                            <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                                {[
                                    { value: 'facebook', label: 'Facebook' },
                                    { value: 'google', label: 'Google' },
                                    { value: 'website', label: 'Website' },
                                    { value: 'whatsapp', label: 'WhatsApp' },
                                    { value: 'manual', label: 'Manual' },
                                    { value: 'indiamart', label: 'IndiaMART' },
                                    { value: 'tradeindia', label: 'TradeIndia' },
                                    { value: 'other', label: 'Other' },
                                ].map((source) => {
                                    const checked = form.leadSources.includes(source.value);

                                    return (
                                        <label
                                            key={source.value}
                                            className="border-app bg-surface hover-app flex cursor-pointer items-center gap-2 rounded-lg border p-3"
                                        >
                                            <input
                                                type="checkbox"
                                                checked={checked}
                                                onChange={(e) => {
                                                    setForm((prev) => {
                                                        const currentSources = prev.leadSources || [];

                                                        if (e.target.checked) {
                                                            return {
                                                                ...prev,
                                                                leadSources: [...currentSources, source.value],
                                                            };
                                                        }

                                                        return {
                                                            ...prev,
                                                            leadSources: currentSources.filter((item) => item !== source.value),
                                                        };
                                                    });
                                                }}
                                                className="h-4 w-4"
                                            />

                                            <span className="text-sm">{source.label}</span>
                                        </label>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
