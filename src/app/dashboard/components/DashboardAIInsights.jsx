// src/app/dashboard/components/DashboardAIInsights.jsx

'use client';

import { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Sparkles, RefreshCw, AlertTriangle, Flame, Clock3, PhoneCall, Loader2 } from 'lucide-react';

// ============================================================
// STYLES
// ============================================================

const URGENCY_STYLES = {
    high: 'bg-red-500/10 text-red-600 border-red-500/20',
    medium: 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20',
    low: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
};

// ============================================================
// COMPONENT
// ============================================================

export default function DashboardAIInsights() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);

    const generate = async () => {
        try {
            setLoading(true);
            const res = await axios.get('/api/user/dashboard/ai-insights', {
                withCredentials: true,
            });

            if (res.data?.success) {
                setData(res.data.data);
                toast.success('AI insights updated');
            } else {
                toast.error(res.data?.message || 'Failed to generate insights');
            }
        } catch (err) {
            console.error(err);
            toast.error(err?.response?.data?.message || 'Failed to generate insights');
        } finally {
            setLoading(false);
        }
    };

    const insights = data?.insights;

    return (
        <section className="bg-app border-app mt-6 rounded-2xl border p-4 sm:mt-8 sm:p-6">
            {/* ==============================================
                HEADER
            ============================================== */}
            <div className="mb-5 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-violet-500/10 text-violet-500">
                        <Sparkles size={18} />
                    </div>

                    <div>
                        <h3 className="text-sm font-semibold sm:text-base">AI Insights</h3>
                        <p className="text-[11px] opacity-60 sm:text-xs">Smart suggestions from your CRM data</p>
                    </div>
                </div>

                <button
                    onClick={generate}
                    disabled={loading}
                    className="border-app hover-app flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition disabled:opacity-50"
                >
                    {loading ? <Loader2 size={13} className="animate-spin" /> : <RefreshCw size={13} />}
                    {data ? 'Regenerate' : 'Generate'}
                </button>
            </div>

            {/* ==============================================
                EMPTY STATE
            ============================================== */}
            {!data && !loading && (
                <div className="border-app flex flex-col items-center justify-center rounded-xl border px-4 py-10 text-center">
                    <Sparkles size={28} className="mb-2 opacity-30" />
                    <p className="text-sm font-medium">Get AI-powered suggestions</p>
                    <p className="mt-1 text-[11px] opacity-60">Click Generate to analyze your leads, calls and tasks.</p>
                </div>
            )}

            {/* ==============================================
                LOADING
            ============================================== */}
            {loading && (
                <div className="border-app flex flex-col items-center justify-center rounded-xl border px-4 py-10 text-center">
                    <Loader2 size={22} className="animate-spin opacity-60" />
                    <p className="mt-2 text-xs opacity-60">Analyzing your pipeline…</p>
                </div>
            )}

            {/* ==============================================
                RESULTS
            ============================================== */}
            {data && !loading && insights && (
                <div className="space-y-5">
                    {/* SUMMARY */}
                    {insights.summary && (
                        <div className="rounded-xl border border-violet-500/20 bg-violet-500/5 p-4">
                            <p className="text-sm leading-relaxed">{insights.summary}</p>
                        </div>
                    )}

                    {/* PRIORITY ACTIONS */}
                    {insights.priority_actions?.length > 0 && (
                        <div>
                            <h4 className="mb-2 flex items-center gap-1.5 text-xs font-semibold tracking-wide uppercase opacity-70">
                                <AlertTriangle size={13} /> Priority Actions
                            </h4>
                            <div className="space-y-2">
                                {insights.priority_actions.map((a, i) => (
                                    <div key={i} className={`flex items-start gap-3 rounded-xl border p-3 ${URGENCY_STYLES[a.urgency] || URGENCY_STYLES.low}`}>
                                        <div className="min-w-0 flex-1">
                                            <p className="text-sm font-semibold">{a.title}</p>
                                            <p className="mt-0.5 text-[11px] opacity-80">{a.why}</p>
                                        </div>
                                        <span className="shrink-0 rounded-full bg-black/5 px-2 py-0.5 text-[10px] font-bold uppercase">{a.urgency}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* HOT + RISKY LEADS */}
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                        {insights.hot_leads?.length > 0 && (
                            <div className="border-app rounded-xl border p-3">
                                <h4 className="mb-2 flex items-center gap-1.5 text-xs font-semibold tracking-wide uppercase opacity-70">
                                    <Flame size={13} className="text-orange-500" /> Hot Leads
                                </h4>
                                <div className="space-y-2">
                                    {insights.hot_leads.map((l, i) => (
                                        <div key={i}>
                                            <p className="text-sm font-medium">{l.name}</p>
                                            <p className="text-[11px] opacity-60">{l.reason}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {insights.risky_leads?.length > 0 && (
                            <div className="border-app rounded-xl border p-3">
                                <h4 className="mb-2 flex items-center gap-1.5 text-xs font-semibold tracking-wide uppercase opacity-70">
                                    <Clock3 size={13} className="text-red-500" /> Going Cold
                                </h4>
                                <div className="space-y-2">
                                    {insights.risky_leads.map((l, i) => (
                                        <div key={i}>
                                            <p className="text-sm font-medium">{l.name}</p>
                                            <p className="text-[11px] opacity-60">{l.reason}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* CALL INSIGHTS */}
                    {insights.call_insights && (
                        <div className="border-app rounded-xl border p-3">
                            <h4 className="mb-2 flex items-center gap-1.5 text-xs font-semibold tracking-wide uppercase opacity-70">
                                <PhoneCall size={13} className="text-purple-500" /> Call Insights
                            </h4>
                            <p className="text-sm leading-relaxed">{insights.call_insights}</p>
                        </div>
                    )}

                    {/* FOOTER */}
                    <p className="text-right text-[10px] opacity-50">
                        Scope: {data.scope} · {new Date(data.generatedAt).toLocaleTimeString()}
                    </p>
                </div>
            )}
        </section>
    );
}
