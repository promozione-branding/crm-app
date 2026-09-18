// src/app/tasks/Task.jsx

'use client';

import React, { useEffect, useState } from 'react';

import DynamicTable from '@/components/user/ui/DynamicTable';
import TaskMobileList from './components/TaskMobileList';
import SearchAndFilterTask from './components/SearchAndFilterTask';
import Dashboarddata from '../dashboard/components/Dashboarddata';

import toast from 'react-hot-toast';
import axios from 'axios';
import { useRouter } from 'next/navigation';

// ============================================================
// DESKTOP TABLE COLUMNS
// ============================================================

const columns = [
    {
        key: 'title',
        label: 'Task Title',
        sortable: true,
    },

    {
        key: 'leadId.name',
        label: 'Related Lead',
        sortable: true,
    },

    {
        key: 'priority',
        label: 'Priority',
        sortable: true,
    },

    {
        key: 'status',
        label: 'Status',
        sortable: true,

        render: (task) => <span className="rounded-full bg-blue-500/10 px-3 py-1 text-xs text-blue-500 capitalize">{task.status}</span>,
    },

    {
        key: 'createdBy.name',
        label: 'Created By',
        sortable: true,
    },

    {
        key: 'assignedTo.name',
        label: 'Assigned To',
        sortable: true,
    },

    {
        key: 'dueDate',
        type: 'date',
        label: 'Due Date',
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

    // Main task title search
    const [search, setSearch] = useState('');

    // Related lead search
    const [relatedTo, setRelatedTo] = useState('');

    // Assigned user search
    const [assignedTo, setAssignedTo] = useState('');

    // Priority filter
    const [priority, setPriority] = useState('');

    const [rowsPerPage, setRowsPerPage] = useState(25);

    // ========================================================
    // GET TASKS
    // ========================================================

    const getTasks = async ({
        requestedPage = page,
        requestedRowsPerPage = rowsPerPage,
        requestedSearch = search,
        requestedRelatedTo = relatedTo,
        requestedAssignedTo = assignedTo,
        requestedPriority = priority,
    } = {}) => {
        try {
            setLoading(true);

            const params = {
                page: requestedPage,
                limit: requestedRowsPerPage,

                // Task title / description
                search: requestedSearch.trim() || undefined,

                // Related Lead name
                relatedTo: requestedRelatedTo.trim() || undefined,

                // Assigned User name
                assignedToSearch: requestedAssignedTo.trim() || undefined,

                // Priority
                priority: requestedPriority || undefined,
            };

            console.log('GET TASKS PARAMS:', params);

            const res = await axios.get('/api/user/task', {
                params,
                withCredentials: true,
            });

            const taskData = res.data?.data;

            setTasks(taskData?.tasks || []);

            setTotal(taskData?.pagination?.total || 0);
        } catch (error) {
            console.error('Failed to load tasks:', error);

            toast.error(error?.response?.data?.message || 'Failed to load tasks.');
        } finally {
            setLoading(false);
        }
    };

    // ========================================================
    // INITIAL LOAD + PAGINATION
    // ========================================================

    useEffect(() => {
        getTasks();
    }, [page, rowsPerPage]);

    // ========================================================
    // SEARCH + FILTER
    // ========================================================

    useEffect(() => {
        const timer = setTimeout(() => {
            setPage(1);

            getTasks({
                requestedPage: 1,
                requestedRowsPerPage: rowsPerPage,
                requestedSearch: search,
                requestedRelatedTo: relatedTo,
                requestedAssignedTo: assignedTo,
                requestedPriority: priority,
            });
        }, 500);

        return () => {
            clearTimeout(timer);
        };
    }, [search, relatedTo, assignedTo, priority]);

    // ========================================================
    // TASK ACTION
    // ========================================================

    const handleTaskAction = (task) => {
        router.push(`/tasks/edit/${task._id}`);
    };

    // ========================================================
    // ADD TASK
    // ========================================================

    const handleAddTask = () => {
        router.push('/tasks/add');
    };

    // ========================================================
    // UI
    // ========================================================

    return (
        <div className="bg-surface text-app min-h-[calc(100vh-64px)] p-6">
            {/* ==================================================
    HEADER
================================================== */}

            <div className="mb-5 md:mb-6">
                {/* ==================================================
        ROW 1 — DASHBOARD DATA
    ================================================== */}

                <div className="border-app bg-app w-full rounded-xl border px-2 py-2 shadow-sm sm:rounded-2xl sm:px-4 sm:py-3">
                    <Dashboarddata />
                </div>

                {/* ==================================================
        ROW 2 — SEARCH + FILTER + ADD TASK
    ================================================== */}

                <div className="mt-3 w-full sm:mt-4">
                    <SearchAndFilterTask
                        search={search}
                        setSearch={setSearch}
                        relatedTo={relatedTo}
                        setRelatedTo={setRelatedTo}
                        assignedTo={assignedTo}
                        setAssignedTo={setAssignedTo}
                        priority={priority}
                        setPriority={setPriority}
                        onAddTask={handleAddTask}
                    />
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
                    page={page}
                    setPage={setPage}
                    total={total}
                    rowsPerPage={rowsPerPage}
                    setRowsPerPage={setRowsPerPage}
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
