// src/components/user/integrations/WebsiteIntegration.jsx

"use client";

import { useEffect, useState } from "react";
import {
    CheckCircle2,
    XCircle,
    Loader2,
    Copy,
    Check,
    Link2,
    RefreshCw,
    ArrowRight,
} from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";

export default function WebsiteIntegration({ integration: initialIntegration }) {
    const [integration, setIntegration] = useState(initialIntegration || null);
    const [loading, setLoading] = useState(!initialIntegration);
    const [connecting, setConnecting] = useState(false);
    const [syncing, setSyncing] = useState(false);
    const [copied, setCopied] = useState("");

    // Seller ID input (from BrandBnalo dashboard)
    const [sellerId, setSellerId] = useState("");

    const isConnected =
        integration?.provider === "website" &&
        integration?.status === "connected";

    // Our CRM's companyId — shown to the company as their "User ID"
    const userId = String(integration?.companyId || "");

    // The BrandBnalo sellerId mapped to this company
    const brandBnaloSellerId = String(
        integration?.metadata?.brandBnaloSellerId || ""
    );

    // Endpoint external systems can POST to (kept for display purposes)
    const endpoint =
        typeof window !== "undefined"
            ? `${window.location.origin}/api/leads/ingest`
            : "/api/leads/ingest";

    // ============================================================
    // LOAD STATUS
    // ============================================================

    useEffect(() => {
        if (initialIntegration) return;

        const loadIntegration = async () => {
            try {
                setLoading(true);
                const response = await axios.get("/api/website/status");

                if (response.data?.success) {
                    setIntegration(response.data.integration || null);
                }
            } catch (error) {
                console.error("Website integration status error:", error);
            } finally {
                setLoading(false);
            }
        };

        loadIntegration();
    }, [initialIntegration]);

    // ============================================================
    // CONNECT (requires sellerId from BrandBnalo)
    // ============================================================

    const handleConnect = async () => {
        const trimmed = sellerId.trim();

        if (!trimmed) {
            toast.error("Please enter your BrandBnalo Seller ID");
            return;
        }

        try {
            setConnecting(true);

            const response = await axios.post("/api/website/connect", {
                sellerId: trimmed,
            });

            if (!response.data?.success) {
                throw new Error(
                    response.data?.message || "Failed to connect website"
                );
            }

            setIntegration(response.data.integration);
            setSellerId("");
            toast.success("Website connected successfully");
        } catch (error) {
            console.error("Website connection error:", error);
            toast.error(
                error?.response?.data?.message ||
                    error?.message ||
                    "Failed to connect website"
            );
        } finally {
            setConnecting(false);
        }
    };

    // ============================================================
    // DISCONNECT
    // ============================================================

    const handleDisconnect = async () => {
        try {
            setConnecting(true);

            const response = await axios.post("/api/website/disconnect");

            if (!response.data?.success) {
                throw new Error(
                    response.data?.message || "Failed to disconnect website"
                );
            }

            setIntegration(response.data.integration || null);
            toast.success("Website disconnected");
        } catch (error) {
            console.error("Website disconnect error:", error);
            toast.error(
                error?.response?.data?.message ||
                    error?.message ||
                    "Failed to disconnect website"
            );
        } finally {
            setConnecting(false);
        }
    };

    // ============================================================
    // SYNC NOW (manual trigger)
    // ============================================================

    const handleSync = async () => {
        try {
            setSyncing(true);

            const response = await axios.post("/api/website/sync");

            if (!response.data?.success) {
                throw new Error(
                    response.data?.message || "Sync failed"
                );
            }

            const { imported = 0, skipped = 0, failed = 0 } =
                response.data || {};

            if (failed > 0) {
                toast.error(
                    `Synced with issues — imported ${imported}, skipped ${skipped}, failed ${failed}`
                );
            } else if (imported > 0) {
                toast.success(
                    `Imported ${imported} new lead${imported > 1 ? "s" : ""}`
                );
            } else {
                toast.success("No new leads to import");
            }

            // Refresh status to update lastSyncAt etc.
            const status = await axios.get("/api/website/status");
            if (status.data?.success) {
                setIntegration(status.data.integration || null);
            }
        } catch (error) {
            console.error("Website sync error:", error);
            toast.error(
                error?.response?.data?.message ||
                    error?.message ||
                    "Failed to sync website leads"
            );
        } finally {
            setSyncing(false);
        }
    };

    // ============================================================
    // COPY
    // ============================================================

    const copyText = async (text, type) => {
        try {
            await navigator.clipboard.writeText(text);
            setCopied(type);
            setTimeout(() => setCopied(""), 1500);
            toast.success("Copied");
        } catch {
            toast.error("Failed to copy");
        }
    };

    // ============================================================
    // SAMPLE PAYLOAD (informational)
    // ============================================================

    const payload = {
        userId: userId || "YOUR_CRM_USER_ID",
        platform: "Website Contact Page",
        platformEmail: "sales@example.com",
        name: "Arjun Patel",
        phone: "9898989898",
        email: "arjun.patel@client.in",
        product: "Social Media Management",
        place: "Mumbai, India",
        message: "We need help scaling our organic reach.",
    };

    // ============================================================
    // LOADING
    // ============================================================

    if (loading) {
        return (
            <div className="bg-app border-app flex items-center justify-center rounded-2xl border p-8">
                <Loader2 size={18} className="animate-spin text-blue-600" />
                <span className="text-muted ml-2 text-sm">Loading…</span>
            </div>
        );
    }

    // ============================================================
    // UI
    // ============================================================

    return (
        <div className="bg-app border-app overflow-hidden rounded-2xl border">
            {/* HEADER */}
            <div className="border-app flex items-center justify-between border-b px-5 py-4">
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10">
                        <Link2 size={19} className="text-blue-600" />
                    </div>
                    <div>
                        <h3 className="text-app text-sm font-semibold">
                            Website Lead Connection
                        </h3>
                        <p className="text-muted mt-0.5 text-xs">
                            Sync leads from your BrandBnalo website forms
                        </p>
                    </div>
                </div>

                <div
                    className={`flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-xs font-medium ${
                        isConnected
                            ? "bg-green-500/10 text-green-600"
                            : "bg-gray-500/10 text-gray-600"
                    }`}
                >
                    {isConnected ? (
                        <>
                            <CheckCircle2 size={14} />
                            Active
                        </>
                    ) : (
                        <>
                            <XCircle size={14} />
                            Inactive
                        </>
                    )}
                </div>
            </div>

            {/* ==============================================
                NOT CONNECTED
            ============================================== */}
            {!isConnected && (
                <div className="space-y-4 p-5">
                    <div className="border-app bg-surface rounded-xl border p-5">
                        <div className="flex items-start gap-3">
                            <div className="border-app bg-app flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border">
                                <Link2 size={16} className="text-blue-600" />
                            </div>
                            <div>
                                <h4 className="text-app text-sm font-semibold">
                                    Connect your BrandBnalo website
                                </h4>
                                <p className="text-muted mt-1 text-xs leading-5">
                                    Paste the Seller ID from your BrandBnalo
                                    dashboard. Once connected, your website
                                    form submissions will sync into this CRM
                                    automatically every minute.
                                </p>
                            </div>
                        </div>

                        {/* SELLER ID INPUT */}
                        <div className="mt-5">
                            <label className="text-app text-xs font-medium">
                                BrandBnalo Seller ID
                            </label>
                            <p className="text-muted mt-0.5 text-[11px]">
                                Find this on your BrandBnalo dashboard under
                                Settings → Seller ID.
                            </p>

                            <input
                                type="text"
                                value={sellerId}
                                onChange={(e) => setSellerId(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") handleConnect();
                                }}
                                placeholder="e.g. 6a19599b79a7cd6dff26a4c5"
                                disabled={connecting}
                                className="border-app bg-app text-app focus:border-blue-500 mt-2 w-full rounded-lg border px-3 py-2.5 font-mono text-xs outline-none transition disabled:opacity-60"
                            />
                        </div>

                        <button
                            onClick={handleConnect}
                            disabled={connecting || !sellerId.trim()}
                            className="mt-4 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {connecting ? (
                                <>
                                    <Loader2
                                        size={16}
                                        className="animate-spin"
                                    />
                                    Connecting…
                                </>
                            ) : (
                                <>
                                    <Link2 size={16} />
                                    Connect Website
                                </>
                            )}
                        </button>
                    </div>
                </div>
            )}

            {/* ==============================================
                CONNECTED
            ============================================== */}
            {isConnected && (
                <div className="space-y-4 p-5">
                    {/* SUCCESS BANNER */}
                    <div className="flex items-center gap-3 rounded-xl border border-green-500/20 bg-green-500/5 px-4 py-3">
                        <CheckCircle2
                            size={18}
                            className="shrink-0 text-green-600"
                        />
                        <div className="min-w-0 flex-1">
                            <p className="text-sm font-medium text-green-700">
                                Website connection is active
                            </p>
                            <p className="text-xs text-green-600/90 mt-0.5">
                                Leads from your BrandBnalo website are syncing
                                into this CRM automatically.
                            </p>
                        </div>
                    </div>

                    {/* BRANDBNAO SELLER ID (mapped) */}
                    <div>
                        <p className="text-app text-sm font-medium">
                            BrandBnalo Seller ID
                        </p>
                        <p className="text-muted mt-0.5 text-xs">
                            The seller account whose forms we pull leads from.
                        </p>

                        <div className="mt-2 flex gap-2">
                            <div className="border-app bg-surface text-app min-w-0 flex-1 break-all rounded-lg border px-3.5 py-2.5 font-mono text-xs">
                                {brandBnaloSellerId || "—"}
                            </div>
                            <button
                                onClick={() =>
                                    copyText(brandBnaloSellerId, "sellerId")
                                }
                                disabled={!brandBnaloSellerId}
                                className="border-app bg-app hover-app text-muted flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border disabled:opacity-50"
                            >
                                {copied === "sellerId" ? (
                                    <Check size={16} className="text-green-600" />
                                ) : (
                                    <Copy size={16} />
                                )}
                            </button>
                        </div>
                    </div>

                    {/* CRM USER ID */}
                    <div>
                        <p className="text-app text-sm font-medium">
                            CRM User ID
                        </p>
                        <p className="text-muted mt-0.5 text-xs">
                            Your CRM company identifier.
                        </p>

                        <div className="mt-2 flex gap-2">
                            <div className="border-app bg-surface text-app min-w-0 flex-1 break-all rounded-lg border px-3.5 py-2.5 font-mono text-xs">
                                {userId || "—"}
                            </div>
                            <button
                                onClick={() => copyText(userId, "userId")}
                                disabled={!userId}
                                className="border-app bg-app hover-app text-muted flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border disabled:opacity-50"
                            >
                                {copied === "userId" ? (
                                    <Check size={16} className="text-green-600" />
                                ) : (
                                    <Copy size={16} />
                                )}
                            </button>
                        </div>
                    </div>

                    {/* LAST SYNC + MANUAL SYNC */}
                    <div className="border-app bg-surface flex items-center justify-between gap-3 rounded-xl border px-4 py-3">
                        <div className="min-w-0">
                            <p className="text-app text-xs font-medium">
                                Auto-sync every minute
                            </p>
                            <p className="text-muted mt-0.5 text-[11px]">
                                {integration?.lastSyncAt
                                    ? `Last sync: ${new Date(
                                          integration.lastSyncAt
                                      ).toLocaleString("en-IN")}`
                                    : "Not synced yet"}
                            </p>
                        </div>

                        <button
                            onClick={handleSync}
                            disabled={syncing}
                            className="border-app bg-app hover-app text-app inline-flex shrink-0 items-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-medium disabled:opacity-60"
                        >
                            {syncing ? (
                                <>
                                    <Loader2
                                        size={13}
                                        className="animate-spin"
                                    />
                                    Syncing…
                                </>
                            ) : (
                                <>
                                    <RefreshCw size={13} />
                                    Sync now
                                </>
                            )}
                        </button>
                    </div>

                    {/* ERROR MESSAGE */}
                    {integration?.errorMessage && (
                        <div className="rounded-xl border border-red-500/20 bg-red-500/5 px-4 py-3">
                            <p className="text-xs font-medium text-red-600">
                                Sync error
                            </p>
                            <p className="mt-0.5 text-[11px] text-red-500/90 break-words">
                                {integration.errorMessage}
                            </p>
                        </div>
                    )}

                    {/* HOW IT WORKS (collapsible info) */}
                    <details className="border-app rounded-xl border">
                        <summary className="text-app cursor-pointer select-none px-4 py-3 text-xs font-medium">
                            How does this work?
                        </summary>
                        <div className="border-app border-t px-4 py-3">
                            <ol className="text-muted space-y-2 text-[11px] leading-5">
                                <li className="flex gap-2">
                                    <span className="text-blue-600 font-bold">
                                        1.
                                    </span>
                                    <span>
                                        Your website forms on BrandBnalo
                                        automatically collect leads.
                                    </span>
                                </li>
                                <li className="flex gap-2">
                                    <span className="text-blue-600 font-bold">
                                        2.
                                    </span>
                                    <span>
                                        Every minute, this CRM fetches new form
                                        submissions from BrandBnalo using your
                                        Seller ID.
                                    </span>
                                </li>
                                <li className="flex gap-2">
                                    <span className="text-blue-600 font-bold">
                                        3.
                                    </span>
                                    <span>
                                        New leads appear in your Leads list
                                        under source <b>website</b>, with stage{" "}
                                        <b>new</b>.
                                    </span>
                                </li>
                                <li className="flex gap-2">
                                    <span className="text-blue-600 font-bold">
                                        4.
                                    </span>
                                    <span>
                                        Only leads created after the connection
                                        date are imported — old ones are left
                                        untouched.
                                    </span>
                                </li>
                            </ol>
                        </div>
                    </details>

                    {/* OPTIONAL: SAMPLE PAYLOAD (for custom integrations) */}
                    <details className="border-app rounded-xl border">
                        <summary className="text-app cursor-pointer select-none px-4 py-3 text-xs font-medium">
                            Custom integration? See payload format
                        </summary>
                        <div className="border-app border-t px-4 py-3">
                            <div className="mb-2 flex items-center justify-between">
                                <p className="text-muted text-[11px]">
                                    If you have a custom website (not
                                    BrandBnalo), POST leads directly to:
                                </p>
                                <button
                                    onClick={() =>
                                        copyText(endpoint, "endpoint")
                                    }
                                    className="border-app text-muted hover-app inline-flex items-center gap-1 rounded-lg border px-2 py-1 text-[10px]"
                                >
                                    {copied === "endpoint" ? (
                                        <>
                                            <Check size={11} />
                                            Copied
                                        </>
                                    ) : (
                                        <>
                                            <Copy size={11} />
                                            Copy
                                        </>
                                    )}
                                </button>
                            </div>

                            <div className="text-app mb-2 break-all rounded-lg bg-gray-900 px-3 py-2 font-mono text-[11px] text-gray-200">
                                POST {endpoint}
                            </div>

                            <div className="mb-2 flex items-center justify-between">
                                <p className="text-muted text-[11px]">
                                    Payload:
                                </p>
                                <button
                                    onClick={() =>
                                        copyText(
                                            JSON.stringify(payload, null, 2),
                                            "payload"
                                        )
                                    }
                                    className="border-app text-muted hover-app inline-flex items-center gap-1 rounded-lg border px-2 py-1 text-[10px]"
                                >
                                    {copied === "payload" ? (
                                        <>
                                            <Check size={11} />
                                            Copied
                                        </>
                                    ) : (
                                        <>
                                            <Copy size={11} />
                                            Copy
                                        </>
                                    )}
                                </button>
                            </div>

                            <pre className="overflow-x-auto rounded-xl bg-gray-950 p-3 font-mono text-[11px] leading-5 text-gray-300">
{JSON.stringify(payload, null, 2)}
                            </pre>
                        </div>
                    </details>

                    {/* DISCONNECT */}
                    <div className="border-app flex items-center justify-between border-t pt-4">
                        <div>
                            <p className="text-app text-xs font-medium">
                                Website connection
                            </p>
                            <p className="text-muted mt-0.5 text-[11px]">
                                Disconnect to stop receiving website leads.
                            </p>
                        </div>
                        <button
                            onClick={handleDisconnect}
                            disabled={connecting}
                            className="rounded-lg border border-red-500/30 px-3 py-2 text-xs font-medium text-red-600 hover:bg-red-500/5 disabled:opacity-50"
                        >
                            {connecting ? "Please wait…" : "Disconnect"}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}