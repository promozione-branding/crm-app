import { ChevronLeft, ChevronRight, Eye, Filter, Search, Trash2 } from 'lucide-react';
import React from 'react'

export default function UserTable({
    search, setSearch, companies, loading, setOpenFilter, setPage, page, limit, setLimit, total, totalPages
}) {
    return (
        <div className='bg-white rounded-lg shadow-md flex flex-col gap-1'>
            <div className='flex flex-col md:flex-row gap-2 items-center justify-between border-b py-1 px-2'>
                <div>

                </div>
                <div className='flex gap-2 items-center'>
                    <div className="relative flex-1 text-gray-800">
                        <Search
                            size={18}
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                        />

                        <input
                            placeholder="Search company..."
                            value={search}
                            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                            className="w-full border border-gray-300 outline-none focus:border-blue-300 focus:ring-1 focus:ring-blue-300 rounded-lg pl-10 pr-4 py-2"
                        />
                    </div>

                    <button onClick={() => setOpenFilter(true)} className='p-2 rounded bg-[#082c62] text-white hover:bg-[#051f48] transition-colors'>
                        <Filter size={18} />
                    </button>
                </div>
            </div>

            <div className="overflow-x-auto rounded-xl border bg-white px-1">
                <table className="w-full border border-gray-300">
                    <thead className="bg-gray-50 text-gray-800">
                        <tr>
                            <th className="px-2 py-3 text-left">Company</th>
                            <th className="px-2 py-3 text-left">Website</th>
                            <th className="px-2 py-3 text-left">Plan</th>
                            <th className="px-2 py-3 text-left">Status</th>
                            <th className="px-2 py-3 text-left">Created By</th>
                            <th className="px-2 py-3 text-left">Action</th>
                        </tr>
                    </thead>

                    <tbody>
                        {loading ? (
                            Array.from({ length: 5 }).map((_, index) => (
                                <tr
                                    key={index}
                                    className="border-t border-gray-300 animate-pulse"
                                >
                                    <td className="px-2 py-3">
                                        <div className="flex items-center gap-2">
                                            <div className="w-11 h-11 rounded-full bg-gray-200" />

                                            <div className="space-y-2">
                                                <div className="h-3 w-32 bg-gray-200 rounded" />
                                                <div className="h-2 w-24 bg-gray-200 rounded" />
                                            </div>
                                        </div>
                                    </td>

                                    <td className="px-2 py-3">
                                        <div className="h-3 w-28 bg-gray-200 rounded" />
                                    </td>

                                    <td className="px-2 py-3">
                                        <div className="h-6 w-16 bg-gray-200 rounded-full" />
                                    </td>

                                    <td className="px-2 py-3">
                                        <div className="h-6 w-20 bg-gray-200 rounded-full" />
                                    </td>

                                    <td className="px-2 py-3">
                                        <div className="space-y-2">
                                            <div className="h-3 w-28 bg-gray-200 rounded" />
                                            <div className="h-2 w-20 bg-gray-200 rounded" />
                                        </div>
                                    </td>

                                    <td className="px-2 py-3 flex gap-1">
                                        <div className="h-9 w-9 bg-gray-200 rounded-md" />
                                        <div className="h-9 w-9 bg-gray-200 rounded-md" />
                                    </td>
                                </tr>
                            ))) : companies.length > 0 ? (companies.map((company) => (
                                <tr
                                    key={company._id}
                                    className="border-t border-gray-300 hover:bg-gray-50 text-gray-800"
                                >
                                    <td className="px-2 py-2">
                                        <div className="flex items-center gap-1">
                                            {company.logoUrl ? (
                                                <img
                                                    src={company.logoUrl}
                                                    alt={company.name}
                                                    className="w-11 h-11 rounded-full border border-gray-300 object-cover"
                                                />
                                            ) : (
                                                <div className="w-11 h-11 rounded-full bg-[#082c62] text-white flex items-center justify-center font-semibold text-lg uppercase">
                                                    {company.name?.charAt(0)}
                                                </div>
                                            )}

                                            <div>
                                                <p className="font-medium">
                                                    {company.name}
                                                </p>

                                                <p className="text-xs text-gray-600">
                                                    {company.email}
                                                </p>
                                            </div>
                                        </div>
                                    </td>

                                    <td className="px-2 py-2">
                                        {company.website}
                                    </td>

                                    <td className="px-2 py-2">
                                        <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm capitalize">
                                            {company.plan}
                                        </span>
                                    </td>

                                    <td className="px-2 py-2">
                                        <span
                                            className={`px-3 py-1 rounded-full text-sm capitalize
              ${company.status === "active"
                                                    ? "bg-green-100 text-green-700"
                                                    : company.status === "blocked"
                                                        ? "bg-red-100 text-red-700"
                                                        : "bg-gray-200 text-gray-700"
                                                }`}
                                        >
                                            {company.status}
                                        </span>
                                    </td>

                                    <td className="px-2 py-2">
                                        <div>
                                            <p>{company.createdBy?.name}</p>

                                            <p className="text-xs text-gray-600">
                                                {company.createdBy?.email}
                                            </p>
                                        </div>
                                    </td>

                                    <td className="px-2 py-2 flex gap-1">
                                        <button className="p-2 rounded-md bg-blue-500 text-white hover:bg-blue-600 transition-colors">
                                            <Eye size={18} />
                                        </button>
                                        <button className="p-2 rounded-md bg-red-500 text-white hover:bg-red-600 transition-colors">
                                            <Trash2 size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))) : (
                            <tr>
                                <td colSpan={6} className="text-center py-10 text-gray-500">
                                    No record found
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <div className="flex items-center justify-between border-t py-1 px-2">
                <p className="text-sm text-gray-500">
                    Showing {companies.length === 0 ? 0 : (page - 1) * limit + 1} -
                    {Math.min(page * limit, total)} of {total}
                </p>

                <div className="flex items-center gap-2">
                    <select className="border text-gray-800 border-gray-300 rounded-lg p-1 outline-none" value={limit} onChange={(e) => { setLimit(Number(e.target.value)); setPage(1); }}>
                        <option value="25">25</option>
                        <option value="50">50</option>
                        <option value="75">75</option>
                        <option value="100">100</option>
                    </select>

                    <button
                        onClick={() => setPage((p) => p - 1)}
                        disabled={page === 1}
                        className="border border-gray-300 bg-gray-100 hover:bg-gray-200 text-black p-1 rounded-lg disabled:opacity-40"
                    >
                        <ChevronLeft />
                    </button>

                    <span className="px-3.5 py-1 bg-[#082c62] text-white rounded-lg">
                        {page}
                    </span>

                    <button
                        onClick={() => setPage((p) => p + 1)}
                        disabled={page >= totalPages}
                        className="border border-gray-300 bg-gray-100 hover:bg-gray-200 text-black p-1 rounded-lg disabled:opacity-40"
                    >
                        <ChevronRight />
                    </button>
                </div>
            </div>
        </div>
    )
}