"use client";

import React from "react";

export function PriorityBadge({ priority }) {
    const config = {
        low: "bg-slate-500/10 text-slate-500",
        medium: "bg-blue-500/10 text-blue-500",
        high: "bg-orange-500/10 text-orange-500",
        urgent: "bg-red-500/10 text-red-500",
    };

    const value = priority?.toLowerCase();

    return (
        <span
            className={`
                inline-flex
                items-center
                rounded-full
                px-2
                py-0.5
                text-[10px]
                font-medium
                capitalize
                whitespace-nowrap
                ${config[value] || "bg-slate-500/10 text-slate-500"}
            `}
        >
            {priority || "-"}
        </span>
    );
}

export function StatusBadge({ status }) {
    const config = {
        pending: "bg-yellow-500/10 text-yellow-600",
        completed: "bg-green-500/10 text-green-600",
        cancelled: "bg-red-500/10 text-red-600",
    };

    const value = status?.toLowerCase();

    return (
        <span
            className={`
                inline-flex
                items-center
                rounded-full
                px-2
                py-0.5
                text-[10px]
                font-medium
                capitalize
                whitespace-nowrap
                ${config[value] || "bg-blue-500/10 text-blue-500"}
            `}
        >
            {status || "-"}
        </span>
    );
}