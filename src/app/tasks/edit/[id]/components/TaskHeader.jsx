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
        <div
            className="
            flex
            items-center
            gap-3
            mb-6
        "
        >
            {/* Back Button */}

            <button
                type="button"
                onClick={handleBack}
                aria-label="Go back"
                className="
                    shrink-0
                    w-9
                    h-9
                    sm:w-10
                    sm:h-10
                    rounded-lg
                    flex
                    items-center
                    justify-center
                    bg-app
                    border
                    border-app
                    hover:opacity-80
                    active:scale-95
                    transition
                "
            >
                <ArrowLeft size={18} className="sm:w-5 sm:h-5" />
            </button>

            {/* Heading */}

            <div className="min-w-0">
                <h1
                    className="
                    text-base
                    sm:text-lg
                    font-bold
                    truncate
                "
                >
                    Edit Task
                </h1>

                <p
                    className="
                    text-xs
                    sm:text-sm
                    opacity-70
                "
                >
                    Update task details
                </p>
            </div>
        </div>
    );
}
