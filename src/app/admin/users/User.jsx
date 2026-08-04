"use client"
import FilterSidebar from '@/components/admin/FilterSidebar'
import SelectInput from '@/components/admin/SelectInput'
import AddUser from '@/components/admin/user/AddUser'
import UserTable from '@/components/admin/user/UserTable'
import { EllipsisVertical, Plus, MoreVertical, Search, ChevronRight, ChevronLeft, Filter, Eye } from 'lucide-react'
import React, { useEffect, useState } from 'react'

export default function User() {
  const [userAdd, setUserAdd] = useState(false)
  const [loading, setLoading] = useState(false);
  const [openFilter, setOpenFilter] = useState(false)
  const [companies, setCompanies] = useState([])
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(25);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [plan, setPlan] = useState("");
  const [filters, setFilters] = useState({
    status: "",
    plan: "",
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });

  const getCompanies = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        search,
        status,
        plan,
      });

      const res = await fetch(`/api/admin/companies?${params}`);

      const data = await res.json();

      if (data.success) {
        setCompanies(data.data);
        setPagination(data.pagination);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      getCompanies();
    }, 500);

    return () => clearTimeout(timer);
  }, [page, search, status, plan]);

  const { total, totalPages } = pagination;

  return (
    <div className='flex flex-col gap-4'>

      <div className='bg-white md:p-4 p-2 rounded-lg shadow-md flex items-center justify-between'>
        <h2 className='text-xl font-bold text-gray-800'>User Management</h2>

        <div className='flex gap-1 items-center'>
          <button onClick={() => setUserAdd(true)} className='flex items-center gap-1 text-sm bg-[#082c62] text-white p-2 rounded hover:bg-[#051f48] transition-colors'>
            <Plus size={16} />
            Add User
          </button>
          <button className='p-2 rounded bg-[#082c62] text-white hover:bg-[#051f48] transition-colors'>
            <EllipsisVertical size={18} />
          </button>
        </div>
      </div>

      <UserTable
        search={search}
        setSearch={setSearch}
        companies={companies}
        loading={loading}
        setOpenFilter={setOpenFilter}
        setPage={setPage}
        page={page}
        limit={limit}
        setLimit={setLimit}
        total={total}
        totalPages={totalPages}
      />

      <FilterSidebar
        open={openFilter}
        onClose={() => setOpenFilter(false)}
        filters={filters}
        setFilters={setFilters}
        onApply={() => {
          setStatus(filters.status);
          setPlan(filters.plan);
          setPage(1);
          setOpenFilter(false);
        }}
        onReset={() => {
          setFilters({
            status: "",
            plan: "",
          });

          setStatus("");
          setPlan("");
          setPage(1);
          setOpenFilter(false);
        }}
      />

      <AddUser
        getCompanies={getCompanies}
        userAdd={userAdd}
        setUserAdd={setUserAdd}
      />
    </div>
  )
}