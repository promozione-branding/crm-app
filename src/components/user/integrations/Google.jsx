// src/components/user/integrations/Google.jsx

'use client';
import { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

export default function Google() {
    const [loading, setLoading] = useState(false);
    const [accountsLoading, setAccountsLoading] = useState(false);
    const [accounts, setAccounts] = useState([]);
    const [connected, setConnected] = useState(false);

    const fetchAccounts = useCallback(async () => {
        try {
            setAccountsLoading(true);

            const response = await axios.get('/api/user/google/accounts/details', {
                withCredentials: true,
            });

            console.log('Google Accounts:', response.data);

            if (response.data?.success) {
                setAccounts(response.data.data || []);
                setConnected(true);
            } else {
                setAccounts([]);
                setConnected(false);
            }
        } catch (error) {
            console.error('Google accounts error:', error);

            const status = error?.response?.status;

            if (status === 404) {
                // Google Ads isn't connected
                setConnected(false);
                setAccounts([]);
            } else {
                const message = error?.response?.data?.message || 'Failed to fetch Google Ads accounts';

                toast.error(message);
            }
        } finally {
            setAccountsLoading(false);
        }
    }, []);

    // -----------------------------------------
    // Page load
    // -----------------------------------------
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);

        const googleStatus = params.get('google');

        // OAuth successfully completed
        if (googleStatus === 'connected') {
            toast.success('Google Ads connected successfully');

            // Remove ?google=connected
            window.history.replaceState({}, '', window.location.pathname);
        }

        // Always check Google Ads connection
        fetchAccounts();
    }, [fetchAccounts]);

    // -----------------------------------------
    // Connect Google
    // -----------------------------------------
    const handleConnect = () => {
        setLoading(true);

        window.location.href = '/api/user/google/connect';
    };

    return (
        <div className="space-y-5">
            <div>
                <h2 className="text-app text-base font-semibold">Google Ads</h2>

                <p className="text-muted mt-1 text-xs">Connect Google Ads to view campaign performance and analytics.</p>
            </div>

            {/* Google Card */}
            <div className="max-w-xl">
                <div className="group bg-app border-app rounded-2xl border p-5 transition-all duration-200 hover:border-blue-500/40 hover:shadow-lg">
                    {/* Header */}
                    <div className="flex items-start justify-between gap-4">
                        <div className="flex min-w-0 items-center gap-3">
                            <div className="border-app bg-surface flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl border">
                                <img src="/logos/google.png" alt="Google logo" className="h-8 w-8 object-contain" />
                            </div>

                            <div className="min-w-0">
                                <h3 className="text-app text-sm font-semibold">Google Ads</h3>

                                <div className="mt-1 flex items-center gap-1.5">
                                    <span className={`h-1.5 w-1.5 rounded-full ${connected ? 'bg-green-500' : 'bg-blue-500'}`} />

                                    <span className="text-muted text-[11px]">{connected ? 'Connected' : 'Available'}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Description */}
                    <p className="text-muted mt-4 text-xs leading-5">
                        Connect Google Ads to view campaign performance, clicks, impressions, spend, conversions, and analytics.
                    </p>

                    {/* Connect Button */}
                    {!connected && (
                        <button
                            onClick={handleConnect}
                            disabled={loading}
                            className="mt-5 h-9 w-full rounded-lg bg-blue-600 text-xs font-medium text-white transition-colors hover:bg-blue-700 disabled:opacity-50"
                        >
                            {loading ? 'Connecting...' : 'Connect'}
                        </button>
                    )}

                    {/* Accounts */}
                    {connected && (
                        <div className="mt-5">
                            <div className="mb-3 flex items-center justify-between">
                                <h4 className="text-app text-xs font-semibold">Google Ads Accounts</h4>

                                <button onClick={fetchAccounts} disabled={accountsLoading} className="text-[11px] text-blue-500 hover:text-blue-600">
                                    {accountsLoading ? 'Loading...' : 'Refresh'}
                                </button>
                            </div>

                            {accountsLoading ? (
                                <div className="border-app rounded-xl border p-4 text-center">
                                    <p className="text-muted text-xs">Loading Google Ads accounts...</p>
                                </div>
                            ) : accounts.length === 0 ? (
                                <div className="border-app rounded-xl border p-4">
                                    <p className="text-muted text-xs">No Google Ads accounts found.</p>
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    {accounts.map((account) => (
                                        <div key={account.customerId} className="border-app flex items-center justify-between gap-3 rounded-xl border p-3">
                                            <div className="min-w-0">
                                                <p className="text-app truncate text-xs font-medium">{account.name || 'Unnamed Account'}</p>

                                                <p className="text-muted mt-1 text-[10px]">Customer ID: {account.customerId}</p>

                                                <p className="text-muted text-[10px]">
                                                    {account.currency} • {account.timezone}
                                                </p>
                                            </div>

                                            <button className="h-8 shrink-0 rounded-lg bg-blue-600 px-3 text-[11px] font-medium text-white hover:bg-blue-700">
                                                Select
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
