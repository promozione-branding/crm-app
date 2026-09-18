// src/components/user/integrations/WebhookApi.jsx

'use client';
import { Copy, RefreshCw, Webhook, CheckCircle2, Eye, EyeOff } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

export default function WebhookApi() {
    const [loading, setLoading] = useState(true);
    const [generating, setGenerating] = useState(false);
    const [webhookUrl, setWebhookUrl] = useState('');
    const [apiKeyPrefix, setApiKeyPrefix] = useState('');
    const [newApiKey, setNewApiKey] = useState('');
    const [status, setStatus] = useState('inactive');
    const [lastUsedAt, setLastUsedAt] = useState(null);
    const [showApiKey, setShowApiKey] = useState(false);

    const loadWebhook = async () => {
        try {
            setLoading(true);
            const res = await axios.get('/api/user/webhook');

            if (res.data.success) {
                console.log(res.data);
                const webhook = res.data.webhook;
                setWebhookUrl(webhook.url);
                setApiKeyPrefix(webhook.apiKeyPrefix || '');
                setStatus(webhook.status || 'inactive');
                setLastUsedAt(webhook.lastUsedAt || null);
            }
        } catch (error) {
            toast.error(error?.response?.data?.message || 'Failed to load webhook settings');
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
            const res = await axios.post('/api/user/webhook/generate');

            if (res.data.success) {
                setNewApiKey(res.data.apiKey);
                setWebhookUrl(res.data.webhookUrl);
                setApiKeyPrefix(res.data.apiKey.substring(0, 15));
                setStatus('active');
                toast.success('API key generated successfully');
            }
        } catch (error) {
            toast.error(error?.response?.data?.message || 'Failed to generate API key');
        } finally {
            setGenerating(false);
        }
    };

    const copyText = async (text, message) => {
        try {
            await navigator.clipboard.writeText(text);
            toast.success(message);
        } catch {
            toast.error('Failed to copy');
        }
    };

    const displayApiKey = newApiKey || (apiKeyPrefix ? `${apiKeyPrefix}••••••••••••` : '');

    return (
        <div className="space-y-5">
            <div>
                <h2 className="text-app text-base font-semibold">Webhook API</h2>

                <p className="text-muted mt-1 text-xs">Connect WordPress, custom websites, landing pages and other platforms to receive leads automatically.</p>
            </div>

            {/* Configuration */}
            <div className="bg-app border-app max-w-3xl rounded-2xl border p-5">
                {/* Header */}
                <div className="border-app flex items-center gap-3 border-b pb-5">
                    <div className="bg-surface border-app flex h-11 w-11 items-center justify-center rounded-xl border">
                        <Webhook size={20} className="text-blue-500" />
                    </div>

                    <div>
                        <h3 className="text-app text-sm font-semibold">API Configuration</h3>

                        <p className="text-muted mt-1 text-xs">Use these credentials to send leads to your CRM.</p>
                    </div>
                </div>

                <div className="mt-5 space-y-5">
                    {/* Webhook URL */}
                    <div>
                        <label className="text-app text-xs font-medium">Webhook URL</label>

                        <div className="mt-2 flex gap-2">
                            <input
                                readOnly
                                value={loading ? 'Loading...' : webhookUrl}
                                className="bg-surface border-app text-app h-10 flex-1 rounded-lg border px-3 text-xs outline-none"
                            />

                            <button
                                onClick={() => copyText(webhookUrl, 'Webhook URL copied')}
                                disabled={!webhookUrl}
                                className="border-app hover-app text-app flex h-10 w-10 items-center justify-center rounded-lg border disabled:opacity-50"
                                title="Copy webhook URL"
                            >
                                <Copy size={15} />
                            </button>
                        </div>
                    </div>

                    {/* API KEY */}
                    <div>
                        <label className="text-app text-xs font-medium">API Key</label>

                        <div className="mt-2 flex gap-2">
                            <input
                                readOnly
                                value={displayApiKey || 'No API key generated'}
                                type={showApiKey ? 'text' : 'password'}
                                className="bg-surface border-app text-app h-10 flex-1 rounded-lg border px-3 text-xs outline-none"
                            />

                            {newApiKey && (
                                <button
                                    onClick={() => setShowApiKey(!showApiKey)}
                                    className="border-app hover-app text-app flex h-10 w-10 items-center justify-center rounded-lg border"
                                    title={showApiKey ? 'Hide API key' : 'Show API key'}
                                >
                                    {showApiKey ? <EyeOff size={15} /> : <Eye size={15} />}
                                </button>
                            )}

                            <button
                                onClick={() => {
                                    if (newApiKey) {
                                        copyText(newApiKey, 'API key copied');
                                    } else {
                                        toast.error('Generate an API key first');
                                    }
                                }}
                                disabled={!newApiKey}
                                className="border-app hover-app text-app flex h-10 w-10 items-center justify-center rounded-lg border disabled:opacity-50"
                                title="Copy API key"
                            >
                                <Copy size={15} />
                            </button>
                        </div>

                        {newApiKey && (
                            <p className="mt-2 text-[11px] text-amber-500">Copy this API key now. For security, the complete key will not be shown again.</p>
                        )}
                    </div>

                    {/* Status */}
                    <div className="bg-surface border-app flex items-center justify-between gap-4 rounded-xl border p-4">
                        <div className="flex items-center gap-3">
                            <CheckCircle2 size={18} className={status === 'active' ? 'text-blue-500' : 'text-muted'} />

                            <div>
                                <p className="text-app text-xs font-medium">{status === 'active' ? 'API Active' : 'API Not Configured'}</p>

                                <p className="text-muted mt-0.5 text-[11px]">
                                    {lastUsedAt ? `Last used: ${new Date(lastUsedAt).toLocaleString()}` : 'Your webhook has not received any requests yet.'}
                                </p>
                            </div>
                        </div>

                        <button
                            onClick={handleGenerateApiKey}
                            disabled={generating}
                            className="border-app hover-app text-app flex h-8 items-center gap-2 rounded-lg border px-3 text-xs disabled:opacity-50"
                        >
                            <RefreshCw size={13} className={generating ? 'animate-spin' : ''} />
                            {generating ? 'Generating...' : apiKeyPrefix ? 'Regenerate' : 'Generate API Key'}
                        </button>
                    </div>
                </div>
            </div>

            {/* Request Documentation */}
            <div className="bg-app border-app max-w-3xl rounded-2xl border p-5">
                <h3 className="text-app text-sm font-semibold">Request Format</h3>

                <p className="text-muted mt-1 text-xs">Send a POST request with your API key in the Authorization header.</p>

                <div className="mt-4 space-y-3">
                    <div>
                        <p className="text-muted mb-1 text-[11px]">Method</p>

                        <div className="bg-surface border-app text-app rounded-lg border px-3 py-2 text-xs">POST</div>
                    </div>

                    <div>
                        <p className="text-muted mb-1 text-[11px]">Authorization</p>

                        <div className="bg-surface border-app text-app rounded-lg border px-3 py-2 font-mono text-xs">Authorization: Bearer YOUR_API_KEY</div>
                    </div>

                    <div>
                        <p className="text-muted mb-1 text-[11px]">Content-Type</p>

                        <div className="bg-surface border-app text-app rounded-lg border px-3 py-2 font-mono text-xs">application/json</div>
                    </div>
                </div>
            </div>
        </div>
    );
}
