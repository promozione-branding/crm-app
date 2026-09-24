// src/app/dashboard/components/DashboardAnalytics.jsx

'use client';

import React from 'react';
import Link from 'next/link';

import { ArrowRight, CheckCircle2, Clock, Phone, TrendingUp, UserPlus, ClipboardList, AlertCircle, PhoneCall, Target, IndianRupee } from 'lucide-react';

// ============================================================
// HELPERS
// ============================================================

const formatLabel = (value) => {
    if (!value) return '—';

    return value.replace(/_/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase());
};

const formatCurrency = (value) => {
    const number = Number(value || 0);

    if (number >= 10000000) {
        return `₹${(number / 10000000).toFixed(1)}Cr`;
    }

    if (number >= 100000) {
        return `₹${(number / 100000).toFixed(1)}L`;
    }

    if (number >= 1000) {
        return `₹${(number / 1000).toFixed(1)}K`;
    }

    return `₹${number.toLocaleString('en-IN')}`;
};

const timeAgo = (date) => {
    if (!date) return '';

    const diff = Date.now() - new Date(date).getTime();

    const minutes = Math.floor(diff / 60000);

    if (minutes < 1) {
        return 'just now';
    }

    if (minutes < 60) {
        return `${minutes}m ago`;
    }

    const hours = Math.floor(minutes / 60);

    if (hours < 24) {
        return `${hours}h ago`;
    }

    const days = Math.floor(hours / 24);

    if (days < 7) {
        return `${days}d ago`;
    }

    return new Date(date).toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
    });
};

// ============================================================
// STYLES
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

const ACTIVITY_STYLES = {
    task: {
        icon: ClipboardList,
        className: 'bg-orange-500/10 text-orange-500',
    },

    call: {
        icon: Phone,
        className: 'bg-purple-500/10 text-purple-500',
    },

    lead: {
        icon: UserPlus,
        className: 'bg-blue-500/10 text-blue-500',
    },
};

// ============================================================
// COMPONENT
// ============================================================

