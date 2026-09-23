// src/app/tasks/components/TaskMobileList.jsx

'use client';

import React from 'react';
import { Search } from 'lucide-react';

import TaskCard from './TaskCard';

export default function TaskMobileList({ tasks, loading, onAction, page, rowsPerPage }) {
    // ============================================================
    // LOADING
    // ============================================================

    if (loading) {
        return (
            <div className="space-y-2">
                {[1, 2, 3, 4, 5].map((item) => (
                    <div key={item} className="border-app bg-app h-14 w-full animate-pulse rounded-lg border" />
                ))}
            </div>
        );
    }

    // ============================================================
    // EMPTY
    // ============================================================

    if (!tasks?.length) {
        return (
            <div className="border-app bg-app w-full rounded-lg border px-4 py-8 text-center">
                <div className="bg-surface mx-auto flex h-9 w-9 items-center justify-center rounded-full">
                    <Search size={16} className="opacity-40" />
                </div>

                <p className="mt-2 text-xs font-medium">No tasks found</p>

                <p className="mt-1 text-[10px] opacity-50">Try changing your search or filters.</p>
            </div>
        );
    }

    // ============================================================
    // TASK LIST
    // ============================================================

    return (
        <div className="w-full space-y-2">
            {tasks.map((task, index) => (
                <TaskCard key={task._id} task={task} onAction={onAction} sno={(page - 1) * rowsPerPage + index + 1} />
            ))}
        </div>
    );
}