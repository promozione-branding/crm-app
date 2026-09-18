// src/components/user/leads/form/Task.jsx

'use client';

import Modal from '@/components/user/ui/Modal';
import { Calendar, ClipboardCheck, Plus, Pencil } from 'lucide-react';

import React, { useEffect, useState } from 'react';

import TextArea from '../../ui/TextArea';
import Input from '../../ui/Input';
import SelectInput from '../../ui/SelectInput';

import toast from 'react-hot-toast';
import axios from 'axios';

import { useRouter } from 'next/navigation';

export default function Task({ lead, getLead, users = [], usersLoading = false }) {
    // ================= ROUTER =================

    const router = useRouter();

    // ================= STATE =================

    const [open, setOpen] = useState(false);

    const [loading, setLoading] = useState(false);

    const [tasks, setTasks] = useState([]);

    // ================= FORM =================

    const [form, setForm] = useState({
        title: '',
        priority: 'medium',
        dueDate: '',
        leadId: lead?._id || '',
        assignedTo: '',
        description: '',
        reminderMinutes: 0,
    });

    // ============================================================
    // BROWSER CURRENT DATE/TIME
    // ============================================================

    const getBrowserDateTime = () => {
        const now = new Date();

        const year = now.getFullYear();

        const month = String(now.getMonth() + 1).padStart(2, '0');

        const day = String(now.getDate()).padStart(2, '0');

        const hours = String(now.getHours()).padStart(2, '0');

        const minutes = String(now.getMinutes()).padStart(2, '0');

        return `${year}-${month}-${day}T${hours}:${minutes}`;
    };

    // ============================================================
    // HANDLE CHANGE
    // ============================================================

    const handleChange = ({ target: { name, value } }) => {
        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // ============================================================
    // GET TASKS
    // ============================================================

    const getTasks = async () => {
        if (!lead?._id) {
            return;
        }

        try {
            const res = await axios.get(`/api/user/task?leadId=${lead._id}`, {
                withCredentials: true,
            });

            setTasks(res.data.data?.tasks || []);
        } catch (error) {
            console.error('GET TASKS ERROR:', error);

            toast.error(error.response?.data?.message || 'Failed to load tasks.');
        }
    };

    // ============================================================
    // LOAD TASKS
    // ============================================================

    useEffect(() => {
        if (lead?._id) {
            setForm((prev) => ({
                ...prev,
                leadId: lead._id,
            }));

            getTasks();
        }
    }, [lead?._id]);

    // ============================================================
    // RESET FORM
    // ============================================================

    const resetForm = () => {
        setForm({
            title: '',

            priority: 'medium',

            dueDate: '',

            leadId: lead?._id || '',

            assignedTo: '',

            description: '',

            reminderMinutes: 0,
        });
    };

    // ============================================================
    // CREATE TASK
    // ============================================================

    const handleSave = async () => {
        // ---------------- TITLE ----------------

        if (!form.title.trim()) {
            return toast.error('Enter task title.');
        }

        // ---------------- DATE ----------------

        if (!form.dueDate) {
            return toast.error('Select due date and time.');
        }

        // ========================================================
        // IMPORTANT:
        // Compare selected date/time with BROWSER CURRENT TIME.
        // This does NOT use API/server time.
        // ========================================================

        const selectedDateTime = new Date(form.dueDate);

        const currentBrowserTime = new Date();

        if (Number.isNaN(selectedDateTime.getTime())) {
            return toast.error('Invalid due date and time.');
        }

        if (selectedDateTime.getTime() < currentBrowserTime.getTime()) {
            return toast.error('Task date and time cannot be in the past.');
        }

        // ---------------- ASSIGNED USER ----------------

        if (!form.assignedTo) {
            return toast.error('Select assigned user.');
        }

        // ========================================================
        // CREATE
        // ========================================================

        const toastId = toast.loading('Creating task...');

        try {
            setLoading(true);

            const res = await axios.post(
                '/api/user/task',
                {
                    ...form,

                    reminderMinutes: Number(form.reminderMinutes),
                },
                {
                    withCredentials: true,
                }
            );

            toast.success(res.data.message || 'Task created successfully.', {
                id: toastId,
            });

            resetForm();

            setOpen(false);

            // Refresh task list
            await getTasks();

            // Refresh lead task count
            await getLead();
        } catch (error) {
            console.error('CREATE TASK ERROR:', error);

            toast.error(error.response?.data?.message || 'Failed to create task.', {
                id: toastId,
            });
        } finally {
            setLoading(false);
        }
    };

    // ============================================================
    // UPDATE TASK STATUS
    // ============================================================

    const updateTaskStatus = async (taskId, status) => {
        const confirmed = window.confirm(`Are you sure you want to mark this task as "${status}"?`);

        if (!confirmed) {
            return;
        }

        const toastId = toast.loading('Updating task...');

        try {
            await axios.put(
                `/api/user/task/${taskId}`,
                {
                    status,
                },
                {
                    withCredentials: true,
                }
            );

            toast.success('Task updated.', {
                id: toastId,
            });

            // Refresh tasks
            await getTasks();

            // Refresh lead task count
            await getLead();
        } catch (error) {
            console.error('UPDATE TASK ERROR:', error);

            toast.error(error.response?.data?.message || 'Failed to update task.', {
                id: toastId,
            });
        }
    };

    // ============================================================
    // EDIT TASK
    // ============================================================

    const handleEditTask = (task) => {
        if (!task?._id) {
            toast.error('Task ID not found.');

            return;
        }

        router.push(`/tasks/edit/${task._id}?returnTo=${encodeURIComponent(`/leads/edit/${lead._id}`)}`);
    };

    // ============================================================
    // UI
    // ============================================================

    return (
        <>
            {/* ====================================================
                TASK CARD
            ==================================================== */}

            <div className="bg-card border-app text-app rounded-2xl border p-5">
                {/* =================================================
                    HEADER
                ================================================= */}

                <div className="flex items-center justify-between">
                    <h3 className="text-muted text-xs font-semibold tracking-widest uppercase">Tasks</h3>

                    {/* ================= ADD TASK ================= */}

                    <button type="button" onClick={() => setOpen(true)} className="bg-app border-app hover-app text-app rounded-lg border p-2" title="Add Task">
                        <Plus size={16} />
                    </button>
                </div>

                {/* =================================================
                    DIVIDER
                ================================================= */}

                <div className="border-app my-4 border-b" />

                {/* =================================================
                    NO TASK
                ================================================= */}

                {tasks.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                        <div className="bg-app border-app text-app flex h-14 w-14 items-center justify-center rounded-full border">
                            <ClipboardCheck size={24} className="opacity-80" />
                        </div>

                        <h4 className="text-app mt-4 text-sm font-medium">No Task Found</h4>

                        <p className="text-muted mt-1 text-xs">Tasks history will appear here.</p>
                    </div>
                ) : (
                    /* =================================================
                        TASK LIST
                    ================================================= */

                    <div className="space-y-3">
                        {tasks.map((task) => (
                            <div key={task._id} className="border-app bg-app rounded-xl border p-4">
                                {/* =================================
                                        TASK HEADER
                                    ================================= */}

                                <div className="flex justify-between gap-3">
                                    <div className="min-w-0">
                                        <h4 className="text-sm font-semibold break-words">{task.title}</h4>

                                        <p className="text-muted mt-1 text-xs break-words">{task.description || 'No description'}</p>
                                    </div>

                                    <span className="shrink-0 text-xs capitalize">{task.priority}</span>
                                </div>

                                {/* =================================
                                        TASK INFO
                                    ================================= */}

                                <div className="text-muted mt-3 flex flex-wrap gap-3 text-xs">
                                    <span>Due: {task.dueDate ? new Date(task.dueDate).toLocaleString() : '-'}</span>

                                    <span>Assigned: {task.assignedTo?.name || '-'}</span>
                                </div>

                                {/* =================================
                                        TASK ACTIONS
                                    ================================= */}

                                <div className="mt-3 flex flex-wrap gap-2">
                                    {/* ============================
                                            EDIT
                                        ============================ */}

                                    <button
                                        type="button"
                                        onClick={() => handleEditTask(task)}
                                        className="border-app hover-app flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs transition"
                                    >
                                        <Pencil size={13} />
                                        Edit
                                    </button>

                                    {/* ============================
                                            COMPLETE / CANCEL
                                        ============================ */}

                                    {task.status === 'pending' && (
                                        <>
                                            <button
                                                type="button"
                                                onClick={() => updateTaskStatus(task._id, 'completed')}
                                                className="btn-primary rounded-lg px-3 py-1.5 text-xs"
                                            >
                                                Complete
                                            </button>

                                            <button
                                                type="button"
                                                onClick={() => updateTaskStatus(task._id, 'cancelled')}
                                                className="border-app hover-app rounded-lg border px-3 py-1.5 text-xs"
                                            >
                                                Cancel
                                            </button>
                                        </>
                                    )}

                                    {/* ============================
                                            NON-PENDING STATUS
                                        ============================ */}

                                    {task.status !== 'pending' && <span className="flex items-center px-2 text-xs capitalize opacity-70">{task.status}</span>}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* ====================================================
                ADD TASK MODAL
            ==================================================== */}

            <Modal isOpen={open} onClose={() => setOpen(false)} size="md">
                <Modal.Header>Add Task</Modal.Header>

                <Modal.Body>
                    <div className="space-y-2">
                        {/* =========================================
                            TITLE + PRIORITY
                        ========================================= */}

                        <div className="grid gap-2 md:grid-cols-2">
                            <Input label="Task Title" required name="title" value={form.title} onChange={handleChange} placeholder="Enter task title" />

                            <SelectInput
                                label="Priority"
                                name="priority"
                                value={form.priority}
                                onChange={handleChange}
                                options={[
                                    {
                                        label: 'Low',
                                        value: 'low',
                                    },
                                    {
                                        label: 'Medium',
                                        value: 'medium',
                                    },
                                    {
                                        label: 'High',
                                        value: 'high',
                                    },
                                    {
                                        label: 'Urgent',
                                        value: 'urgent',
                                    },
                                ]}
                            />
                        </div>

                        {/* =========================================
                            LEAD + ASSIGNED USER
                        ========================================= */}

                        <div className="grid gap-2 md:grid-cols-2">
                            <SelectInput
                                label="Related Lead"
                                required
                                name="leadId"
                                value={form.leadId || lead?._id}
                                onChange={handleChange}
                                disabled
                                options={[
                                    {
                                        label: lead?.name,
                                        value: lead?._id,
                                    },
                                ]}
                            />

                            <SelectInput
                                label="Assigned To"
                                required
                                name="assignedTo"
                                value={form.assignedTo}
                                onChange={handleChange}
                                disabled={usersLoading}
                                options={[
                                    ...users.map((user) => ({
                                        label: `${user.name} (${user.roleId?.name})`,
                                        value: user._id,
                                    })),
                                ]}
                            />
                        </div>

                        {/* =========================================
                            DATE + REMINDER
                        ========================================= */}

                        <div className="grid gap-2 md:grid-cols-2">
                            <Input
                                label="Due Date & Time"
                                required
                                type="datetime-local"
                                name="dueDate"
                                value={form.dueDate}
                                onChange={handleChange}
                                min={getBrowserDateTime()}
                            />

                            <SelectInput
                                label="Add Reminder"
                                name="reminderMinutes"
                                value={String(form.reminderMinutes)}
                                onChange={handleChange}
                                options={[
                                    {
                                        label: 'None',
                                        value: '0',
                                    },
                                    {
                                        label: '5 minutes before',
                                        value: '5',
                                    },
                                    {
                                        label: '10 minutes before',
                                        value: '10',
                                    },
                                    {
                                        label: '15 minutes before',
                                        value: '15',
                                    },
                                ]}
                            />
                        </div>

                        {/* =========================================
                            DESCRIPTION
                        ========================================= */}

                        <TextArea label="Description" name="description" value={form.description} onChange={handleChange} placeholder="Add task details..." />
                    </div>
                </Modal.Body>

                {/* =================================================
                    MODAL FOOTER
                ================================================= */}

                <Modal.Footer>
                    <button type="button" onClick={() => setOpen(false)} className="border-app hover-app text-app rounded-lg border px-4 py-2 text-xs">
                        Cancel
                    </button>

                    <button
                        type="button"
                        onClick={handleSave}
                        disabled={loading}
                        className="btn-primary rounded-lg px-4 py-2 text-xs disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {loading ? 'Saving...' : 'Save'}
                    </button>
                </Modal.Footer>
            </Modal>
        </>
    );
}
