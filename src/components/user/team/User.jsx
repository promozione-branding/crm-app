// src/components/user/team/User.jsx

import { Plus, Search } from 'lucide-react';
import React from 'react';
import DynamicTable from '../ui/DynamicTable';
import Modal from '../ui/Modal';
import Input from '../ui/Input';
import SelectInput from '../ui/SelectInput';
import { useRouter } from 'next/navigation';

const columns = [
    { key: 'name', label: 'Name', sortable: true },
    { key: 'email', label: 'Email', sortable: true },
    { key: 'phone', label: 'Phone', sortable: true },
    {
        key: 'roleId.name',
        label: 'Role',
        sortable: true,
        render: (lead) => <span className="rounded-full bg-blue-500/10 px-3 py-1 text-xs text-blue-500 capitalize">{lead.roleId.name}</span>,
    },
    { key: 'createdAt', type: 'date', label: 'Created At', sortable: true },
];

export default function Users({
    setOpen,
    search,
    setSearch,
    loading,
    users,
    page,
    setPage,
    total,
    rowsPerPage,
    setRowsPerPage,
    handleCreateUser,
    form,
    open,
    setForm,
    roles,
}) {
    const router = useRouter();
    const handleChange = ({ target: { name, value } }) => {
        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    return (
        <div className="mx-auto max-w-7xl space-y-4 px-3 py-4">
            <div className="flex items-center justify-end gap-2">
                <button onClick={() => setOpen(true)} className="btn-primary flex h-8 items-center gap-2 rounded-lg px-3 text-sm transition">
                    <Plus size={16} />
                    Add User
                </button>

                <div className="relative">
                    <Search size={16} className="absolute top-1/2 left-3 -translate-y-1/2 opacity-60" />

                    <input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search user..."
                        className="border-app bg-app h-9 w-60 rounded-lg border bg-transparent pr-3 pl-10 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
            </div>

            <DynamicTable
                loading={loading}
                columns={columns}
                data={users}
                page={page}
                setPage={setPage}
                total={total}
                rowsPerPage={rowsPerPage}
                setRowsPerPage={setRowsPerPage}
                onAction={(user) => {
                    router.push(`/team-management/user/${user._id}`);
                }}
            />

            <Modal isOpen={open} onClose={() => setOpen(false)} size="md">
                <Modal.Header>Add User</Modal.Header>

                <Modal.Body>
                    <div className="space-y-4">
                        <div className="grid gap-2 md:grid-cols-2">
                            <Input label="Name" required name="name" value={form.name} onChange={handleChange} placeholder="Enter name" />

                            <Input label="Email" required type="mail" name="email" value={form.email} onChange={handleChange} placeholder="Enter email" />
                        </div>

                        <div className="grid gap-2 md:grid-cols-2">
                            <Input label="Phone" required name="phone" value={form.phone} onChange={handleChange} placeholder="Enter phone" />

                            <Input
                                label="Password"
                                required
                                type="password"
                                name="password"
                                value={form.password}
                                onChange={handleChange}
                                placeholder="••••••••"
                            />
                        </div>

                        <div className="grid gap-2 md:grid-cols-2">
                            <SelectInput
                                label="Role"
                                name="roleId"
                                required
                                value={form.roleId}
                                onChange={handleChange}
                                options={[...roles.map((role) => ({ label: `${role.name}`, value: role._id }))]}
                            />
                        </div>
                    </div>
                </Modal.Body>

                <Modal.Footer>
                    <button onClick={() => setOpen(false)} className="border-app hover-app text-app rounded-lg border px-4 py-2 text-xs">
                        Cancel
                    </button>

                    <button onClick={handleCreateUser} className="btn-primary rounded-lg px-4 py-2 text-xs">
                        Save
                    </button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}
