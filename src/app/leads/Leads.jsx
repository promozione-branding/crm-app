"use client";
import React, { useEffect, useState } from "react";
import { Search, Filter, Plus, MoreVertical, ChevronDown, ChevronUp } from "lucide-react";
import Link from "next/link";
import DynamicTable from "@/components/user/ui/DynamicTable";
import axios from "axios";
import { useRouter } from "next/navigation";

const columns = [
    { key: "assignedTo.name", label: "Assigned To", sortable: true, },
    { key: "name", label: "Contact Name", sortable: true, },
    { key: "phone", label: "Phone", sortable: true, },
    {
        key: "stage", label: "Stage", sortable: true,
        render: (lead) => (
            <span className="px-3 py-1 rounded-full text-xs bg-blue-500/10 text-blue-500 capitalize">
                {lead.stage}
            </span>
        ),
    },
    { key: "dealValue", label: "Deal Value", sortable: true, },
    { key: "source", label: "Lead Source", sortable: true, },
    { key: "createdAt", type: "date", label: "Created At", sortable: true, },
];

export default function Leads() {
    const router = useRouter();
    const [leads, setLeads] = useState([]);
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState("");
    const [rowsPerPage, setRowsPerPage] = useState(25)

    const getLeads = async () => {
        try {
            setLoading(true);
            const res = await axios.get(`/api/user/lead/all?page=${page}&limit=${rowsPerPage}&search=${search}`, { withCredentials: true });

            setLeads(res.data.leads);
            setTotal(res.data.pagination.total);
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to load leads");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            getLeads();
        }, 500);

        return () => clearTimeout(timer);
    }, [page, rowsPerPage, search]);

    return (
        <div className="bg-surface text-app min-h-[calc(100vh-64px)] p-6">
            {/* Top Section */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-base font-bold">
                        CRM
                    </h1>
                    <p className="text-xs opacity-70">
                        Manage your leads
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    {/* Add Lead */}
                    <Link href={"/leads/new"} className="h-8 text-sm px-3 rounded-lg btn-primary flex items-center gap-2 transition">
                        <Plus size={16} />
                        Add Lead
                    </Link>

                    {/* Filter */}
                    <button className="h-8 px-3 text-sm rounded-lg border border-app hover-app flex items-center gap-2 transition">
                        <Filter size={16} />
                        Filter
                    </button>

                    {/* Search */}
                    <div className="relative">
                        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 opacity-60" />

                        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search leads..."
                            className="h-9 w-60 rounded-lg text-sm border border-app bg-app bg-transparent pl-10 pr-3 outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                </div>
            </div>

            {/* Table Card */}
            <DynamicTable
                loading={loading}
                columns={columns}
                data={leads}
                page={page}
                setPage={setPage}
                total={total}
                rowsPerPage={rowsPerPage}
                setRowsPerPage={setRowsPerPage}
                onAction={(lead) => {
                    router.push(`/leads/edit/${lead._id}`);
                }}
            />
        </div>
    );
}