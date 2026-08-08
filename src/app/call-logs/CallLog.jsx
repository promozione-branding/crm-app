"use client";

import React from "react";
import { PhoneOff } from "lucide-react";

export default function CallLog() {
    return (
        <div className="bg-surface text-app min-h-[calc(100vh-64px)] p-6">

            {/* Header */}
            <div className="mb-6">
                <h1 className="text-base font-bold">
                    CRM
                </h1>

                <p className="text-xs opacity-70">
                    Call History
                </p>
            </div>

            {/* Empty State */}
            <div className="bg-app border border-app rounded-2xl min-h-[400px] flex items-center justify-center">

                <div className="text-center max-w-md">

                    <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-500/10">
                        <PhoneOff
                            size={40}
                            className="text-green-500"
                        />
                    </div>

                    <h2 className="text-xl font-semibold mb-2">
                        No Call Logs Found
                    </h2>

                    <p className="text-xs opacity-70 leading-6">
                        Your call history is empty. Once calls are made or
                        received through the CRM, they'll appear here for easy
                        tracking and follow-up.
                    </p>

                    <button className="mt-6 h-10 px-5 rounded-xl bg-green-600 text-white hover:bg-green-700 transition">
                        Refresh
                    </button>

                </div>

            </div>

        </div>
    );
}