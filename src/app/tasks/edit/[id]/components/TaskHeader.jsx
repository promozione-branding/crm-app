// src/app/tasks/edit/[id]/components/TaskHeader.jsx

'use client';

import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function TaskHeader() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const returnTo = searchParams.get('returnTo');

    const handleBack = () => {
        if (returnTo) {
            router.push(returnTo);
        } else {
            router.push('/tasks');
        }
    };

    return (
        <div className="mb-6 flex items-center gap-3">
            {/* Back Button */}

            <button
                type="button"
                onClick={handleBack}
                aria-label="Go back"
                className="bg-app border-app flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border transition hover:opacity-80 active:scale-95 sm:h-10 sm:w-10"
            >
                <ArrowLeft size={18} className="sm:h-5 sm:w-5" />
            </button>

            {/* Heading */}

            <div className="min-w-0">
                <h1 className="truncate text-base font-bold sm:text-lg">Edit Task</h1>

                <p className="text-xs opacity-70 sm:text-sm">Update task details</p>
            </div>
        </div>
    );
}
