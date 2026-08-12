"use client"
import React, { useEffect, useState } from 'react'
import axios from "axios";

export default function Meta() {
    const [loading, setLoading] = useState(true);
    const [connected, setConnected] = useState(false);
    const [integration, setIntegration] = useState(null);
    const [pages, setPages] = useState([]);
    const [loadingPages, setLoadingPages] = useState(false);
    const [selectingPage, setSelectingPage] = useState(false);

    const handleConnect = () => {
        window.location.href = "/api/user/meta/connect";
    };

    const checkStatus = async () => {
        try {
            const { data } = await axios.get("/api/user/meta/status");
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

    const fetchPages = async () => {
        try {
            setLoadingPages(true);
            const { data } = await axios.get("/api/user/meta/assets", { withCredentials: true, });
            if (!data.success) {
                throw new Error(data.message || "Failed to fetch pages");
            }
            const metaPages = data.assets?.pages || [];
            console.log(metaPages)
            setPages(metaPages);
            if (metaPages.length === 1 && !integration?.metadata?.pageId) {
                await handleSelectPage(metaPages[0].id);
            }
        } catch (error) {
            console.error("Fetch Meta pages error:", error);
        } finally {
            setLoadingPages(false);
        }
    };

    // Select Page
    const handleSelectPage = async (pageId) => {
        try {
            setSelectingPage(true);
            const { data } = await axios.post("/api/user/meta/assets/select", { pageId, }, { withCredentials: true, });
            if (!data.success) {
                throw new Error(data.message || "Failed to connect Page");
            }

            console.log("META PAGE CONNECTED:", data);
            await checkStatus();
        } catch (error) {
            console.error("Select Page error:", error);
        } finally {
            setSelectingPage(false);
        }
    };

    // Initial status
    useEffect(() => {
        checkStatus();
    }, []);

    // Fetch pages after connected
    useEffect(() => {
        if (connected && !integration?.metadata?.pageId) {
            fetchPages();
        }
    }, [connected, integration]);

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

                    {!loading && !connected && (
                        <button onClick={handleConnect}
                            className={`w-full cursor-pointer mt-5 h-9 rounded-lg text-white text-xs font-medium transition-colors ${connected
                                ? "bg-gray-600 hover:bg-gray-700"
                                : "bg-blue-600 hover:bg-blue-700"
                                }`}
                        >
                            {connected ? "Reconnect" : "Connect"}
                        </button>
                    )}

                    {!loading && connected && (
                        <div className="mt- space-y-3">
                            {/* Selected Page */}
                            {integration?.metadata?.pageId ? (
                                <div className="border border-app rounded-lg p-3">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-xs text-muted">
                                                Connected Page
                                            </p>

                                            <p className="text-sm font-medium text-app mt-1">

                                                {
                                                    integration
                                                        ?.metadata
                                                        ?.pageName ||
                                                    "Facebook Page"
                                                }

                                            </p>

                                        </div>
                                        <span className="text-[10px] px-2 py-1 rounded-full bg-emerald-500/10 text-emerald-500">
                                            Active
                                        </span>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    {/* Loading Pages */}
                                    {loadingPages && (
                                        <div className="text-xs text-muted">
                                            Loading Facebook Pages...
                                        </div>
                                    )}
                                    {/* Multiple Pages */}
                                    {!loadingPages && pages.length > 1 && (
                                        <div className="space-y-2">
                                            <p className="text-xs font-medium text-app">
                                                Select Facebook Page
                                            </p>

                                            {pages.map((page, idx) => (
                                                <button key={idx} disabled={selectingPage}
                                                    onClick={() => handleSelectPage(page.id)}
                                                    className="w-full flex items-center justify-between border border-app rounded-lg p-3 hover:border-blue-500/50 transition-colors text-left disabled:opacity-50"
                                                >
                                                    <div>
                                                        <p className="text-sm font-medium text-app">
                                                            {page.name}
                                                        </p>

                                                        <p className="text-[10px] text-muted mt-1">
                                                            {page.id}
                                                        </p>
                                                    </div>

                                                    <span className="text-xs text-blue-500">
                                                        Select
                                                    </span>
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </>
                            )}

                            {/* Reconnect */}
                            <button onClick={handleConnect}
                                className="w-full cursor-pointer h-9 rounded-lg bg-gray-600 hover:bg-gray-700 text-white text-xs font-medium transition-colors"
                            >
                                Reconnect
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
