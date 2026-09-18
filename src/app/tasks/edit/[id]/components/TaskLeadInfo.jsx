// src/app/tasks/edit/[id]/components/TaskLeadInfo.jsx

'use client';

import React from 'react';
import { UserRound } from 'lucide-react';

export default function TaskLeadInfo({ task }) {
    return (
        <div
            className="
            mt-6
            pt-6
            border-t
            border-app
        "
        >
            {/* Header */}

            <div
                className="
                flex
                items-center
                gap-2
                mb-4
            "
            >
                <UserRound size={17} className="opacity-70" />

                <h2
                    className="
                    text-sm
                    font-semibold
                "
                >
                    Related Lead
                </h2>
            </div>

            {/* Lead information */}

            <div
                className="
                grid
                grid-cols-1
                sm:grid-cols-2
                lg:grid-cols-3
                gap-4
            "
            >
                {/* Name */}

                <div
                    className="
                    rounded-lg
                    bg-surface
                    border
                    border-app
                    p-3
                "
                >
                    <p
                        className="
                        text-[11px]
                        sm:text-xs
                        opacity-50
                        mb-1
                    "
                    >
                        Lead Name
                    </p>

                    <p
                        className="
                        text-sm
                        font-medium
                        break-words
                    "
                    >
                        {task?.leadId?.name || '—'}
                    </p>
                </div>

                {/* Phone */}

                <div
                    className="
                    rounded-lg
                    bg-surface
                    border
                    border-app
                    p-3
                "
                >
                    <p
                        className="
                        text-[11px]
                        sm:text-xs
                        opacity-50
                        mb-1
                    "
                    >
                        Phone
                    </p>

                    <p
                        className="
                        text-sm
                        font-medium
                        break-words
                    "
                    >
                        {task?.leadId?.phone || '—'}
                    </p>
                </div>

                {/* Email */}

                <div
                    className="
                    rounded-lg
                    bg-surface
                    border
                    border-app
                    p-3
                "
                >
                    <p
                        className="
                        text-[11px]
                        sm:text-xs
                        opacity-50
                        mb-1
                    "
                    >
                        Email
                    </p>

                    <p
                        className="
                        text-sm
                        font-medium
                        break-all
                    "
                    >
                        {task?.leadId?.email || '—'}
                    </p>
                </div>
            </div>
        </div>
    );
}
