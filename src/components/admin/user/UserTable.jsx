//src/components/admin/user/UserTable.jsx

import { ChevronLeft, ChevronRight, Eye, Filter, Search, Trash2 } from 'lucide-react';
import React from 'react';


export default function UserTable({ search, setSearch, companies, loading, setOpenFilter, setPage, page, limit, setLimit, total, totalPages }) {
    return (
        <div className="flex flex-col gap-1 rounded-lg bg-white shadow-md">
            <div className="flex flex-col items-center justify-between gap-2 border-b border-gray-300 px-2 py-1 md:flex-row">
                <div></div>
                <div className="flex items-center gap-2">
                    <div className="relative flex-1 text-gray-800">
                        <Search size={18} className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400" />

                        <input
                            placeholder="Search company..."
                            value={search}
                            onChange={(e) => {
                                setSearch(e.target.value);
                                setPage(1);
                            }}
                            className="w-full rounded-lg border border-gray-300 py-2 pr-4 pl-10 outline-none focus:border-blue-300 focus:ring-1 focus:ring-blue-300"
                        />
                    </div>

                    <button onClick={() => setOpenFilter(true)} className="rounded bg-[#082c62] p-2 text-white transition-colors hover:bg-[#051f48]">
                        <Filter size={18} />
                    </button>
                </div>
            </div>

            <div className="overflow-x-auto rounded-xl bg-white px-1">
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
                                <tr key={index} className="animate-pulse border-t border-gray-300">
                                    <td className="px-2 py-3">
                                        <div className="flex items-center gap-2">
                                            <div className="h-11 w-11 rounded-full bg-gray-200" />

                                            <div className="space-y-2">
                                                <div className="h-3 w-32 rounded bg-gray-200" />
                                                <div className="h-2 w-24 rounded bg-gray-200" />
                                            </div>
                                        </div>
                                    </td>

                                    <td className="px-2 py-3">
                                        <div className="h-3 w-28 rounded bg-gray-200" />
                                    </td>

                                    <td className="px-2 py-3">
                                        <div className="h-6 w-16 rounded-full bg-gray-200" />
                                    </td>

                                    <td className="px-2 py-3">
                                        <div className="h-6 w-20 rounded-full bg-gray-200" />
                                    </td>

                                    <td className="px-2 py-3">
                                        <div className="space-y-2">
                                            <div className="h-3 w-28 rounded bg-gray-200" />
                                            <div className="h-2 w-20 rounded bg-gray-200" />
                                        </div>
                                    </td>

                                    <td className="flex gap-1 px-2 py-3">
                                        <div className="h-9 w-9 rounded-md bg-gray-200" />
                                        <div className="h-9 w-9 rounded-md bg-gray-200" />
                                    </td>
                                </tr>
                            ))
                        ) : companies.length > 0 ? (
                            companies.map((company) => (
                                <tr key={company._id} className="border-t border-gray-300 text-gray-800 hover:bg-gray-50">
                                    <td className="px-2 py-2">
                                        <div className="flex items-center gap-1">
                                            {company.logoUrl ? (
                                                <img
                                                    src={company.logoUrl}
                                                    alt={company.name}
                                                    className="h-11 w-11 rounded-full border border-gray-300 object-cover"
                                                />
                                            ) : (
                                                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#082c62] text-lg font-semibold text-white uppercase">
                                                    {company.name?.charAt(0)}
                                                </div>
                                            )}

                                            <div>
                                                <p className="font-medium">{company.name}</p>

                                                <p className="text-xs text-gray-600">{company.email}</p>
                                            </div>
                                        </div>
                                    </td>

                                    <td className="px-2 py-2">{company.website}</td>

                                    <td className="px-2 py-2">
                                        <span className="rounded-full bg-blue-50 px-3 py-1 text-sm text-blue-700 capitalize">{company.plan}</span>
                                    </td>

                                    <td className="px-2 py-2">
                                        <span
                                            className={`rounded-full px-3 py-1 text-sm capitalize ${
                                                company.status === 'active'
                                                    ? 'bg-green-100 text-green-700'
                                                    : company.status === 'blocked'
                                                      ? 'bg-red-100 text-red-700'
                                                      : 'bg-gray-200 text-gray-700'
                                            }`}
                                        >
                                            {company.status}
                                        </span>
                                    </td>

                                    <td className="px-2 py-2">
                                        <div>
                                            <p>{company.createdBy?.name}</p>

                                            <p className="text-xs text-gray-600">{company.createdBy?.email}</p>
                                        </div>
                                    </td>

                                    <td className="flex gap-1 px-2 py-2">
                                        <button className="rounded-md bg-blue-500 p-2 text-white transition-colors hover:bg-blue-600">
                                            <Eye size={18} />
                                        </button>
                                        <button className="rounded-md bg-red-500 p-2 text-white transition-colors hover:bg-red-600">
                                            <Trash2 size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={6} className="py-10 text-center text-gray-500">
                                    No record found
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <div className="flex items-center justify-between border-t border-gray-300 px-2 py-1">
                <p className="text-sm text-gray-500">
                    Showing {companies.length === 0 ? 0 : (page - 1) * limit + 1} -{Math.min(page * limit, total)} of {total}
                </p>

                <div className="flex items-center gap-2">
                    <select
                        className="rounded-lg border border-gray-300 p-1 text-gray-800 outline-none"
                        value={limit}
                        onChange={(e) => {
                            setLimit(Number(e.target.value));
                            setPage(1);
                        }}
                    >
                        <option value="25">25</option>
                        <option value="50">50</option>
                        <option value="75">75</option>
                        <option value="100">100</option>
                    </select>

                    <button
                        onClick={() => setPage((p) => p - 1)}
                        disabled={page === 1}
                        className="rounded-lg border border-gray-300 bg-gray-100 p-1 text-black hover:bg-gray-200 disabled:opacity-40"
                    >
                        <ChevronLeft />
                    </button>

                    <span className="rounded-lg bg-[#082c62] px-3.5 py-1 text-white">{page}</span>

                    <button
                        onClick={() => setPage((p) => p + 1)}
                        disabled={page >= totalPages}
                        className="rounded-lg border border-gray-300 bg-gray-100 p-1 text-black hover:bg-gray-200 disabled:opacity-40"
                    >
                        <ChevronRight />
                    </button>
                </div>
            </div>
        </div>
    );
}
