"use client";
import { Copy, RefreshCw, Webhook, CheckCircle2, Eye, EyeOff, } from "lucide-react";
import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

export default function WebhookApi() {
    const [loading, setLoading] = useState(true);
    const [generating, setGenerating] = useState(false);
    const [webhookUrl, setWebhookUrl] = useState("");
    const [apiKeyPrefix, setApiKeyPrefix] = useState("");
    const [newApiKey, setNewApiKey] = useState("");
    const [status, setStatus] = useState("inactive");
    const [lastUsedAt, setLastUsedAt] = useState(null);
    const [showApiKey, setShowApiKey] = useState(false);

    const loadWebhook = async () => {
        try {
            setLoading(true);
            const res = await axios.get("/api/user/webhook");

            if (res.data.success) {
                console.log(res.data)
                const webhook = res.data.webhook;
                setWebhookUrl(webhook.url);
                setApiKeyPrefix(webhook.apiKeyPrefix || "");
                setStatus(webhook.status || "inactive");
                setLastUsedAt(webhook.lastUsedAt || null);
            }
        } catch (error) {
            toast.error(error?.response?.data?.message || "Failed to load webhook settings");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadWebhook();
    }, []);

    const handleGenerateApiKey = async () => {
        try {
            setGenerating(true);
            const res = await axios.post("/api/user/webhook/generate");

            if (res.data.success) {
                setNewApiKey(res.data.apiKey);
                setWebhookUrl(res.data.webhookUrl);
                setApiKeyPrefix(res.data.apiKey.substring(0, 15));
                setStatus("active");
                toast.success("API key generated successfully");
            }
        } catch (error) {
            toast.error(error?.response?.data?.message || "Failed to generate API key");
        } finally {
            setGenerating(false);
        }
    };

    const copyText = async (text, message) => {
        try {
            await navigator.clipboard.writeText(text);
            toast.success(message);
        } catch {
            toast.error("Failed to copy");
        }
    };

    const displayApiKey = newApiKey || (apiKeyPrefix ? `${apiKeyPrefix}••••••••••••` : "");

    return (
        <div className="space-y-5">
            <div>
                <h2 className="text-base font-semibold text-app">
                    Webhook API
                </h2>

                <p className="text-xs text-muted mt-1">
                    Connect WordPress, custom websites,
                    landing pages and other platforms to
                    receive leads automatically.
                </p>
            </div>

            {/* Configuration */}
            <div className="max-w-3xl bg-app border border-app rounded-2xl p-5">
                {/* Header */}
                <div className="flex items-center gap-3 pb-5 border-b border-app">
                    <div className="w-11 h-11 rounded-xl bg-surface border border-app flex items-center justify-center">
                        <Webhook size={20} className="text-blue-500" />
                    </div>

                    <div>
                        <h3 className="text-sm font-semibold text-app">
                            API Configuration
                        </h3>

                        <p className="text-xs text-muted mt-1">
                            Use these credentials to send
                            leads to your CRM.
                        </p>
                    </div>
                </div>

                <div className="space-y-5 mt-5">
                    {/* Webhook URL */}
                    <div>
                        <label className="text-xs font-medium text-app">
                            Webhook URL
                        </label>

                        <div className="flex gap-2 mt-2">
                            <input
                                readOnly
                                value={loading ? "Loading..." : webhookUrl}
                                className="flex-1 h-10 px-3 rounded-lg bg-surface border border-app text-xs text-app outline-none"
                            />

                            <button onClick={() => copyText(webhookUrl, "Webhook URL copied")} disabled={!webhookUrl}
                                className="w-10 h-10 rounded-lg border border-app hover-app flex items-center justify-center text-app disabled:opacity-50"
                                title="Copy webhook URL"
                            >
                                <Copy size={15} />
                            </button>
                        </div>
                    </div>

                    {/* API KEY */}
                    <div>
                        <label className="text-xs font-medium text-app">
                            API Key
                        </label>

                        <div className="flex gap-2 mt-2">
                            <input
                                readOnly
                                value={displayApiKey || "No API key generated"}
                                type={showApiKey ? "text" : "password"}
                                className="flex-1 h-10 px-3 rounded-lg bg-surface border border-app text-xs text-app outline-none"
                            />

                            {newApiKey && (
                                <button onClick={() => setShowApiKey(!showApiKey)}
                                    className="w-10 h-10 rounded-lg border border-app hover-app flex items-center justify-center text-app"
                                    title={showApiKey ? "Hide API key" : "Show API key"}
                                >
                                    {showApiKey ? (<EyeOff size={15} />) : (<Eye size={15} />)}
                                </button>
                            )}

                            <button
                                onClick={() => {
                                    if (newApiKey) {
                                        copyText(newApiKey, "API key copied");
                                    } else {
                                        toast.error("Generate an API key first");
                                    }
                                }}
                                disabled={!newApiKey}
                                className="w-10 h-10 rounded-lg border border-app hover-app flex items-center justify-center text-app disabled:opacity-50"
                                title="Copy API key"
                            >
                                <Copy size={15} />
                            </button>
                        </div>

                        {newApiKey && (
                            <p className="text-[11px] text-amber-500 mt-2">
                                Copy this API key now. For security,
                                the complete key will not be shown
                                again.
                            </p>
                        )}
                    </div>

                    {/* Status */}
                    <div className="flex items-center justify-between gap-4 p-4 rounded-xl bg-surface border border-app">
                        <div className="flex items-center gap-3">
                            <CheckCircle2 size={18} className={status === "active" ? "text-blue-500" : "text-muted"} />

                            <div>
                                <p className="text-xs font-medium text-app">
                                    {status === "active" ? "API Active" : "API Not Configured"}
                                </p>

                                <p className="text-[11px] text-muted mt-0.5">
                                    {lastUsedAt
                                        ? `Last used: ${new Date(
                                            lastUsedAt
                                        ).toLocaleString()}`
                                        : "Your webhook has not received any requests yet."}
                                </p>
                            </div>
                        </div>

                        <button onClick={handleGenerateApiKey} disabled={generating}
                            className="flex items-center gap-2 h-8 px-3 rounded-lg border border-app hover-app text-xs text-app disabled:opacity-50"
                        >
                            <RefreshCw size={13} className={generating ? "animate-spin" : ""} />
                            {generating ? "Generating..." : apiKeyPrefix ? "Regenerate" : "Generate API Key"}
                        </button>
                    </div>
                </div>
            </div>

            {/* Request Documentation */}
            <div className="max-w-3xl bg-app border border-app rounded-2xl p-5">
                <h3 className="text-sm font-semibold text-app">
                    Request Format
                </h3>

                <p className="text-xs text-muted mt-1">
                    Send a POST request with your API key
                    in the Authorization header.
                </p>

                <div className="mt-4 space-y-3">
                    <div>
                        <p className="text-[11px] text-muted mb-1">
                            Method
                        </p>

                        <div className="px-3 py-2 rounded-lg bg-surface border border-app text-xs text-app">
                            POST
                        </div>
                    </div>

                    <div>
                        <p className="text-[11px] text-muted mb-1">
                            Authorization
                        </p>

                        <div className="px-3 py-2 rounded-lg bg-surface border border-app text-xs text-app font-mono">
                            Authorization: Bearer YOUR_API_KEY
                        </div>
                    </div>

                    <div>
                        <p className="text-[11px] text-muted mb-1">
                            Content-Type
                        </p>

                        <div className="px-3 py-2 rounded-lg bg-surface border border-app text-xs text-app font-mono">
                            application/json
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}