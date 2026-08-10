"use client"
import React, { useEffect, useState } from 'react'

export default function Meta() {
    const [loading, setLoading] = useState(true);
    const [connected, setConnected] = useState(false);
    const [integration, setIntegration] = useState(null);

    const handleConnect = () => {
        window.location.href = "/api/user/meta/connect";
    };

    useEffect(() => {
        const checkStatus = async () => {
            try {
                const response = await fetch("/api/user/meta/status");
                const data = await response.json();

                if (data.success) {
                    setConnected(data.connected);
                    setIntegration(data.integration);
                }
            } catch (error) {
                console.error("Meta status error:", error);
            } finally {
                setLoading(false);
            }
        };

        checkStatus();
    }, []);

    return (
        <div className="space-y-5">
            <div>
                <h2 className="text-base font-semibold text-app">
                    Meta
                </h2>

                <p className="text-xs text-muted mt-1">
                    Connect your Meta accounts to manage Facebook leads and
                    conversations.
                </p>
            </div>

            <div className="max-w-xl">
                <div className="group bg-app border border-app rounded-2xl p-5 transition-all duration-200 hover:border-blue-500/40 hover:shadow-lg">
                    <div className="flex items-start justify-between gap-4">
                        <div className="flex items-center gap-3 min-w-0">
                            <div className=" w-12 h-12 rounded-xl border border-app bg-surface flex items-center justify-center shrink-0 overflow-hidden">
                                <img
                                    src={"/logos/facebook.png"}
                                    alt={`${name} logo`}
                                    className="w-8 h-8 object-contain"
                                />
                            </div>

                            <div className="min-w-0">
                                <h3 className="font-semibold text-app text-sm">
                                    Facebook
                                </h3>

                                <div className="flex items-center gap-1.5 mt-1">
                                    <span className={`w-1.5 h-1.5 rounded-full ${connected ? "bg-emerald-500" : "bg-blue-500"}`} />

                                    <span className="text-[11px] text-muted">
                                        {loading ? "Checking..." : connected ? "Connected" : "Available"}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <p className="text-xs text-muted leading-5 mt-4 min-h-[40px]">
                        Connect Facebook to receive leads and messages from your business pages.
                    </p>

                    {!loading && (
                        <button onClick={handleConnect}
                            className={`w-full cursor-pointer mt-5 h-9 rounded-lg text-white text-xs font-medium transition-colors ${connected
                                ? "bg-gray-600 hover:bg-gray-700"
                                : "bg-blue-600 hover:bg-blue-700"
                                }`}
                        >
                            {connected ? "Reconnect" : "Connect"}
                        </button>
                    )}
                </div>
            </div>
        </div>
    )
}
