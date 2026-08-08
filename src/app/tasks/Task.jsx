"use client";
import React, { useEffect, useState } from "react";
import { Search, Filter, Plus, MoreVertical, ChevronDown, ChevronUp } from "lucide-react";
import DynamicTable from "@/components/user/ui/DynamicTable";
import toast from "react-hot-toast";
import axios from "axios";

const columns = [
    { key: "title", label: "Task Title", sortable: true, },
    { key: "leadId.name", label: "Related Lead", sortable: true, },
    { key: "priority", label: "Priority", sortable: true, },
    {
        key: "status", label: "Status", sortable: true,
        render: (task) => (
            <span className="px-3 py-1 rounded-full text-xs bg-blue-500/10 text-blue-500 capitalize">
                {task.status}
            </span>
        ),
    },
    // { key: "createdBy.name", label: "Created By", sortable: true, },
    { key: "assignedTo.name", label: "Assigned To", sortable: true, },
    { key: "dueDate", type: "date", label: "Due Date", sortable: true, },
];

export default function Task() {
    const [page, setPage] = useState(1);
    const [tasks, setTasks] = useState([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState("");
    const [rowsPerPage, setRowsPerPage] = useState(25)

    const getTasks = async () => {
        try {
            setLoading(true);
            const res = await axios.get("/api/user/task", {
                params: { page, limit: rowsPerPage, search: search.trim() || undefined, },
                withCredentials: true,
            });

            setTasks(res.data.data?.tasks || []);
            setTotal(res.data.data?.pagination?.total || 0);
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to load tasks.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getTasks();
    }, [page, rowsPerPage]);

    useEffect(() => {
        const timer = setTimeout(() => {
            setPage(1);
            getTasks();
        }, 500);

        return () => clearTimeout(timer);
    }, [search]);

    return (
        <div className="bg-surface text-app min-h-[calc(100vh-64px)] p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-base font-bold">
                        CRM
                    </h1>

                    <p className="text-xs opacity-70">
                        Manage your tasks
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    {/* Search */}
                    <button className="h-8 text-sm px-3 rounded-lg btn-primary flex items-center gap-2 transition">
                        <Plus size={16} />
                        Add Task
                    </button>

                    {/* Filter */}
                    <button className="h-8 px-3 text-sm rounded-lg border border-app hover-app flex items-center gap-2 transition">
                        <Filter size={16} />
                        Filter
                    </button>

                    <div className="relative">
                        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 opacity-60" />

                        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search task..."
                            className="h-9 w-60 rounded-lg text-sm border border-app bg-app bg-transparent pl-10 pr-3 outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                </div>
            </div>

            {/* Table Card */}
            <DynamicTable
                loading={loading}
                columns={columns}
                data={tasks}
                page={page}
                setPage={setPage}
                total={total}
                rowsPerPage={rowsPerPage}
                setRowsPerPage={setRowsPerPage}
                onAction={(task) => {
                    console.log(task)
                }}
            />
        </div>
    );
}