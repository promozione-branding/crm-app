// src/app/tasks/edit/[id]/Edit.jsx

'use client';

import React, { useCallback, useEffect, useState } from 'react';

import { Loader2, ClipboardCheck } from 'lucide-react';

import { useParams, useRouter } from 'next/navigation';

import axios from 'axios';
import toast from 'react-hot-toast';

import TaskHeader from './components/TaskHeader';
import TaskForm from './components/TaskForm';
import TaskLeadInfo from './components/TaskLeadInfo';
import TaskActions from './components/TaskActions';

export default function Edit() {
    const { id } = useParams();
    const router = useRouter();

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [task, setTask] = useState(null);

    const [form, setForm] = useState({
        title: '',
        description: '',
        priority: 'medium',
        assignedTo: '',
        dueDate: '',
        reminderMinutes: 0,
        status: 'pending',
    });

    /* =====================================================
       FORMAT DATE FOR DATETIME-LOCAL
    ===================================================== */

    const formatDateTimeLocal = useCallback((date) => {
        const d = new Date(date);

        if (isNaN(d.getTime())) {
            return '';
        }

        const year = d.getFullYear();

        const month = String(d.getMonth() + 1).padStart(2, '0');

        const day = String(d.getDate()).padStart(2, '0');

        const hours = String(d.getHours()).padStart(2, '0');

        const minutes = String(d.getMinutes()).padStart(2, '0');

        return `${year}-${month}-${day}T${hours}:${minutes}`;
    }, []);

    /* =====================================================
       SET FORM DATA
    ===================================================== */

    const setTaskForm = useCallback(
        (data) => {
            setTask(data);

            setForm({
                title: data.title || '',

                description: data.description || '',

                priority: data.priority || 'medium',

                assignedTo: data.assignedTo?._id || '',

                dueDate: data.dueDate ? formatDateTimeLocal(data.dueDate) : '',

                reminderMinutes: data.reminderMinutes ?? 0,

                status: data.status || 'pending',
            });
        },
        [formatDateTimeLocal]
    );

    /* =====================================================
       GET SINGLE TASK
    ===================================================== */

    const getTask = useCallback(async () => {
        if (!id) return;

        try {
            setLoading(true);

            const res = await axios.get(`/api/user/task/${id}`, {
                withCredentials: true,
            });

            console.log('TASK RESPONSE:', res.data);

            const data = res.data?.data;

            if (!data) {
                throw new Error('Task data not found.');
            }

            setTaskForm(data);
        } catch (error) {
            console.error('GET TASK ERROR:', error);

            toast.error(error.response?.data?.message || 'Failed to load task.');
        } finally {
            setLoading(false);
        }
    }, [id, setTaskForm]);

    /* =====================================================
       FETCH TASK
    ===================================================== */

    useEffect(() => {
        if (!id) return;

        getTask();
    }, [id, getTask]);

    /* =====================================================
       HANDLE INPUT
    ===================================================== */

    const handleChange = (e) => {
        const { name, value } = e.target;

        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    /* =====================================================
       UPDATE TASK
    ===================================================== */

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!form.title.trim()) {
            toast.error('Task title is required.');
            return;
        }

        if (!form.dueDate) {
            toast.error('Due date is required.');
            return;
        }

        try {
            setSaving(true);

            const toastId = toast.loading('Updating task...');

            const res = await axios.put(
                `/api/user/task/${id}`,
                {
                    title: form.title.trim(),

                    description: form.description.trim(),

                    priority: form.priority,

                    assignedTo: form.assignedTo,

                    dueDate: form.dueDate,

                    reminderMinutes: Number(form.reminderMinutes),

                    status: form.status,
                },
                {
                    withCredentials: true,
                }
            );

            toast.success(res.data?.message || 'Task updated successfully.', {
                id: toastId,
            });

            /* ---------------------------------------------
               Update local state
            --------------------------------------------- */

            if (res.data?.data) {
                setTaskForm(res.data.data);
            }
        } catch (error) {
            console.error('UPDATE TASK ERROR:', error);

            toast.error(error.response?.data?.message || 'Failed to update task.');
        } finally {
            setSaving(false);
        }
    };

    /* =====================================================
       BACK
    ===================================================== */

    const handleBack = () => {
        router.push('/tasks');
    };

    /* =====================================================
       LOADING
    ===================================================== */

    if (loading) {
        return (
            <div
                className="
                    bg-surface
                    text-app
                    min-h-[calc(100vh-64px)]
                    px-4
                    py-5
                    sm:p-6
                "
            >
                <div
                    className="
                        flex
                        items-center
                        justify-center
                        min-h-[400px]
                    "
                >
                    <div
                        className="
                            flex
                            items-center
                            gap-3
                            text-sm
                            opacity-70
                        "
                    >
                        <Loader2 size={20} className="animate-spin" />
                        Loading task...
                    </div>
                </div>
            </div>
        );
    }

    /* =====================================================
       TASK NOT FOUND
    ===================================================== */

    if (!task) {
        return (
            <div
                className="
                    bg-surface
                    text-app
                    min-h-[calc(100vh-64px)]
                    px-4
                    py-5
                    sm:p-6
                "
            >
                <TaskHeader onBack={handleBack} />

                <div
                    className="
                        flex
                        flex-col
                        items-center
                        justify-center
                        text-center
                        min-h-[350px]
                    "
                >
                    <ClipboardCheck
                        size={45}
                        className="
                            opacity-30
                            mb-4
                        "
                    />

                    <h2
                        className="
                            text-lg
                            font-semibold
                        "
                    >
                        Task not found
                    </h2>

                    <p
                        className="
                            text-sm
                            opacity-60
                            mt-1
                            max-w-sm
                        "
                    >
                        The task you are looking for does not exist or could not be loaded.
                    </p>
                </div>
            </div>
        );
    }

    /* =====================================================
       UI
    ===================================================== */

    return (
        <div
            className="
                bg-surface
                text-app
                min-h-[calc(100vh-64px)]
                px-4
                py-5
                sm:p-6
            "
        >
            <div
                className="
                    max-w-5xl
                    mx-auto
                "
            >
                {/* =================================================
                    HEADER
                ================================================= */}

                <TaskHeader onBack={handleBack} />

                {/* =================================================
                    FORM CARD
                ================================================= */}

                <form
                    onSubmit={handleSubmit}
                    className="
                        w-full
                        bg-app
                        border
                        border-app
                        rounded-xl
                        p-4
                        sm:p-6
                        shadow-sm
                    "
                >
                    {/* =================================================
                        FORM
                    ================================================= */}

                    <TaskForm form={form} task={task} onChange={handleChange} />

                    {/* =================================================
                        LEAD
                    ================================================= */}

                    <TaskLeadInfo task={task} />

                    {/* =================================================
                        ACTIONS
                    ================================================= */}

                    <TaskActions saving={saving} onCancel={handleBack} />
                </form>
            </div>
        </div>
    );
}
