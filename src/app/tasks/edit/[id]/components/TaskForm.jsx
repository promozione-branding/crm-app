// src/app/tasks/edit/[id]/components/TaskForm.jsx

// src/app/tasks/edit/[id]/components/TaskForm.jsx

'use client';

import React, { useEffect, useState } from 'react';
import { usePermissions, hasPermission, getScope } from '@/lib/permissions';

export default function TaskForm({ form, task, onChange }) {
    const [minDateTime, setMinDateTime] = useState('');

    // =================================================
    // PERMISSIONS
    // =================================================

    const { user, permissions, loading: permissionsLoading } = usePermissions();

    /*
     * User must have the "edit" permission
     * for the tasks module.
     */
    const canEditTasks = hasPermission(permissions, 'tasks', 'edit');

    /*
     * Get the configured scope for tasks.
     *
     * Possible values:
     * - own
     * - team
     * - all
     */
    const taskScope = getScope(permissions, 'tasks');

    // =================================================
    // CHECK TASK OWNERSHIP
    // =================================================

    const currentUserId = String(user?._id || user?.id || '');

    const assignedUserId = String(task?.assignedTo?._id || task?.assignedTo || '');

    const isOwnTask = Boolean(currentUserId) && Boolean(assignedUserId) && currentUserId === assignedUserId;

    // =================================================
    // DETERMINE WHETHER THIS TASK CAN BE EDITED
    // =================================================

    /*
     * ALL:
     * User can edit any task.
     *
     * OWN:
     * User can edit only tasks assigned to themselves.
     *
     * TEAM:
     * Team validation should eventually be added here
     * using your application's team membership data.
     *
     * For now, TEAM does not automatically pass because
     * we should not guess team membership.
     */
    const canEditThisTask = !permissionsLoading && canEditTasks && (taskScope === 'all' || (taskScope === 'own' && isOwnTask));

    /*
     * For an OWN-scoped task:
     *
     * Only Description + Status can be changed.
     *
     * For ALL-scoped tasks:
     * The remaining editable task fields are enabled.
     */
    const isOwnScopedEdit = taskScope === 'own' && isOwnTask;

    const canEditDescription = canEditThisTask;

    const canEditStatus = canEditThisTask;

    const canEditOtherFields = canEditThisTask && !isOwnScopedEdit;

    // =================================================
    // GET CURRENT DATE & TIME FROM BROWSER
    // =================================================

    useEffect(() => {
        const updateMinDateTime = () => {
            const now = new Date();

            const year = now.getFullYear();

            const month = String(now.getMonth() + 1).padStart(2, '0');

            const day = String(now.getDate()).padStart(2, '0');

            const hours = String(now.getHours()).padStart(2, '0');

            const minutes = String(now.getMinutes()).padStart(2, '0');

            const currentDateTime = `${year}-${month}-${day}T${hours}:${minutes}`;

            setMinDateTime(currentDateTime);
        };

        updateMinDateTime();

        /*
         * Keep minimum date/time updated
         * while the form remains open.
         */
        const interval = setInterval(updateMinDateTime, 60 * 1000);

        return () => {
            clearInterval(interval);
        };
    }, []);

    // =================================================
    // HANDLE DUE DATE CHANGE
    // =================================================

    const handleDueDateChange = (e) => {
        /*
         * This should normally only be called when
         * the field is editable.
         */
        if (!canEditOtherFields) {
            return;
        }

        const selectedDateTime = e.target.value;

        const now = new Date();

        const year = now.getFullYear();

        const month = String(now.getMonth() + 1).padStart(2, '0');

        const day = String(now.getDate()).padStart(2, '0');

        const hours = String(now.getHours()).padStart(2, '0');

        const minutes = String(now.getMinutes()).padStart(2, '0');

        const currentDateTime = `${year}-${month}-${day}T${hours}:${minutes}`;

        // Prevent selecting past date/time
        if (selectedDateTime && selectedDateTime < currentDateTime) {
            alert('Due date and time cannot be in the past.');

            return;
        }

        onChange(e);
    };

    return (
        <div className="space-y-5">
            {/* =================================================
                TASK TITLE
            ================================================= */}

            <div>
                <label htmlFor="title" className="mb-2 block text-sm font-medium">
                    Task Title
                </label>

                <input
                    id="title"
                    type="text"
                    name="title"
                    value={form.title}
                    onChange={onChange}
                    disabled={!canEditOtherFields}
                    placeholder="Enter task title"
                    className="border-app bg-surface text-app w-full min-w-0 rounded-lg border px-3 py-2.5 text-sm transition outline-none focus:ring-2 focus:ring-blue-500/30 disabled:cursor-not-allowed disabled:opacity-60 sm:px-4"
                />
            </div>

            {/* =================================================
                DESCRIPTION
            ================================================= */}

            <div>
                <label htmlFor="description" className="mb-2 block text-sm font-medium">
                    Description
                </label>

                <textarea
                    id="description"
                    name="description"
                    value={form.description}
                    onChange={onChange}
                    disabled={!canEditDescription}
                    rows={5}
                    placeholder="Enter task description"
                    className="border-app bg-surface text-app w-full min-w-0 resize-y rounded-lg border px-3 py-2.5 text-sm transition outline-none focus:ring-2 focus:ring-blue-500/30 disabled:cursor-not-allowed disabled:opacity-60 sm:px-4"
                />
            </div>

            {/* =================================================
                GRID
            ================================================= */}

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5">
                {/* =================================================
                    PRIORITY
                ================================================= */}

                <div>
                    <label htmlFor="priority" className="mb-2 block text-sm font-medium">
                        Priority
                    </label>

                    <select
                        id="priority"
                        name="priority"
                        value={form.priority}
                        onChange={onChange}
                        disabled={!canEditOtherFields}
                        className="border-app bg-surface text-app w-full rounded-lg border px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500/30 disabled:cursor-not-allowed disabled:opacity-60 sm:px-4"
                    >
                        <option value="low">Low</option>

                        <option value="medium">Medium</option>

                        <option value="high">High</option>

                        <option value="urgent">Urgent</option>
                    </select>
                </div>

                {/* =================================================
                    STATUS
                ================================================= */}

                <div>
                    <label htmlFor="status" className="mb-2 block text-sm font-medium">
                        Status
                    </label>

                    <select
                        id="status"
                        name="status"
                        value={form.status}
                        onChange={onChange}
                        disabled={!canEditStatus}
                        className="border-app bg-surface text-app w-full rounded-lg border px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500/30 disabled:cursor-not-allowed disabled:opacity-60 sm:px-4"
                    >
                        <option value="pending">Pending</option>

                        <option value="completed">Completed</option>

                        <option value="cancelled">Cancelled</option>
                    </select>
                </div>

                {/* =================================================
                    ASSIGNED TO
                ================================================= */}

                <div>
                    <label htmlFor="assignedTo" className="mb-2 block text-sm font-medium">
                        Assigned To
                    </label>

                    <input
                        id="assignedTo"
                        type="text"
                        value={task?.assignedTo?.name || 'Not assigned'}
                        disabled
                        className="border-app bg-surface text-app w-full min-w-0 cursor-not-allowed rounded-lg border px-3 py-2.5 text-sm opacity-70 sm:px-4"
                    />

                    <p className="mt-1.5 text-[11px] opacity-50 sm:text-xs">Assigned user cannot be changed from this form.</p>
                </div>

                {/* =================================================
                    DUE DATE
                ================================================= */}

                <div>
                    <label htmlFor="dueDate" className="mb-2 block text-sm font-medium">
                        Due Date
                    </label>

                    <input
                        id="dueDate"
                        type="datetime-local"
                        name="dueDate"
                        value={form.dueDate || ''}
                        onChange={handleDueDateChange}
                        min={minDateTime}
                        disabled={!canEditOtherFields}
                        className="border-app bg-surface text-app w-full min-w-0 rounded-lg border px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500/30 disabled:cursor-not-allowed disabled:opacity-60 sm:px-4"
                    />

                    <p className="mt-1.5 text-[11px] opacity-50 sm:text-xs">Past date and time cannot be selected.</p>
                </div>

                {/* =================================================
                    REMINDER
                ================================================= */}

                <div className="sm:col-span-2">
                    <label htmlFor="reminderMinutes" className="mb-2 block text-sm font-medium">
                        Reminder
                    </label>

                    <select
                        id="reminderMinutes"
                        name="reminderMinutes"
                        value={form.reminderMinutes}
                        onChange={onChange}
                        disabled={!canEditOtherFields}
                        className="border-app bg-surface text-app w-full rounded-lg border px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500/30 disabled:cursor-not-allowed disabled:opacity-60 sm:px-4"
                    >
                        <option value={0}>No Reminder</option>

                        <option value={5}>5 Minutes Before</option>

                        <option value={10}>10 Minutes Before</option>

                        <option value={15}>15 Minutes Before</option>
                    </select>
                </div>
            </div>
        </div>
    );
}