export default function DashboardAnalytics({ analytics, loading }) {
    if (loading) {
        return <AnalyticsSkeleton />;
    }

    if (!analytics) {
        return null;
    }

    const tasks = analytics.tasks || {};

    const leads = analytics.leads || {};

    const calls = analytics.calls || {};

    const recentActivity = analytics.recentActivity || [];

    const recentLeads = analytics.recentLeads || [];

    const recentTasks = analytics.recentTasks || [];

    const pipeline = leads.pipeline || {};

    const sources = leads.sources || {};

    return (
        <div className="mt-6 space-y-6 sm:mt-8">
            {/* ==================================================
                TASK OVERVIEW
            ================================================== */}

            <section className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                <MetricCard icon={ClipboardList} label="Pending Tasks" value={tasks.pending || 0} iconClass="text-orange-500" iconBg="bg-orange-500/10" />

                <MetricCard icon={CheckCircle2} label="Completed" value={tasks.completed || 0} iconClass="text-green-500" iconBg="bg-green-500/10" />

                <MetricCard icon={AlertCircle} label="Overdue" value={tasks.overdue || 0} iconClass="text-red-500" iconBg="bg-red-500/10" />

                <MetricCard icon={Clock} label="Due Today" value={tasks.dueToday || 0} iconClass="text-blue-500" iconBg="bg-blue-500/10" />
            </section>

            {/* ==================================================
                LEAD PIPELINE + TASK DETAILS
            ================================================== */}

            <section className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                {/* ==================================================
                    LEAD PIPELINE
                ================================================== */}

                <div className="bg-app border-app rounded-2xl border p-4 sm:p-6">
                    <div className="mb-5 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-green-500/10 text-green-500">
                                <TrendingUp size={18} />
                            </div>

                            <div>
                                <h3 className="text-sm font-semibold sm:text-base">Lead Pipeline</h3>

                                <p className="text-[11px] opacity-60 sm:text-xs">Leads by stage</p>
                            </div>
                        </div>

                        <Link href="/leads" className="text-muted hover-app flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-medium">
                            View all
                            <ArrowRight size={13} />
                        </Link>
                    </div>

                    <div className="space-y-3">
                        {Object.entries(pipeline).map(([stage, count]) => {
                            const total = leads.total || 0;

                            const percentage = total > 0 ? Math.round((count / total) * 100) : 0;

                            return (
                                <div key={stage} className="space-y-1.5">
                                    <div className="flex items-center justify-between">
                                        <span
                                            className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${
                                                STAGE_STYLES[stage] || 'bg-gray-500/10 text-gray-600'
                                            }`}
                                        >
                                            {formatLabel(stage)}
                                        </span>

                                        <span className="text-xs font-semibold">{count}</span>
                                    </div>

                                    <div className="bg-surface h-1.5 overflow-hidden rounded-full">
                                        <div
                                            className="h-full rounded-full bg-current opacity-60 transition-all"
                                            style={{
                                                width: `${percentage}%`,
                                            }}
                                        />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* ==================================================
                    TASK OVERVIEW
                ================================================== */}

                <div className="bg-app border-app rounded-2xl border p-4 sm:p-6">
                    <div className="mb-5 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-orange-500/10 text-orange-500">
                                <ClipboardList size={18} />
                            </div>

                            <div>
                                <h3 className="text-sm font-semibold sm:text-base">Task Overview</h3>

                                <p className="text-[11px] opacity-60 sm:text-xs">Current task status</p>
                            </div>
                        </div>

                        <Link href="/tasks" className="text-muted hover-app flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-medium">
                            View all
                            <ArrowRight size={13} />
                        </Link>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <SmallStat label="Total" value={tasks.total || 0} />

                        <SmallStat label="Pending" value={tasks.pending || 0} />

                        <SmallStat label="Completed" value={tasks.completed || 0} />

                        <SmallStat label="Cancelled" value={tasks.cancelled || 0} />

                        <SmallStat label="Overdue" value={tasks.overdue || 0} danger />

                        <SmallStat label="This Week" value={tasks.dueThisWeek || 0} />
                    </div>
                </div>
            </section>

            {/* ==================================================
                CALLS + DEAL VALUE
            ================================================== */}

            <section className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                {/* ==================================================
                    CALL ACTIVITY
                ================================================== */}

                <div className="bg-app border-app rounded-2xl border p-4 sm:p-6">
                    <div className="mb-5 flex items-center gap-2">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-purple-500/10 text-purple-500">
                            <PhoneCall size={18} />
                        </div>

                        <div>
                            <h3 className="text-sm font-semibold sm:text-base">Call Activity</h3>

                            <p className="text-[11px] opacity-60 sm:text-xs">Your call activity</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                        <SmallStat label="Today" value={calls.today || 0} />

                        <SmallStat label="This Week" value={calls.week || 0} />

                        <SmallStat label="This Month" value={calls.month || 0} />

                        <SmallStat label="Connected" value={`${calls.connectionRate || 0}%`} />
                    </div>

                    <div className="mt-5 space-y-2">
                        {Object.entries(calls.byStatus || {}).map(([status, count]) => (
                            <div key={status} className="flex items-center justify-between text-xs">
                                <span className="opacity-60">{formatLabel(status)}</span>

                                <span className="font-semibold">{count}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* ==================================================
                    DEAL VALUE
                ================================================== */}

                <div className="bg-app border-app rounded-2xl border p-4 sm:p-6">
                    <div className="mb-5 flex items-center gap-2">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-green-500/10 text-green-500">
                            <IndianRupee size={18} />
                        </div>

                        <div>
                            <h3 className="text-sm font-semibold sm:text-base">Deal Value</h3>

                            <p className="text-[11px] opacity-60 sm:text-xs">Current pipeline value</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                        <ValueCard label="Pipeline" value={formatCurrency(leads.dealValue?.openPipeline)} />

                        <ValueCard label="Won" value={formatCurrency(leads.dealValue?.won)} />

                        <ValueCard label="Total" value={formatCurrency(leads.dealValue?.total)} />
                    </div>

                    <div className="mt-5 rounded-xl border border-transparent bg-green-500/5 p-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Target size={16} className="text-green-500" />

                                <span className="text-xs opacity-70">Lead Conversion</span>
                            </div>

                            <span className="text-lg font-bold">{leads.conversionRate || 0}%</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* ==================================================
                RECENT ACTIVITY + SOURCES
            ================================================== */}

            <section className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                {/* ==================================================
                    RECENT ACTIVITY
                ================================================== */}

                <div className="bg-app border-app rounded-2xl border p-4 sm:p-6">
                    <div className="mb-5 flex items-center gap-2">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-500/10 text-blue-500">
                            <Clock size={18} />
                        </div>

                        <div>
                            <h3 className="text-sm font-semibold sm:text-base">Recent Activity</h3>

                            <p className="text-[11px] opacity-60 sm:text-xs">Latest activity</p>
                        </div>
                    </div>

                    {recentActivity.length === 0 ? (
                        <EmptyState label="No recent activity" hint="Activity will appear here." />
                    ) : (
                        <div className="space-y-3">
                            {recentActivity.map((activity) => {
                                const config = ACTIVITY_STYLES[activity.type] || ACTIVITY_STYLES.lead;

                                const Icon = config.icon;

                                return (
                                    <div key={activity.id} className="flex items-center gap-3">
                                        <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${config.className}`}>
                                            <Icon size={15} />
                                        </div>

                                        <div className="min-w-0 flex-1">
                                            <p className="truncate text-sm font-medium">{activity.action}</p>

                                            <p className="truncate text-[11px] opacity-60">{activity.title}</p>
                                        </div>

                                        <span className="shrink-0 text-[10px] opacity-50">{timeAgo(activity.date)}</span>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* ==================================================
                    LEAD SOURCES
                ================================================== */}

                <div className="bg-app border-app rounded-2xl border p-4 sm:p-6">
                    <div className="mb-5 flex items-center gap-2">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-500/10 text-blue-500">
                            <UserPlus size={18} />
                        </div>

                        <div>
                            <h3 className="text-sm font-semibold sm:text-base">Lead Sources</h3>

                            <p className="text-[11px] opacity-60 sm:text-xs">Where your leads come from</p>
                        </div>
                    </div>

                    <div className="space-y-3">
                        {Object.entries(sources).length === 0 ? (
                            <EmptyState label="No source data" hint="Lead sources will appear here." />
                        ) : (
                            Object.entries(sources).map(([source, count]) => {
                                const total = leads.total || 0;

                                const percentage = total > 0 ? Math.round((count / total) * 100) : 0;

                                return (
                                    <div key={source} className="space-y-1">
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs">{formatLabel(source)}</span>

                                            <span className="text-xs font-semibold">{count}</span>
                                        </div>

                                        <div className="bg-surface h-1.5 overflow-hidden rounded-full">
                                            <div
                                                className="h-full rounded-full bg-blue-500"
                                                style={{
                                                    width: `${percentage}%`,
                                                }}
                                            />
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>
            </section>

            {/* ==================================================
                RECENT LEADS + TASKS
            ================================================== */}

            <section className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                <RecentLeads leads={recentLeads} />

                <RecentTasks tasks={recentTasks} />
            </section>
        </div>
    );
}

// ============================================================
// METRIC CARD
// ============================================================

function MetricCard({ icon: Icon, label, value, iconClass, iconBg }) {
    return (
        <div className="bg-app border-app rounded-xl border p-3 sm:p-4">
            <div className="flex items-center gap-3">
                <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${iconBg}`}>
                    <Icon size={17} className={iconClass} />
                </div>

                <div className="min-w-0">
                    <p className="truncate text-[11px] opacity-60">{label}</p>

                    <p className="text-xl font-bold">{value}</p>
                </div>
            </div>
        </div>
    );
}

// ============================================================
// SMALL STAT
// ============================================================

function SmallStat({ label, value, danger = false }) {
    return (
        <div className="border-app rounded-xl border p-3">
            <p className="text-[11px] opacity-60">{label}</p>

            <p className={`mt-1 text-lg font-bold ${danger ? 'text-red-500' : ''}`}>{value}</p>
        </div>
    );
}

// ============================================================
// VALUE CARD
// ============================================================

function ValueCard({ label, value }) {
    return (
        <div className="border-app rounded-xl border p-3">
            <p className="text-[11px] opacity-60">{label}</p>

            <p className="mt-1 text-lg font-bold">{value}</p>
        </div>
    );
}

// ============================================================
// RECENT LEADS
// ============================================================

function RecentLeads({ leads }) {
    return (
        <div className="bg-app border-app rounded-2xl border p-4 sm:p-6">
            <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/10 text-blue-500">
                        <UserPlus size={16} />
                    </div>

                    <div>
                        <h3 className="text-sm font-semibold sm:text-base">Recent Leads</h3>

                        <p className="text-[11px] opacity-60">Latest 5</p>
                    </div>
                </div>

                <Link href="/leads" className="text-muted hover-app flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-medium">
                    View all
                    <ArrowRight size={13} />
                </Link>
            </div>

            {leads.length === 0 ? (
                <EmptyState label="No leads yet" hint="Leads will appear here." />
            ) : (
                <div className="space-y-2">
                    {leads.map((lead) => (
                        <Link
                            key={lead._id}
                            href={`/leads/edit/${lead._id}`}
                            className="border-app hover-app flex items-center gap-3 rounded-xl border px-3 py-2.5 transition"
                        >
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-500/10 text-xs font-bold text-blue-500">
                                {(lead.name || 'L')
                                    .split(' ')
                                    .map((word) => word[0])
                                    .slice(0, 2)
                                    .join('')
                                    .toUpperCase()}
                            </div>

                            <div className="min-w-0 flex-1">
                                <p className="truncate text-sm font-medium">{lead.name || '—'}</p>

                                <p className="truncate text-[11px] opacity-60">
                                    {lead.assignedTo?.name ? `Assigned to ${lead.assignedTo.name}` : lead.phone || '—'}
                                </p>
                            </div>

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
    );
}

// ============================================================
// RECENT TASKS
// ============================================================

function RecentTasks({ tasks }) {
    return (
        <div className="bg-app border-app rounded-2xl border p-4 sm:p-6">
            <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-500/10 text-orange-500">
                        <ClipboardList size={16} />
                    </div>

                    <div>
                        <h3 className="text-sm font-semibold sm:text-base">Recent Tasks</h3>

                        <p className="text-[11px] opacity-60">Latest 5</p>
                    </div>
                </div>

                <Link href="/tasks" className="text-muted hover-app flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-medium">
                    View all
                    <ArrowRight size={13} />
                </Link>
            </div>

            {tasks.length === 0 ? (
                <EmptyState label="No tasks yet" hint="Tasks will appear here." />
            ) : (
                <div className="space-y-2">
                    {tasks.map((task) => (
                        <Link
                            key={task._id}
                            href={`/tasks/edit/${task._id}`}
                            className="border-app hover-app flex items-center gap-3 rounded-xl border px-3 py-2.5 transition"
                        >
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-orange-500/10 text-orange-500">
                                {task.status === 'completed' ? <CheckCircle2 size={15} /> : <Clock size={15} />}
                            </div>

                            <div className="min-w-0 flex-1">
                                <p className="truncate text-sm font-medium">{task.title || '—'}</p>

                                <p className="truncate text-[11px] opacity-60">
                                    {task.assignedTo?.name ? `Assigned to ${task.assignedTo.name}` : task.leadId?.name ? `Lead: ${task.leadId.name}` : '—'}
                                </p>
                            </div>

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
    );
}

// ============================================================
// EMPTY STATE
// ============================================================

function EmptyState({ label, hint }) {
    return (
        <div className="border-app flex flex-col items-center justify-center rounded-xl border px-4 py-8 text-center">
            <AlertCircle size={26} className="mb-2 opacity-30" />

            <p className="text-sm font-medium">{label}</p>

            <p className="mt-1 text-[11px] opacity-60">{hint}</p>
        </div>
    );
}

// ============================================================
// SKELETON
// ============================================================

function AnalyticsSkeleton() {
    return (
        <div className="mt-6 space-y-6 sm:mt-8">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {[1, 2, 3, 4].map((item) => (
                    <div key={item} className="border-app h-20 animate-pulse rounded-xl border" />
                ))}
            </div>

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                {[1, 2].map((item) => (
                    <div key={item} className="border-app h-80 animate-pulse rounded-2xl border" />
                ))}
            </div>

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                {[1, 2].map((item) => (
                    <div key={item} className="border-app h-64 animate-pulse rounded-2xl border" />
                ))}
            </div>
        </div>
    );
}
