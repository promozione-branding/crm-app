"use client";

import React from "react";
import { Search, Filter, Plus } from "lucide-react";

export default function SearchAndFilterTask({
    search,
    setSearch,

    relatedTo,
    setRelatedTo,

    assignedTo,
    setAssignedTo,

    priority,
    setPriority,

    onAddTask,
}) {
    return (
        <div
            className="
                flex
                flex-wrap
                items-center
                gap-2
                sm:gap-3
            "
        >
            {/* ==================================================
                ADD TASK
            ================================================== */}

            <button
                type="button"
                onClick={onAddTask}
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

            {/* ==================================================
                PRIORITY FILTER
            ================================================== */}

            <div className="relative">
                <Filter
                    size={15}
                    className="
                        pointer-events-none
                        absolute
                        left-3
                        top-1/2
                        -translate-y-1/2
                        opacity-60
                    "
                />

                <select
                    value={priority}
                    onChange={(e) => {
                        setPriority(e.target.value);
                    }}
                    className="
                        h-9
                        appearance-none
                        rounded-lg
                        border
                        border-app
                        bg-app
                        pl-9
                        pr-8
                        text-sm
                        outline-none
                        focus:ring-2
                        focus:ring-blue-500
                    "
                >
                    <option value="">
                        All Priorities
                    </option>

                    <option value="low">
                        Low
                    </option>

                    <option value="medium">
                        Medium
                    </option>

                    <option value="high">
                        High
                    </option>

                    <option value="urgent">
                        Urgent
                    </option>
                </select>
            </div>

            {/* ==================================================
                TASK SEARCH
            ================================================== */}

            <div
                className="
                    relative
                    w-full
                    sm:w-52
                "
            >
                <Search
                    size={16}
                    className="
                        pointer-events-none
                        absolute
                        left-3
                        top-1/2
                        -translate-y-1/2
                        opacity-60
                    "
                />

                <input
                    type="text"
                    value={search}
                    onChange={(e) => {
                        setSearch(e.target.value);
                    }}
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

            {/* ==================================================
                RELATED LEAD SEARCH
            ================================================== */}

            <div
                className="
                    relative
                    w-full
                    sm:w-52
                "
            >
                <Search
                    size={16}
                    className="
                        pointer-events-none
                        absolute
                        left-3
                        top-1/2
                        -translate-y-1/2
                        opacity-60
                    "
                />

                <input
                    type="text"
                    value={relatedTo}
                    onChange={(e) => {
                        setRelatedTo(e.target.value);
                    }}
                    placeholder="Search related lead..."
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

            {/* ==================================================
                ASSIGNED USER SEARCH
            ================================================== */}

            <div
                className="
                    relative
                    w-full
                    sm:w-52
                "
            >
                <Search
                    size={16}
                    className="
                        pointer-events-none
                        absolute
                        left-3
                        top-1/2
                        -translate-y-1/2
                        opacity-60
                    "
                />

                <input
                    type="text"
                    value={assignedTo}
                    onChange={(e) => {
                        setAssignedTo(e.target.value);
                    }}
                    placeholder="Search assigned to..."
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
    );
}