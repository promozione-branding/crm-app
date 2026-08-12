"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";

export default function Meta() {
    const [loading, setLoading] = useState(true);
    const [connected, setConnected] = useState(false);

    const [integration, setIntegration] = useState(null);

    const [pages, setPages] = useState([]);
    const [adAccounts, setAdAccounts] = useState([]);

    const [loadingAssets, setLoadingAssets] = useState(false);
    const [selectingAssets, setSelectingAssets] = useState(false);

    const handleConnect = () => {
        window.location.href = "/api/user/meta/connect";
    };

    // --------------------------------------------------
    // Check Meta status
    // --------------------------------------------------

    const checkStatus = async () => {
        try {
            setLoading(true);

            const { data } = await axios.get(
                "/api/user/meta/status",
                {
                    withCredentials: true,
                }
            );

            if (data.success) {
                setConnected(data.connected);
                setIntegration(data.integration);
            }
        } catch (error) {
            console.error(
                "Meta status error:",
                error
            );
        } finally {
            setLoading(false);
        }
    };

    // --------------------------------------------------
    // Fetch Meta Pages + Ad Accounts
    // --------------------------------------------------

    const fetchAssets = async () => {
        try {
            setLoadingAssets(true);

            const { data } = await axios.get(
                "/api/user/meta/assets",
                {
                    withCredentials: true,
                }
            );

            if (!data.success) {
                throw new Error(
                    data.message ||
                    "Failed to fetch Meta assets"
                );
            }

            const metaPages =
                data.assets?.pages || [];

            const metaAdAccounts =
                data.assets?.adAccounts || [];

            console.log(
                "META PAGES:",
                metaPages
            );

            console.log(
                "META AD ACCOUNTS:",
                metaAdAccounts
            );

            setPages(metaPages);
            setAdAccounts(metaAdAccounts);

        } catch (error) {
            console.error(
                "Fetch Meta assets error:",
                error
            );
        } finally {
            setLoadingAssets(false);
        }
    };

    // --------------------------------------------------
    // Select Page + Ad Account
    // --------------------------------------------------

    const handleSelectAssets = async (
        pageId,
        adAccountId = null
    ) => {
        try {
            setSelectingAssets(true);

            const { data } = await axios.post(
                "/api/user/meta/assets/select",
                {
                    pageId,
                    adAccountId,
                },
                {
                    withCredentials: true,
                }
            );

            if (!data.success) {
                throw new Error(
                    data.message ||
                    "Failed to connect Meta assets"
                );
            }

            console.log(
                "META ASSETS CONNECTED:",
                data
            );

            await checkStatus();

        } catch (error) {
            console.error(
                "Select Meta assets error:",
                error
            );
        } finally {
            setSelectingAssets(false);
        }
    };

    // --------------------------------------------------
    // Initial status
    // --------------------------------------------------

    useEffect(() => {
        checkStatus();
    }, []);

    // --------------------------------------------------
    // Fetch assets after Meta connection
    // --------------------------------------------------

    useEffect(() => {
        if (
            connected &&
            !integration?.metadata?.pageId
        ) {
            fetchAssets();
        }
    }, [
        connected,
        integration,
    ]);

    // --------------------------------------------------
    // Loading
    // --------------------------------------------------

    if (loading) {
        return (
            <div className="space-y-5">
                <div>
                    <h2 className="text-base font-semibold text-app">
                        Meta
                    </h2>

                    <p className="text-xs text-muted mt-1">
                        Checking Meta connection...
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-5">

            {/* Header */}

            <div>
                <h2 className="text-base font-semibold text-app">
                    Meta
                </h2>

                <p className="text-xs text-muted mt-1">
                    Connect your Meta accounts to manage
                    Facebook leads and conversations.
                </p>
            </div>

            {/* Meta Card */}

            <div className="max-w-xl">

                <div className="group bg-app border border-app rounded-2xl p-5 transition-all duration-200 hover:border-blue-500/40 hover:shadow-lg">

                    {/* Header */}

                    <div className="flex items-start justify-between gap-4">

                        <div className="flex items-center gap-3 min-w-0">

                            <div className="w-12 h-12 rounded-xl border border-app bg-surface flex items-center justify-center shrink-0 overflow-hidden">

                                <img
                                    src="/logos/facebook.png"
                                    alt="Facebook logo"
                                    className="w-8 h-8 object-contain"
                                />

                            </div>

                            <div className="min-w-0">

                                <h3 className="font-semibold text-app text-sm">
                                    Facebook
                                </h3>

                                <div className="flex items-center gap-1.5 mt-1">

                                    <span
                                        className={`w-1.5 h-1.5 rounded-full ${connected
                                                ? "bg-emerald-500"
                                                : "bg-blue-500"
                                            }`}
                                    />

                                    <span className="text-[11px] text-muted">
                                        {connected
                                            ? "Connected"
                                            : "Available"}
                                    </span>

                                </div>

                            </div>

                        </div>

                    </div>

                    {/* Description */}

                    <p className="text-xs text-muted leading-5 mt-4">

                        Connect Facebook to receive leads
                        from your business pages.

                    </p>

                    {/* Not Connected */}

                    {!connected && (

                        <button
                            onClick={handleConnect}
                            className="w-full cursor-pointer mt-5 h-9 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium transition-colors"
                        >
                            Connect Facebook
                        </button>

                    )}

                    {/* Connected */}

                    {connected && (

                        <div className="mt-5 space-y-3">

                            {/* -------------------------------- */}
                            {/* Selected Page */}
                            {/* -------------------------------- */}

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

                                            <p className="text-[10px] text-muted mt-1">
                                                Page ID:{" "}
                                                {
                                                    integration
                                                        ?.metadata
                                                        ?.pageId
                                                }
                                            </p>

                                        </div>

                                        <span className="text-[10px] px-2 py-1 rounded-full bg-emerald-500/10 text-emerald-500">
                                            Active
                                        </span>

                                    </div>

                                </div>

                            ) : (

                                <div className="space-y-3">

                                    {/* Loading */}

                                    {loadingAssets && (

                                        <div className="text-xs text-muted">
                                            Loading Facebook Pages and Ad Accounts...
                                        </div>

                                    )}

                                    {/* Page Selection */}

                                    {!loadingAssets &&
                                        pages.length > 0 && (

                                            <div className="space-y-2">

                                                <p className="text-xs font-medium text-app">
                                                    Select Facebook Page
                                                </p>

                                                {pages.map(
                                                    (page) => (

                                                        <button
                                                            key={page.id}
                                                            disabled={
                                                                selectingAssets
                                                            }
                                                            onClick={() =>
                                                                handleSelectAssets(
                                                                    page.id,
                                                                    adAccounts?.[0]?.id ||
                                                                    null
                                                                )
                                                            }
                                                            className="w-full flex items-center justify-between border border-app rounded-lg p-3 hover:border-blue-500/50 transition-colors text-left disabled:opacity-50"
                                                        >

                                                            <div>

                                                                <p className="text-sm font-medium text-app">
                                                                    {
                                                                        page.name
                                                                    }
                                                                </p>

                                                                <p className="text-[10px] text-muted mt-1">
                                                                    {
                                                                        page.id
                                                                    }
                                                                </p>

                                                            </div>

                                                            <span className="text-xs text-blue-500">
                                                                Select
                                                            </span>

                                                        </button>

                                                    )
                                                )}

                                            </div>

                                        )}

                                    {/* No Pages */}

                                    {!loadingAssets &&
                                        pages.length === 0 && (

                                            <div className="border border-red-500/20 bg-red-500/5 rounded-lg p-3">

                                                <p className="text-xs text-red-500">
                                                    No Facebook Pages found.
                                                </p>

                                            </div>

                                        )}

                                </div>

                            )}

                            {/* -------------------------------- */}
                            {/* Ad Account */}
                            {/* -------------------------------- */}

                            {integration?.metadata?.adAccountId && (

                                <div className="border border-app rounded-lg p-3">

                                    <p className="text-xs text-muted">
                                        Connected Ad Account
                                    </p>

                                    <p className="text-sm font-medium text-app mt-1">
                                        {
                                            integration
                                                ?.metadata
                                                ?.adAccountName ||
                                            integration
                                                ?.metadata
                                                ?.adAccountId
                                        }
                                    </p>

                                </div>

                            )}

                            {/* -------------------------------- */}
                            {/* Lead Webhook Status */}
                            {/* -------------------------------- */}

                            {integration?.metadata?.leadgenSubscribed && (

                                <div className="border border-emerald-500/20 bg-emerald-500/5 rounded-lg p-3">

                                    <div className="flex items-center justify-between">

                                        <div>

                                            <p className="text-xs text-muted">
                                                Facebook Lead Webhook
                                            </p>

                                            <p className="text-sm font-medium text-emerald-500 mt-1">
                                                Lead capture enabled
                                            </p>

                                        </div>

                                        <span className="text-[10px] px-2 py-1 rounded-full bg-emerald-500/10 text-emerald-500">
                                            Active
                                        </span>

                                    </div>

                                </div>

                            )}

                            {/* -------------------------------- */}
                            {/* Reconnect */}
                            {/* -------------------------------- */}

                            <button
                                onClick={handleConnect}
                                className="w-full cursor-pointer h-9 rounded-lg bg-gray-600 hover:bg-gray-700 text-white text-xs font-medium transition-colors"
                            >
                                Reconnect
                            </button>

                        </div>

                    )}

                </div>

            </div>

        </div>
    );
}