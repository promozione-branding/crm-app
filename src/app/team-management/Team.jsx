import DynamicTable from '@/components/user/ui/DynamicTable';
import Input from '@/components/user/ui/Input';
import Modal from '@/components/user/ui/Modal';
import SelectInput from '@/components/user/ui/SelectInput';
import axios from 'axios';
import { ArrowLeft, EllipsisVertical, Plus, Search, Shield, User } from 'lucide-react'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast';

const columns = [
  { key: "name", label: "Name", sortable: true, },
  { key: "email", label: "Email", sortable: true, },
  { key: "phone", label: "Phone", sortable: true, },
  {
    key: "role", label: "Role", sortable: true,
    render: (lead) => (
      <span className="px-3 py-1 rounded-full text-xs bg-blue-500/10 text-blue-500 capitalize">
        {lead.role}
      </span>
    ),
  },
  { key: "createdAt", type: "date", label: "Created At", sortable: true, },
];

export default function Team() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("user");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(25)
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    role: "employee"
  });
  const tabs = [
    { id: "user", label: "User", icon: User, },
    { id: "role", label: "Role", icon: Shield, },
  ];

  const getUsers = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`/api/user?page=${page}&limit=${rowsPerPage}&search=${search}`, { withCredentials: true, });
      setUsers(res.data.data);
      setTotal(res.data.pagination.total);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load users.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      getUsers();
    }, 500);

    return () => clearTimeout(timer);
  }, [page, rowsPerPage, search]);

  const handleChange = ({ target: { name, value } }) => {
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCreateUser = async () => {
    const toastId = toast.loading("Creating user...");
    try {
      setLoading(true);
      const res = await axios.post("/api/user", form, { withCredentials: true, });
      toast.success(res.data.message, { id: toastId, });
      setOpen(false);
      setForm({
        name: "",
        email: "",
        phone: "",
        password: "",
        role: "employee",
        permissions: [],
      });
      getUsers();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create user.", { id: toastId, });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-surface min-h-screen text-app">
      <div className="h-16 top-16 sticky z-40 bg-surface border-b border-app flex items-center justify-between md:px-8 px-1">
        <div className="flex items-center md:gap-2 gap-1">
          <Link href="/settings" className="p-2 rounded-xl border bg-app border-app hover-app text-app">
            <ArrowLeft size={20} />
          </Link>

          <h1 className="text-sm font-bold text-app">
            Users & roles
          </h1>
        </div>

        <div className="flex items-center md:gap-2 gap-1 text-sm">
          <button className="p-2 rounded-xl border bg-app border-app hover-app text-app">
            <EllipsisVertical size={18} />
          </button>
        </div>
      </div>
      <div className='h-10 top-32 sticky z-40 bg-surface border-b border-app flex items-center gap-2 md:px-8 px-1 overflow-x-auto overflow-y-hidden'>
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = active === tab.id;

          return (
            <button key={tab.id} onClick={() => setActive(tab.id)}
              className={`
                        relative flex items-center justify-center gap-2
                        px-5 h-11 min-w-max
                        text-sm font-medium whitespace-nowrap
                        transition-all duration-200
                        border-b-2
                        ${isActive
                  ? "border-blue-600 text-blue-600 dark:text-blue-400 bg-blue-500/10"
                  : "border-transparent text-app hover-app"
                }
                    `}
            >
              <Icon size={16} />
              <span>{tab.label}</span>

              {tab.badge && (
                <span className={`flex items-center justify-center min-w-5 h-5 rounded-full text-[10px]
                                ${isActive ? "bg-blue-600 text-white" : "bg-app border border-app text-app"}`}>
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

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
      </div>

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
                name="role"
                required
                value={form.role}
                onChange={handleChange}
                options={[
                  { label: "Employee", value: "employee", },
                  { label: "Manager", value: "manager", },
                  { label: "Sub Admin", value: "sub-admin", },
                  { label: "Admin", value: "Admin", },
                ]}
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
