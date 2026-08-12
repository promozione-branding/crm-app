import { Plus, Search } from 'lucide-react'
import React from 'react'
import DynamicTable from '../ui/DynamicTable'
import Modal from '../ui/Modal';
import Input from '../ui/Input';
import SelectInput from '../ui/SelectInput';

const columns = [
    { key: "name", label: "Name", sortable: true, },
    { key: "email", label: "Email", sortable: true, },
    { key: "phone", label: "Phone", sortable: true, },
    {
        key: "roleId.name", label: "Role", sortable: true,
        render: (lead) => (
            <span className="px-3 py-1 rounded-full text-xs bg-blue-500/10 text-blue-500 capitalize">
                {lead.roleId.name}
            </span>
        ),
    },
    { key: "createdAt", type: "date", label: "Created At", sortable: true, },
];

export default function Users(
    { setOpen, search, setSearch, loading, users, page, setPage, total, rowsPerPage, setRowsPerPage, handleCreateUser, form, open, setForm, roles }
) {

    const handleChange = ({ target: { name, value } }) => {
        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    return (
        <div className="max-w-7xl mx-auto py-4 px-3 space-y-4">
            <div className='flex justify-end items-center gap-2'>
                <button onClick={() => setOpen(true)} className="h-8 text-sm px-3 rounded-lg btn-primary flex items-center gap-2 transition">
                    <Plus size={16} />
                    Add User
                </button>

                <div className="relative">
                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 opacity-60" />

                    <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search user..."
                        className="h-9 w-60 rounded-lg text-sm border border-app bg-app bg-transparent pl-10 pr-3 outline-none focus:ring-2 focus:ring-blue-500"
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
                onAction={(lead) => {
                    console.log(lead)
                }}
            />

            <Modal isOpen={open} onClose={() => setOpen(false)} size="md">
                <Modal.Header>
                    Add User
                </Modal.Header>

                <Modal.Body>
                    <div className="space-y-4">
                        <div className='grid md:grid-cols-2 gap-2'>
                            <Input
                                label="Name"
                                required
                                name="name"
                                value={form.name}
                                onChange={handleChange}
                                placeholder="Enter name"
                            />

                            <Input
                                label="Email"
                                required
                                type='mail'
                                name="email"
                                value={form.email}
                                onChange={handleChange}
                                placeholder="Enter email"
                            />
                        </div>

                        <div className='grid md:grid-cols-2 gap-2'>
                            <Input
                                label="Phone"
                                required
                                name="phone"
                                value={form.phone}
                                onChange={handleChange}
                                placeholder="Enter phone"
                            />

                            <Input
                                label="Password"
                                required
                                type='password'
                                name="password"
                                value={form.password}
                                onChange={handleChange}
                                placeholder="••••••••"
                            />
                        </div>

                        <div className='grid md:grid-cols-2 gap-2'>
                            <SelectInput
                                label="Role"
                                name="roleId"
                                required
                                value={form.roleId}
                                onChange={handleChange}
                                options={[...roles.map((role) => ({ label: `${role.name}`, value: role._id, })),]}
                            />
                        </div>
                    </div>
                </Modal.Body>

                <Modal.Footer>
                    <button onClick={() => setOpen(false)}
                        className="px-4 py-2 text-xs rounded-lg border border-app hover-app text-app"
                    >
                        Cancel
                    </button>

                    <button onClick={handleCreateUser} className="px-4 py-2 text-xs rounded-lg btn-primary">
                        Save
                    </button>
                </Modal.Footer>
            </Modal>
        </div>
    )
}