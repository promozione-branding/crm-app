// src/app/tasks/edit/[id]/components/TaskLeadInfo.jsx

'use client';

import React from 'react';
import { UserRound } from 'lucide-react';

export default function TaskLeadInfo({ task }) {
    return (
        <div className="border-app mt-6 border-t pt-6">
            {/* Header */}

            <div className="mb-4 flex items-center gap-2">
                <UserRound size={17} className="opacity-70" />

                <h2 className="text-sm font-semibold">Related Lead</h2>
            </div>

            {/* Lead information */}

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {/* Name */}

                <div className="bg-surface border-app rounded-lg border p-3">
                    <p className="mb-1 text-[11px] opacity-50 sm:text-xs">Lead Name</p>

                    <p className="text-sm font-medium break-words">{task?.leadId?.name || '—'}</p>
                </div>

                {/* Phone */}

                <div className="bg-surface border-app rounded-lg border p-3">
                    <p className="mb-1 text-[11px] opacity-50 sm:text-xs">Phone</p>

                    <p className="text-sm font-medium break-words">{task?.leadId?.phone || '—'}</p>
                </div>

                {/* Email */}

                <div className="bg-surface border-app rounded-lg border p-3">
                    <p className="mb-1 text-[11px] opacity-50 sm:text-xs">Email</p>

                    <p className="text-sm font-medium break-all">{task?.leadId?.email || '—'}</p>
                </div>
            </div>
        </div>
    );
}
