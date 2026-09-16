"use client";

import React from "react";
import { Search } from "lucide-react";

import TaskCard from "./TaskCard";

export default function TaskMobileList({
    tasks,
    loading,
    onAction,
}) {
    // ============================================================
    // LOADING
    // ============================================================

    if (loading) {
        return (
            <div className="space-y-2">
                {[1, 2, 3, 4, 5].map((item) => (
                    <div
                        key={item}
                        className="
                            h-14
                            w-full
                            animate-pulse
                            rounded-lg
                            border
                            border-app
                            bg-app
                        "
                    />
                ))}
            </div>
        );
    }

    // ============================================================
    // EMPTY
    // ============================================================

    if (!tasks?.length) {
        return (
            <div
                className="
                    w-full
                    rounded-lg
                    border
                    border-app
                    bg-app
                    px-4
                    py-8
                    text-center
                "
            >
                <div
                    className="
                        mx-auto
                        flex
                        h-9
                        w-9
                        items-center
                        justify-center
                        rounded-full
                        bg-surface
                    "
                >
                    <Search
                        size={16}
                        className="opacity-40"
                    />
                </div>

                <p className="mt-2 text-xs font-medium">
                    No tasks found
                </p>

                <p className="mt-1 text-[10px] opacity-50">
                    Try changing your search or filters.
                </p>
            </div>
        );
    }

    // ============================================================
    // LIST
    // ============================================================

    return (
        <div className="w-full space-y-2">
            {tasks.map((task) => (
                <TaskCard
                    key={task._id}
                    task={task}
                    onAction={onAction}
                />
            ))}
        </div>
    );
}