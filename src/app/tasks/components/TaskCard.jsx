// src/app/tasks/components/TaskCard.jsx

'use client';

import React, { useState } from 'react';

import { ChevronDown, ChevronUp, Calendar, UserRound, UserCheck, CircleDot } from 'lucide-react';

import { PriorityBadge, StatusBadge } from './TaskBadges';

import { formatDueDate } from './TaskUtils';

export default function TaskCard({ task, onAction, sno }) {
    const [expanded, setExpanded] = useState(false);

    // ============================================================
    // TOGGLE
    // ============================================================

    const handleToggle = () => {
        setExpanded((prev) => !prev);
    };

    // ============================================================
    // EDIT
    // ============================================================

    const handleEdit = (e) => {
        e.stopPropagation();

        onAction(task);
    };

    // ============================================================
    // UI
    // ============================================================

    return (
        <div className="border-app bg-app mb-3 overflow-hidden rounded-lg border last:mb-0">
            {/* ==================================================
                COMPACT TASK ROW
            ================================================== */}

            <button type="button" onClick={handleToggle} className="hover:bg-surface flex w-full items-center gap-3 px-3 py-2.5 text-left transition">
                {/* ==================================================
                    TASK INFO
                ================================================== */}

                <div className="min-w-0 flex-1">
                    {/* S.NO + TASK TITLE */}

                    <div className="flex min-w-0 items-center gap-2">
                        {sno !== undefined && <span className="shrink-0 text-[10px] opacity-40">#{sno}</span>}

                        <p className="truncate text-[14px] font-semibold">{task?.title || 'Untitled Task'}</p>
                    </div>

                    {/* RELATED LEAD */}

                    <div className="mt-0.5 flex min-w-0 items-center gap-1">
                        <UserRound size={11} className="shrink-0 opacity-40" />

                        <span className="truncate text-[12px] opacity-90">{task?.leadId?.name || 'No related lead'}</span>
                    </div>
                </div>

                {/* ==================================================
                    PRIORITY
                ================================================== */}

                <div className="shrink-0">
                    <PriorityBadge priority={task?.priority} />
                </div>

                {/* ==================================================
                    DUE DATE - DESKTOP
                ================================================== */}

                <div className="hidden min-w-[90px] shrink-0 items-center gap-1 sm:flex">
                    <Calendar size={11} className="opacity-40" />

                    <span className="truncate text-[10px] opacity-60">{formatDueDate(task?.dueDate)}</span>
                </div>

                {/* ==================================================
                    CHEVRON
                ================================================== */}

                <div className="bg-surface flex h-6 w-6 shrink-0 items-center justify-center rounded-full">
                    {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                </div>
            </button>

            {/* ==================================================
                MOBILE DUE DATE
            ================================================== */}

            <div className="border-app flex items-center justify-between border-t px-3 py-1.5 sm:hidden">
                <div className="flex items-center gap-1">
                    <Calendar size={11} className="opacity-40" />

                    <span className="text-[12px] opacity-80">Due</span>
                </div>

                <span className="text-[10px] font-medium opacity-70">{formatDueDate(task?.dueDate)}</span>
            </div>

            {/* ==================================================
                EXPANDED CONTENT
            ================================================== */}

            {expanded && (
                <div className="border-app bg-surface border-t p-3">
                    <div className="space-y-2">
                        {/* ==================================================
                            STATUS
                        ================================================== */}

                        <div className="border-app bg-app flex items-center justify-between gap-3 rounded-md border px-3 py-2">
                            <div className="flex items-center gap-2">
                                <CircleDot size={13} className="opacity-40" />

                                <span className="text-[11px] opacity-60">Status</span>
                            </div>

                            <StatusBadge status={task?.status} />
                        </div>

                        {/* ==================================================
                            CREATED BY
                        ================================================== */}

                        <div className="border-app bg-app flex items-center justify-between gap-3 rounded-md border px-3 py-2">
                            <div className="flex items-center gap-2">
                                <UserRound size={13} className="opacity-40" />

                                <span className="text-[11px] opacity-60">Created By</span>
                            </div>

                            <span className="max-w-[55%] truncate text-right text-[11px] font-medium">{task?.createdBy?.name || '-'}</span>
                        </div>

                        {/* ==================================================
                            ASSIGNED TO
                        ================================================== */}

                        <div className="border-app bg-app flex items-center justify-between gap-3 rounded-md border px-3 py-2">
                            <div className="flex items-center gap-2">
                                <UserCheck size={13} className="opacity-40" />

                                <span className="text-[11px] opacity-60">Assigned To</span>
                            </div>

                            <span className="max-w-[55%] truncate text-right text-[11px] font-medium">{task?.assignedTo?.name || '-'}</span>
                        </div>
                    </div>

                    {/* ==================================================
                        VIEW / EDIT
                    ================================================== */}

                    <button
                        type="button"
                        onClick={handleEdit}
                        className="mt-2.5 w-full rounded-md bg-blue-600 px-3 py-2 text-[11px] font-medium text-white transition hover:bg-blue-700"
                    >
                        View / Edit Task
                    </button>
                </div>
            )}
        </div>
    );
}
