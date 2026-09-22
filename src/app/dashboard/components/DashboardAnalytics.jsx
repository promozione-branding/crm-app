// src/app/dashboard/components/DashboardAnalytics.jsx

'use client';

import React from 'react';
import Link from 'next/link';
import { UserPlus, CheckCircle2, Clock, ArrowRight, Users as UsersIcon, ClipboardList } from 'lucide-react';

// ============================================================
// CHART ITEMS
// ============================================================

const chartItems = [
    { key: 'users', label: 'Users', color: '#3b82f6' },
    { key: 'leads', label: 'Leads', color: '#22c55e' },
    { key: 'calls', label: 'Calls', color: '#a855f7' },
    { key: 'tasks', label: 'Tasks', color: '#f97316' },
];

// ============================================================
// HELPERS
// ============================================================

const STAGE_STYLES = {
    new: 'bg-cyan-500/10 text-cyan-600',
    contacted: 'bg-yellow-500/10 text-yellow-600',
    qualified: 'bg-violet-500/10 text-violet-600',
    proposal_sent: 'bg-orange-500/10 text-orange-600',
    negotiation: 'bg-pink-500/10 text-pink-600',
    won: 'bg-green-500/10 text-green-600',
    lost: 'bg-red-500/10 text-red-600',
};

const STATUS_STYLES = {
    pending: 'bg-yellow-500/10 text-yellow-600',
    completed: 'bg-green-500/10 text-green-600',
    cancelled: 'bg-red-500/10 text-red-600',
};

const PRIORITY_STYLES = {
    low: 'bg-gray-500/10 text-gray-600',
    medium: 'bg-blue-500/10 text-blue-600',
    high: 'bg-orange-500/10 text-orange-600',
    urgent: 'bg-red-500/10 text-red-600',
};

const formatLabel = (v) => {
    if (!v) return '—';
    return v.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
};

const timeAgo = (date) => {
    if (!date) return '';
    const diff = Date.now() - new Date(date).getTime();
    const min = Math.floor(diff / 60000);
    if (min < 1) return 'just now';
    if (min < 60) return `${min}m ago`;
    const hr = Math.floor(min / 60);
    if (hr < 24) return `${hr}h ago`;
    const d = Math.floor(hr / 24);
    if (d < 7) return `${d}d ago`;
    return new Date(date).toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
    });
};

// ============================================================
// COMPONENT
// ============================================================

