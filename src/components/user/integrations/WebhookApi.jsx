import { Copy, RefreshCw, Webhook, CheckCircle2 } from 'lucide-react'
import React from 'react'

export default function WebhookApi() {
    return (
        <div className="space-y-5">
            <div>
                <h2 className="text-base font-semibold text-app">
                    Webhook API
                </h2>

                <p className="text-xs text-muted mt-1">
                    Use your API credentials to send and receive integration
                    data securely.
                </p>
            </div>

            <div className="max-w-3xl bg-app border border-app rounded-2xl p-5">
                <div className="flex items-center gap-3 pb-5 border-b border-app">
                    <div className="w-11 h-11 rounded-xl bg-surface border border-app flex items-center justify-center">
                        <Webhook size={20} className="text-blue-500" />
                    </div>

                    <div>
                        <h3 className="text-sm font-semibold text-app">
                            API Configuration
                        </h3>

                        <p className="text-xs text-muted mt-1">
                            Manage your webhook endpoint and API credentials.
                        </p>
                    </div>
                </div>

                <div className="space-y-5 mt-5">
                    <div>
                        <label className="text-xs font-medium text-app">
                            Webhook URL
                        </label>

                        <div className="flex gap-2 mt-2">
                            <input
                                readOnly
                                value="https://api.yourdomain.com/webhooks"
                                className="flex-1 h-10 px-3 rounded-lg bg-surface border border-app text-xs text-app outline-none"
                            />

                            <button className="w-10 h-10 rounded-lg border border-app hover-app flex items-center justify-center text-app"
                                title="Copy webhook URL"
                            >
                                <Copy size={15} />
                            </button>
                        </div>
                    </div>

                    <div>
                        <label className="text-xs font-medium text-app">
                            API Key
                        </label>

                        <div className="flex gap-2 mt-2">
                            <input
                                readOnly
                                value="sk_live_xxxxxxxxxxxxxxxxx"
                                type="password"
                                className="flex-1 h-10 px-3 rounded-lg bg-surface border border-app text-xs text-app outline-none"
                            />

                            <button className="w-10 h-10 rounded-lg border border-app hover-app flex items-center justify-center text-app"
                                title="Copy API key"
                            >
                                <Copy size={15} />
                            </button>
                        </div>
                    </div>

                    <div className="flex items-center justify-between gap-4 p-4  rounded-xl bg-surface border border-app">
                        <div className="flex items-center gap-3">
                            <CheckCircle2 size={18} className="text-blue-500" />

                            <div>
                                <p className="text-xs font-medium text-app">
                                    API Active
                                </p>

                                <p className="text-[11px] text-muted mt-0.5">
                                    Your API integration is currently active.
                                </p>
                            </div>
                        </div>

                        <button className="flex items-center gap-2 h-8 px-3 rounded-lg border border-app hover-app text-xs text-app">
                            <RefreshCw size={13} />
                            Regenerate
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
