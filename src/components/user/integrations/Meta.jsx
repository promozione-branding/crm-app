// src/components/user/integrations/Meta.jsx

'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function Meta() {
    const [loading, setLoading] = useState(true);
    const [connected, setConnected] = useState(false);

    const [integration, setIntegration] = useState(null);

    const [pages, setPages] = useState([]);
    const [adAccounts, setAdAccounts] = useState([]);

    const [loadingAssets, setLoadingAssets] = useState(false);
    const [selectingAssets, setSelectingAssets] = useState(false);

    const handleConnect = () => {
        window.location.href = '/api/user/meta/connect';
    };

    // --------------------------------------------------
    // Check Meta status
    // --------------------------------------------------

    const checkStatus = async () => {
        try {
            setLoading(true);

            const { data } = await axios.get('/api/user/meta/status', {
                withCredentials: true,
            });

            if (data.success) {
                setConnected(data.connected);
                setIntegration(data.integration);
            }
        } catch (error) {
            console.error('Meta status error:', error);
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

            const { data } = await axios.get('/api/user/meta/assets', {
                withCredentials: true,
            });

            if (!data.success) {
                throw new Error(data.message || 'Failed to fetch Meta assets');
            }

            const metaPages = data.assets?.pages || [];

            const metaAdAccounts = data.assets?.adAccounts || [];

            console.log('META PAGES:', metaPages);

            console.log('META AD ACCOUNTS:', metaAdAccounts);

            setPages(metaPages);
            setAdAccounts(metaAdAccounts);
        } catch (error) {
            console.error('Fetch Meta assets error:', error);
        } finally {
            setLoadingAssets(false);
        }
    };

    // --------------------------------------------------
    // Select Page + Ad Account
    // --------------------------------------------------

    const handleSelectAssets = async (pageId, adAccountId = null) => {
        try {
            setSelectingAssets(true);

            const { data } = await axios.post(
                '/api/user/meta/assets/select',
                {
                    pageId,
                    adAccountId,
                },
                {
                    withCredentials: true,
                }
            );

            if (!data.success) {
                throw new Error(data.message || 'Failed to connect Meta assets');
            }

            console.log('META ASSETS CONNECTED:', data);

            await checkStatus();
        } catch (error) {
            console.error('Select Meta assets error:', error);
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
        if (connected && !integration?.metadata?.pageId) {
            fetchAssets();
        }
    }, [connected, integration]);

    // --------------------------------------------------
    // Loading
    // --------------------------------------------------

    if (loading) {
        return (
            <div className="space-y-5">
                <div>
                    <h2 className="text-app text-base font-semibold">Meta</h2>

                    <p className="text-muted mt-1 text-xs">Checking Meta connection...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-5">
            {/* Header */}

            <div>
                <h2 className="text-app text-base font-semibold">Meta</h2>

                <p className="text-muted mt-1 text-xs">Connect your Meta accounts to manage Facebook leads and conversations.</p>
            </div>

            {/* Meta Card */}

            <div className="max-w-xl">
                <div className="group bg-app border-app rounded-2xl border p-5 transition-all duration-200 hover:border-blue-500/40 hover:shadow-lg">
                    {/* Header */}

                    <div className="flex items-start justify-between gap-4">
                        <div className="flex min-w-0 items-center gap-3">
                            <div className="border-app bg-surface flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl border">
                                <img src="/logos/facebook.png" alt="Facebook logo" className="h-8 w-8 object-contain" />
                            </div>

                            <div className="min-w-0">
                                <h3 className="text-app text-sm font-semibold">Facebook</h3>

                                <div className="mt-1 flex items-center gap-1.5">
                                    <span className={`h-1.5 w-1.5 rounded-full ${connected ? 'bg-emerald-500' : 'bg-blue-500'}`} />

                                    <span className="text-muted text-[11px]">{connected ? 'Connected' : 'Available'}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Description */}

                    <p className="text-muted mt-4 text-xs leading-5">Connect Facebook to receive leads from your business pages.</p>

                    {/* Not Connected */}

                    {!connected && (
                        <button
                            onClick={handleConnect}
                            className="mt-5 h-9 w-full cursor-pointer rounded-lg bg-blue-600 text-xs font-medium text-white transition-colors hover:bg-blue-700"
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
                                <div className="border-app rounded-lg border p-3">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-muted text-xs">Connected Page</p>

                                            <p className="text-app mt-1 text-sm font-medium">{integration?.metadata?.pageName || 'Facebook Page'}</p>

                                            <p className="text-muted mt-1 text-[10px]">Page ID: {integration?.metadata?.pageId}</p>
                                        </div>

                                        <span className="rounded-full bg-emerald-500/10 px-2 py-1 text-[10px] text-emerald-500">Active</span>
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {/* Loading */}

                                    {loadingAssets && <div className="text-muted text-xs">Loading Facebook Pages and Ad Accounts...</div>}

                                    {/* Page Selection */}

                                    {!loadingAssets && pages.length > 0 && (
                                        <div className="space-y-2">
                                            <p className="text-app text-xs font-medium">Select Facebook Page</p>

                                            {pages.map((page) => (
                                                <button
                                                    key={page.id}
                                                    disabled={selectingAssets}
                                                    onClick={() => handleSelectAssets(page.id, adAccounts?.[0]?.id || null)}
                                                    className="border-app flex w-full items-center justify-between rounded-lg border p-3 text-left transition-colors hover:border-blue-500/50 disabled:opacity-50"
                                                >
                                                    <div>
                                                        <p className="text-app text-sm font-medium">{page.name}</p>

                                                        <p className="text-muted mt-1 text-[10px]">{page.id}</p>
                                                    </div>

                                                    <span className="text-xs text-blue-500">Select</span>
                                                </button>
                                            ))}
                                        </div>
                                    )}

                                    {/* No Pages */}

                                    {!loadingAssets && pages.length === 0 && (
                                        <div className="rounded-lg border border-red-500/20 bg-red-500/5 p-3">
                                            <p className="text-xs text-red-500">No Facebook Pages found.</p>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* -------------------------------- */}
                            {/* Ad Account */}
                            {/* -------------------------------- */}

                            {integration?.metadata?.adAccountId && (
                                <div className="border-app rounded-lg border p-3">
                                    <p className="text-muted text-xs">Connected Ad Account</p>

                                    <p className="text-app mt-1 text-sm font-medium">
                                        {integration?.metadata?.adAccountName || integration?.metadata?.adAccountId}
                                    </p>
                                </div>
                            )}

                            {/* -------------------------------- */}
                            {/* Lead Webhook Status */}
                            {/* -------------------------------- */}

                            {integration?.metadata?.leadgenSubscribed && (
                                <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-3">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-muted text-xs">Facebook Lead Webhook</p>

                                            <p className="mt-1 text-sm font-medium text-emerald-500">Lead capture enabled</p>
                                        </div>

                                        <span className="rounded-full bg-emerald-500/10 px-2 py-1 text-[10px] text-emerald-500">Active</span>
                                    </div>
                                </div>
                            )}

                            {/* -------------------------------- */}
                            {/* Reconnect */}
                            {/* -------------------------------- */}

                            <button
                                onClick={handleConnect}
                                className="h-9 w-full cursor-pointer rounded-lg bg-gray-600 text-xs font-medium text-white transition-colors hover:bg-gray-700"
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
