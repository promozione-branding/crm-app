// src/app/call-logs/CallLog.jsx

'use client';

import React from 'react';
import { PhoneOff } from 'lucide-react';
import Dashboarddata from '../../app/dashboard/components/Dashboarddata';

export default function CallLog() {
    return (
        <div
            className="
                bg-surface
                text-app
                min-h-[calc(100vh-64px)]
                p-3
                sm:p-4
                md:p-6
            "
        >
            {/* ==================================================
                HEADER
            ================================================== */}

            <div className="mb-4 sm:mb-5 md:mb-6">
                {/* ==================================================
                    ROW 1 — STATS
                ================================================== */}

                <div
                    className="
                        w-full
                        rounded-xl
                        sm:rounded-2xl
                        border
                        border-app
                        bg-app
                        shadow-sm
                        px-2
                        py-2
                        sm:px-4
                        sm:py-3
                        overflow-hidden
                    "
                >
                    <Dashboarddata />
                </div>
            </div>

            {/* ==================================================
                EMPTY STATE
            ================================================== */}

            <div
                className="
                    w-full
                    bg-app
                    border
                    border-app
                    rounded-xl
                    sm:rounded-2xl
                    min-h-[calc(100vh-190px)]
                    sm:min-h-[400px]
                    flex
                    items-center
                    justify-center
                    px-4
                    py-10
                    sm:px-6
                    sm:py-12
                "
            >
                <div
                    className="
                        text-center
                        w-full
                        max-w-md
                    "
                >
                    {/* ==================================================
                        ICON
                    ================================================== */}

                    <div
                        className="
                            mx-auto
                            mb-4
                            sm:mb-6
                            flex
                            h-16
                            w-16
                            sm:h-20
                            sm:w-20
                            items-center
                            justify-center
                            rounded-full
                            bg-green-500/10
                        "
                    >
                        <PhoneOff size={32} className="text-green-500 sm:hidden" />

                        <PhoneOff size={40} className="text-green-500 hidden sm:block" />
                    </div>

                    {/* ==================================================
                        TITLE
                    ================================================== */}

                    <h2
                        className="
                            text-lg
                            sm:text-xl
                            font-semibold
                            mb-2
                        "
                    >
                        No Call Logs Found
                    </h2>

                    {/* ==================================================
                        DESCRIPTION
                    ================================================== */}

                    <p
                        className="
                            text-xs
                            sm:text-sm
                            opacity-70
                            leading-5
                            sm:leading-6
                            mx-auto
                        "
                    >
                        Your call history is empty. Once calls are made or received through the CRM, they'll appear here for easy tracking and follow-up.
                    </p>

                    {/* ==================================================
                        REFRESH BUTTON
                    ================================================== */}

                    <button
                        type="button"
                        className="
                            mt-5
                            sm:mt-6
                            h-10
                            px-4
                            sm:px-5
                            rounded-xl
                            bg-green-600
                            text-white
                            text-sm
                            font-medium
                            shadow-sm
                            transition-all
                            hover:bg-green-700
                            hover:-translate-y-0.5
                            hover:shadow-md
                        "
                    >
                        Refresh
                    </button>
                </div>
            </div>
        </div>
    );
}
