"use client";

import React, {
    useEffect,
    useState,
} from "react";

import {
    Search,
    Filter,
    Plus,
} from "lucide-react";

import DynamicTable from "@/components/user/ui/DynamicTable";
import TaskMobileList from "./components/TaskMobileList";

import toast from "react-hot-toast";
import axios from "axios";
import { useRouter } from "next/navigation";

// ============================================================
// DESKTOP TABLE COLUMNS
// ============================================================

const columns = [
    {
        key: "title",
        label: "Task Title",
        sortable: true,
    },

    {
        key: "leadId.name",
        label: "Related Lead",
        sortable: true,
    },

    {
        key: "priority",
        label: "Priority",
        sortable: true,
    },

    {
        key: "status",
        label: "Status",
        sortable: true,

        render: (task) => (
            <span className="px-3 py-1 rounded-full text-xs bg-blue-500/10 text-blue-500 capitalize">
                {task.status}
            </span>
        ),
    },

    {
        key: "createdBy.name",
        label: "Created By",
        sortable: true,
    },

    {
        key: "assignedTo.name",
        label: "Assigned To",
        sortable: true,
    },

    {
        key: "dueDate",
        type: "date",
        label: "Due Date",
        sortable: true,
    },
];

// ============================================================
// MAIN TASK PAGE
// ============================================================

export default function Task() {
    const router = useRouter();

    // ========================================================
    // STATE
    // ========================================================

    const [page, setPage] = useState(1);

    const [tasks, setTasks] = useState([]);

    const [total, setTotal] = useState(0);

    const [loading, setLoading] = useState(false);

    const [search, setSearch] = useState("");

    const [rowsPerPage, setRowsPerPage] = useState(25);

    // ========================================================
    // GET TASKS
    // ========================================================

    const getTasks = async () => {
        try {
            setLoading(true);

            const res = await axios.get(
                "/api/user/task",
                {
                    params: {
                        page,
                        limit: rowsPerPage,
                        search:
                            search.trim() ||
                            undefined,
                    },

                    withCredentials: true,
                }
            );

            setTasks(
                res.data.data?.tasks || []
            );

            setTotal(
                res.data.data
                    ?.pagination?.total || 0
            );
        } catch (error) {
            console.error(
                "Failed to load tasks:",
                error
            );

            toast.error(
                error?.response?.data
                    ?.message ||
                "Failed to load tasks."
            );
        } finally {
            setLoading(false);
        }
    };

    // ========================================================
    // PAGINATION
    // ========================================================

    useEffect(() => {
        getTasks();
    }, [
        page,
        rowsPerPage,
    ]);

    // ========================================================
    // SEARCH
    // ========================================================

    useEffect(() => {
        const timer =
            setTimeout(() => {
                setPage(1);
                getTasks();
            }, 500);

        return () => {
            clearTimeout(timer);
        };
    }, [search]);

    // ========================================================
    // TASK ACTION
    // ========================================================

    const handleTaskAction = (task) => {
        router.push(
            `/tasks/edit/${task._id}`
        );
    };

    // ========================================================
    // UI
    // ========================================================

    return (
        <div className="bg-surface text-app min-h-[calc(100vh-64px)] p-6">

            {/* ==================================================
                HEADER
            ================================================== */}

            <div
                className="
                    mb-5
                    flex
                    flex-col
                    gap-4
                    md:mb-6
                    md:flex-row
                    md:items-center
                    md:justify-between
                "
            >

                {/* TITLE */}

                <div>
                    <h1
                        className="
                            text-base
                            font-bold
                        "
                    >
                        CRM
                    </h1>

                    <p
                        className="
                            text-xs
                            opacity-70
                        "
                    >
                        Manage your tasks
                    </p>
                </div>

                {/* ACTIONS */}

                <div
                    className="
                        flex
                        flex-wrap
                        items-center
                        gap-2
                        sm:gap-3
                    "
                >

                    {/* ADD TASK */}

                    <button
                        type="button"
                        className="
                            flex
                            h-9
                            items-center
                            justify-center
                            gap-2
                            rounded-lg
                            px-3
                            text-sm
                            btn-primary
                        "
                    >
                        <Plus size={16} />

                        <span>
                            Add Task
                        </span>
                    </button>

                    {/* FILTER */}

                    <button
                        type="button"
                        className="
                            flex
                            h-9
                            items-center
                            justify-center
                            gap-2
                            rounded-lg
                            border
                            border-app
                            px-3
                            text-sm
                            hover-app
                        "
                    >
                        <Filter size={16} />

                        <span>
                            Filter
                        </span>
                    </button>

                    {/* SEARCH */}

                    <div
                        className="
                            relative
                            w-full
                            sm:w-60
                        "
                    >
                        <Search
                            size={16}
                            className="
                                absolute
                                left-3
                                top-1/2
                                -translate-y-1/2
                                opacity-60
                            "
                        />

                        <input
                            value={search}
                            onChange={(e) =>
                                setSearch(
                                    e.target.value
                                )
                            }
                            placeholder="Search task..."
                            className="
                                h-9
                                w-full
                                rounded-lg
                                border
                                border-app
                                bg-app
                                pl-10
                                pr-3
                                text-sm
                                outline-none
                                focus:ring-2
                                focus:ring-blue-500
                            "
                        />
                    </div>
                </div>
            </div>

            {/* ==================================================
                MOBILE
            ================================================== */}

            <div className="md:hidden">
                <TaskMobileList
                    tasks={tasks}
                    loading={loading}
                    onAction={handleTaskAction}
                />
            </div>

            {/* ==================================================
                DESKTOP
            ================================================== */}

            <div className="hidden md:block">
                <DynamicTable
                    loading={loading}
                    columns={columns}
                    data={tasks}
                    page={page}
                    setPage={setPage}
                    total={total}
                    rowsPerPage={rowsPerPage}
                    setRowsPerPage={setRowsPerPage}
                    onAction={handleTaskAction}
                />
            </div>
        </div>
    );
}