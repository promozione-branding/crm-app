// src/app/tasks/Task.jsx

'use client';

import React, { useEffect, useMemo, useState } from 'react';

import DynamicTable from '@/components/user/ui/DynamicTable';
import TaskMobileList from './components/TaskMobileList';
import SearchAndFilterTask from './components/SearchAndFilterTask';
import Dashboarddata from '../dashboard/components/Dashboarddata';
import { PriorityBadge, StatusBadge } from './components/TaskBadges';
import { formatDueDate, isOverdue, sortTasks } from './components/TaskUtils';
import toast from 'react-hot-toast';
import axios from 'axios';
import { useRouter } from 'next/navigation';

// ============================================================
// DUE DATE CELL — highlights red when overdue
// ============================================================

function DueDateCell({ task }) {
    const overdue = isOverdue(task?.dueDate, task?.status);

    return (
        <span
            className={`inline-flex items-center rounded-md px-1.5 py-0.5 text-[11px] ${
                overdue ? 'bg-red-500/10 font-semibold text-red-600 dark:text-red-400' : ''
            }`}
        >
            {formatDueDate(task?.dueDate)}
        </span>
    );
}

// ============================================================
// DESKTOP TABLE COLUMNS
// ============================================================

const columns = [
    { key: 'title', label: 'Task Title', sortable: true },
    { key: 'leadId.name', label: 'Related Lead', sortable: true },
    {
        key: 'priority',
        label: 'Priority',
        sortable: true,
        render: (task) => <PriorityBadge priority={task.priority} />,
    },
    {
        key: 'status',
        label: 'Status',
        sortable: true,
        render: (task) => <StatusBadge status={task.status} />,
    },
    { key: 'createdBy.name', label: 'Created By', sortable: true },
    { key: 'assignedTo.name', label: 'Assigned To', sortable: true },
    {
        key: 'dueDate',
        label: 'Due Date',
        sortable: true,
        render: (task) => <DueDateCell task={task} />,
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

    const [search, setSearch] = useState('');
    const [relatedTo, setRelatedTo] = useState('');
    const [assignedTo, setAssignedTo] = useState('');
    const [priority, setPriority] = useState('');
    const [stage, setStage] = useState([]);           // multi-select

    const [sortBy, setSortBy] = useState('');

    const [rowsPerPage, setRowsPerPage] = useState(25);

    // ========================================================
    // SORTED TASKS (instant, no refetch)
    // ========================================================

    const sortedTasks = useMemo(() => sortTasks(tasks, sortBy), [tasks, sortBy]);

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
        requestedStage = stage,
    } = {}) => {
        try {
            setLoading(true);

            const params = {
                page: requestedPage,
                limit: requestedRowsPerPage,
                search: requestedSearch.trim() || undefined,
                relatedTo: requestedRelatedTo.trim() || undefined,
                assignedToSearch: requestedAssignedTo.trim() || undefined,
                priority: requestedPriority || undefined,

                // Multi-select stage → comma-separated
                stage: requestedStage.length ? requestedStage.join(',') : undefined,
            };

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
    // SEARCH + FILTER (debounced)
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
                requestedStage: stage,
            });
        }, 500);

        return () => clearTimeout(timer);
    }, [search, relatedTo, assignedTo, priority, stage]);

    // ========================================================
    // ACTIONS
    // ========================================================

    const handleTaskAction = (task) => {
        router.push(`/tasks/edit/${task._id}`);
    };

    const handleAddTask = () => {
        router.push('/tasks/add');
    };

    // ========================================================
    // UI
    // ========================================================

    return (
        <div className="bg-surface text-app min-h-[calc(100vh-64px)] p-6">
            {/* HEADER */}
            <div className="mb-5 md:mb-6">
                <div className="border-app bg-app w-full rounded-xl border px-2 py-2 shadow-sm sm:rounded-2xl sm:px-4 sm:py-3">
                    <Dashboarddata />
                </div>

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
                        sortBy={sortBy}
                        setSortBy={setSortBy}
                        stage={stage}
                        setStage={setStage}
                        onAddTask={handleAddTask}
                    />
                </div>
            </div>

            {/* MOBILE */}
            <div className="md:hidden">
                <TaskMobileList
                    tasks={sortedTasks}
                    loading={loading}
                    onAction={handleTaskAction}
                    page={page}
                    setPage={setPage}
                    total={total}
                    rowsPerPage={rowsPerPage}
                    setRowsPerPage={setRowsPerPage}
                />
            </div>

            {/* DESKTOP */}
            <div className="hidden md:block">
                <DynamicTable
                    loading={loading}
                    columns={columns}
                    data={sortedTasks}
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