export default function DashboardAnalytics({ stats, loading }) {
    const total = Number(stats.users || 0) + Number(stats.leads || 0) + Number(stats.calls || 0) + Number(stats.tasks || 0);

    const radius = 72;
    const circumference = 2 * Math.PI * radius;
    let accumulated = 0;

    const recentLeads = stats.recentLeads || [];
    const recentTasks = stats.recentTasks || [];

    return (
        <>
            {/* ==================================================
                MAIN ANALYTICS CARD
            ================================================== */}
            <div className="grid grid-cols-2 gap-3 py-2 sm:gap-4">
                {chartItems.map((item) => {
                    const value = Number(stats[item.key] || 0);
                    // fake trend for now — plug real % from API later
                    const trend = Math.random() > 0.5 ? 'up' : 'down';
                    const trendPct = (Math.random() * 15).toFixed(1);

                    return (
                        <div key={item.key} className="border-app hover-app rounded-xl border p-3 transition sm:p-4">
                            <div className="mb-2 flex items-center gap-2">
                                <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                                <span className="text-xs opacity-60">{item.label}</span>
                            </div>

                            <p className="text-2xl font-bold sm:text-3xl">{loading ? '—' : value}</p>

                            <div className={`mt-1 flex items-center gap-1 text-[11px] font-medium ${trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
                                {trend === 'up' ? '▲' : '▼'} {trendPct}% <span className="opacity-60">vs last week</span>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* ==================================================
                RECENT LEADS + RECENT TASKS
            ================================================== */}
            <section className="mt-6 grid grid-cols-1 gap-4 sm:mt-8 sm:gap-6 lg:grid-cols-2">
                {/* ---------- RECENT LEADS ---------- */}
                <div className="bg-app border-app rounded-2xl border p-4 sm:p-6">
                    <div className="mb-4 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/10 text-blue-500">
                                <UserPlus size={16} />
                            </div>
                            <div>
                                <h3 className="text-sm font-semibold sm:text-base">Recent Leads</h3>
                                <p className="text-[11px] opacity-60 sm:text-xs">Latest 5 leads</p>
                            </div>
                        </div>

                        <Link href="/leads" className="text-muted hover-app flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-medium transition">
                            View all <ArrowRight size={13} />
                        </Link>
                    </div>

                    {loading ? (
                        <div className="space-y-2">
                            {[1, 2, 3, 4, 5].map((i) => (
                                <div key={i} className="border-app h-14 w-full animate-pulse rounded-xl border" />
                            ))}
                        </div>
                    ) : recentLeads.length === 0 ? (
                        <EmptyMini icon={UsersIcon} label="No leads yet" hint="Leads will appear here once added." />
                    ) : (
                        <div className="space-y-2">
                            {recentLeads.map((lead) => (
                                <Link
                                    key={lead._id}
                                    href={`/leads/edit/${lead._id}`}
                                    className="border-app hover-app flex items-center gap-3 rounded-xl border px-3 py-2.5 transition"
                                >
                                    {/* AVATAR */}
                                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-500/10 text-xs font-bold text-blue-500">
                                        {(lead.name || 'L')
                                            .split(' ')
                                            .map((w) => w[0])
                                            .slice(0, 2)
                                            .join('')
                                            .toUpperCase()}
                                    </div>

                                    {/* INFO */}
                                    <div className="min-w-0 flex-1">
                                        <p className="truncate text-sm font-medium">{lead.name || '—'}</p>
                                        <p className="truncate text-[11px] opacity-60">
                                            {lead.assignedTo?.name ? `Assigned to ${lead.assignedTo.name}` : lead.companyName || lead.phone || '—'}
                                        </p>
                                    </div>

                                    {/* STAGE + TIME */}
                                    <div className="flex shrink-0 flex-col items-end gap-1">
                                        {lead.stage && (
                                            <span
                                                className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${
                                                    STAGE_STYLES[lead.stage] || 'bg-gray-500/10 text-gray-600'
                                                }`}
                                            >
                                                {formatLabel(lead.stage)}
                                            </span>
                                        )}
                                        <span className="text-[10px] opacity-50">{timeAgo(lead.updatedAt)}</span>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>

                {/* ---------- RECENT TASKS ---------- */}
                <div className="bg-app border-app rounded-2xl border p-4 sm:p-6">
                    <div className="mb-4 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-500/10 text-orange-500">
                                <ClipboardList size={16} />
                            </div>
                            <div>
                                <h3 className="text-sm font-semibold sm:text-base">Recent Tasks</h3>
                                <p className="text-[11px] opacity-60 sm:text-xs">Latest 5 tasks</p>
                            </div>
                        </div>

                        <Link href="/tasks" className="text-muted hover-app flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-medium transition">
                            View all <ArrowRight size={13} />
                        </Link>
                    </div>

                    {loading ? (
                        <div className="space-y-2">
                            {[1, 2, 3, 4, 5].map((i) => (
                                <div key={i} className="border-app h-14 w-full animate-pulse rounded-xl border" />
                            ))}
                        </div>
                    ) : recentTasks.length === 0 ? (
                        <EmptyMini icon={ClipboardList} label="No tasks yet" hint="Tasks will appear here once assigned." />
                    ) : (
                        <div className="space-y-2">
                            {recentTasks.map((task) => (
                                <Link
                                    key={task._id}
                                    href={`/tasks/edit/${task._id}`}
                                    className="border-app hover-app flex items-center gap-3 rounded-xl border px-3 py-2.5 transition"
                                >
                                    {/* ICON */}
                                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-orange-500/10 text-orange-500">
                                        {task.status === 'completed' ? <CheckCircle2 size={15} /> : <Clock size={15} />}
                                    </div>

                                    {/* INFO */}
                                    <div className="min-w-0 flex-1">
                                        <p className="truncate text-sm font-medium">{task.title || '—'}</p>
                                        <p className="truncate text-[11px] opacity-60">
                                            {task.assignedTo?.name
                                                ? `Assigned to ${task.assignedTo.name}`
                                                : task.leadId?.name
                                                  ? `Lead: ${task.leadId.name}`
                                                  : '—'}
                                        </p>
                                    </div>

                                    {/* STATUS + TIME */}
                                    <div className="flex shrink-0 flex-col items-end gap-1">
                                        {task.status && (
                                            <span
                                                className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${
                                                    STATUS_STYLES[task.status] || 'bg-gray-500/10 text-gray-600'
                                                }`}
                                            >
                                                {formatLabel(task.status)}
                                            </span>
                                        )}
                                        <span className="text-[10px] opacity-50">{timeAgo(task.updatedAt)}</span>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </section>
        </>
    );
}

// ============================================================
// EMPTY MINI
// ============================================================

function EmptyMini({ icon: Icon, label, hint }) {
    return (
        <div className="border-app flex flex-col items-center justify-center rounded-xl border px-4 py-8 text-center">
            <Icon size={28} className="mb-2 opacity-30" />
            <p className="text-sm font-medium">{label}</p>
            <p className="mt-1 text-[11px] opacity-60">{hint}</p>
        </div>
    );
}
