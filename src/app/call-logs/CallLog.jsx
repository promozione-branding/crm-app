// src/app/call-logs/CallLog.jsx

'use client';

import React from 'react';
import { PhoneOff } from 'lucide-react';
import Dashboarddata from '../../app/dashboard/components/Dashboarddata';

export default function CallLog() {
    return (
        <div className="bg-surface text-app min-h-[calc(100vh-64px)] p-3 sm:p-4 md:p-6">
            {/* ==================================================
                HEADER
            ================================================== */}

            <div className="mb-4 sm:mb-5 md:mb-6">
                {/* ==================================================
                    ROW 1 — STATS
                ================================================== */}

                <div className="border-app bg-app w-full overflow-hidden rounded-xl border px-2 py-2 shadow-sm sm:rounded-2xl sm:px-4 sm:py-3">
                    <Dashboarddata />
                </div>
            </div>

            {/* ==================================================
                EMPTY STATE
            ================================================== */}

            <div className="bg-app border-app flex min-h-[calc(100vh-190px)] w-full items-center justify-center rounded-xl border px-4 py-10 sm:min-h-[400px] sm:rounded-2xl sm:px-6 sm:py-12">
                <div className="w-full max-w-md text-center">
                    {/* ==================================================
                        ICON
                    ================================================== */}

                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-500/10 sm:mb-6 sm:h-20 sm:w-20">
                        <PhoneOff size={32} className="text-green-500 sm:hidden" />

                        <PhoneOff size={40} className="hidden text-green-500 sm:block" />
                    </div>

                    {/* ==================================================
                        TITLE
                    ================================================== */}

                    <h2 className="mb-2 text-lg font-semibold sm:text-xl">No Call Logs Found</h2>

                    {/* ==================================================
                        DESCRIPTION
                    ================================================== */}

                    <p className="mx-auto text-xs leading-5 opacity-70 sm:text-sm sm:leading-6">
                        Your call history is empty. Once calls are made or received through the CRM, they'll appear here for easy tracking and follow-up.
                    </p>

                    {/* ==================================================
                        REFRESH BUTTON
                    ================================================== */}

                    <button
                        type="button"
                        className="mt-5 h-10 rounded-xl bg-green-600 px-4 text-sm font-medium text-white shadow-sm transition-all hover:-translate-y-0.5 hover:bg-green-700 hover:shadow-md sm:mt-6 sm:px-5"
                    >
                        Refresh
                    </button>
                </div>
            </div>
        </div>
    );
}
