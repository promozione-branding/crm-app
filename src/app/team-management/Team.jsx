import Roles from '@/components/user/team/Role';
import Users from '@/components/user/team/User';
import axios from 'axios';
import { ArrowLeft, EllipsisVertical, Shield, User } from 'lucide-react'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast';

export default function Team() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("user");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [loading1, setLoading1] = useState(false);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(25)
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    roleId: ""
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

  const fetchRoles = async () => {
    try {
      setLoading1(true)
      const data = await axios.get("/api/user/roles");
      if (data.data.success) {
        // console.log(data.data)
        setRoles(data.data.roles || []);
      }

    } catch (error) {
      console.error("Get roles error:", error);
    } finally {
      setLoading1(false)
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      getUsers();
    }, 500);

    return () => clearTimeout(timer);
  }, [page, rowsPerPage, search]);

  const handleCreateUser = async () => {
    if (!form.name || !form.email || !form.phone || !form.password || !form.roleId) return toast.error("All fields are mandatory")
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

      {active == "user" &&
        <Users
          setOpen={setOpen}
          search={search}
          setSearch={setSearch}
          loading={loading}
          users={users}
          page={page}
          setPage={setPage}
          total={total}
          rowsPerPage={rowsPerPage}
          setRowsPerPage={setRowsPerPage}
          setForm={setForm}
          form={form}
          handleCreateUser={handleCreateUser}
          open={open}
          roles={roles}
        />}

      {active == "role" &&
        <Roles
          roles={roles}
          fetchRoles={fetchRoles}
          loading={loading1}
        />}

    </div>
  )
}
