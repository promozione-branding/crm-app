"use client";
import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import toast from "react-hot-toast";

export default function Google() {
    const [loading, setLoading] = useState(false);
    const [accountsLoading, setAccountsLoading] = useState(false);
    const [accounts, setAccounts] = useState([]);
    const [connected, setConnected] = useState(false);

    const fetchAccounts = useCallback(async () => {
        try {
            setAccountsLoading(true);

            const response = await axios.get(
                "/api/user/google/accounts/details",
                {
                    withCredentials: true,
                }
            );

            console.log("Google Accounts:", response.data);

            if (response.data?.success) {
                setAccounts(response.data.data || []);
                setConnected(true);
            } else {
                setAccounts([]);
                setConnected(false);
            }
        } catch (error) {
            console.error(
                "Google accounts error:",
                error
            );

            const status = error?.response?.status;

            if (status === 404) {
                // Google Ads isn't connected
                setConnected(false);
                setAccounts([]);
            } else {
                const message =
                    error?.response?.data?.message ||
                    "Failed to fetch Google Ads accounts";

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
        const params = new URLSearchParams(
            window.location.search
        );

        const googleStatus =
            params.get("google");

        // OAuth successfully completed
        if (googleStatus === "connected") {
            toast.success(
                "Google Ads connected successfully"
            );

            // Remove ?google=connected
            window.history.replaceState(
                {},
                "",
                window.location.pathname
            );
        }

        // Always check Google Ads connection
        fetchAccounts();
    }, [fetchAccounts]);

    // -----------------------------------------
    // Connect Google
    // -----------------------------------------
    const handleConnect = () => {
        setLoading(true);

        window.location.href =
            "/api/user/google/connect";
    };

    return (
        <div className="space-y-5">
            <div>
                <h2 className="text-base font-semibold text-app">
                    Google Ads
                </h2>

                <p className="text-xs text-muted mt-1">
                    Connect Google Ads to view campaign
                    performance and analytics.
                </p>
            </div>

            {/* Google Card */}
            <div className="max-w-xl">
                <div className="group bg-app border border-app rounded-2xl p-5 transition-all duration-200 hover:border-blue-500/40 hover:shadow-lg">
                    {/* Header */}
                    <div className="flex items-start justify-between gap-4">
                        <div className="flex items-center gap-3 min-w-0">
                            <div className="w-12 h-12 rounded-xl border border-app bg-surface flex items-center justify-center shrink-0 overflow-hidden">
                                <img
                                    src="/logos/google.png"
                                    alt="Google logo"
                                    className="w-8 h-8 object-contain"
                                />
                            </div>

                            <div className="min-w-0">
                                <h3 className="font-semibold text-app text-sm">
                                    Google Ads
                                </h3>

                                <div className="flex items-center gap-1.5 mt-1">
                                    <span
                                        className={`w-1.5 h-1.5 rounded-full ${connected
                                            ? "bg-green-500"
                                            : "bg-blue-500"
                                            }`}
                                    />

                                    <span className="text-[11px] text-muted">
                                        {connected ? "Connected" : "Available"}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Description */}
                    <p className="text-xs text-muted leading-5 mt-4">
                        Connect Google Ads to view campaign
                        performance, clicks, impressions,
                        spend, conversions, and analytics.
                    </p>

                    {/* Connect Button */}
                    {!connected && (
                        <button onClick={handleConnect} disabled={loading}
                            className="w-full mt-5 h-9 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs font-medium transition-colors"
                        >
                            {loading ? "Connecting..." : "Connect"}
                        </button>
                    )}

                    {/* Accounts */}
                    {connected && (
                        <div className="mt-5">
                            <div className="flex items-center justify-between mb-3">
                                <h4 className="text-xs font-semibold text-app">
                                    Google Ads Accounts
                                </h4>

                                <button onClick={fetchAccounts} disabled={accountsLoading}
                                    className="text-[11px] text-blue-500 hover:text-blue-600"
                                >
                                    {accountsLoading ? "Loading..." : "Refresh"}
                                </button>
                            </div>

                            {accountsLoading ? (
                                <div className="border border-app rounded-xl p-4 text-center">
                                    <p className="text-xs text-muted">
                                        Loading Google Ads accounts...
                                    </p>
                                </div>
                            ) : accounts.length === 0 ? (
                                <div className="border border-app rounded-xl p-4">
                                    <p className="text-xs text-muted">
                                        No Google Ads accounts found.
                                    </p>
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    {accounts.map((account) => (
                                        <div key={account.customerId}
                                            className="border border-app rounded-xl p-3 flex items-center justify-between gap-3"
                                        >
                                            <div className="min-w-0">
                                                <p className="text-xs font-medium text-app truncate">
                                                    {account.name || "Unnamed Account"}
                                                </p>

                                                <p className="text-[10px] text-muted mt-1">
                                                    Customer ID:{" "}
                                                    {account.customerId}
                                                </p>

                                                <p className="text-[10px] text-muted">
                                                    {account.currency} •{" "}
                                                    {account.timezone}
                                                </p>
                                            </div>

                                            <button
                                                className="shrink-0 px-3 h-8 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-medium"
                                            >
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