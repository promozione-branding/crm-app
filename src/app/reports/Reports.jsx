
'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

import {
    BarChart3,
    Phone,
    CheckSquare,
    IndianRupee,
    Users,
    Calendar,
} from 'lucide-react';

// ============================================================
// CONSTANTS
// ============================================================

const ranges = [
    { value: 'today', label: 'Today' },
    { value: 'last_3_days', label: 'Last 3 Days' },
    { value: 'this_month', label: 'This Month' },
    { value: 'last_month', label: 'Last Month' },
    { value: 'last_3_months', label: 'Last 3 Months' },
    { value: 'custom', label: 'Custom Range' },
];

// ============================================================
// HELPERS
// ============================================================

const money = (value) =>
    `₹${Number(value || 0).toLocaleString('en-IN')}`;

const duration = (seconds) => {
    const total = Number(seconds || 0);

    const hours = Math.floor(total / 3600);
    const minutes = Math.floor((total % 3600) / 60);
    const secs = Math.floor(total % 60);

    if (hours) return `${hours}h ${minutes}m`;
    if (minutes) return `${minutes}m ${secs}s`;

    return `${secs}s`;
};

// ============================================================
// STAT CARD
// ============================================================

function StatCard({ icon: Icon, title, value }) {
    return (
        <div className="bg-app border-app min-w-0 rounded-xl border p-3 shadow-sm sm:p-4">
            <div className="flex min-w-0 items-center justify-between gap-2">
                <div className="min-w-0 flex-1">
                    <p className="text-muted break-words text-xs">
                        {title}
                    </p>

                    <p className="mt-1 break-words text-lg font-bold sm:text-xl">
                        {value}
                    </p>
                </div>

                <div className="shrink-0 rounded-lg bg-blue-500/10 p-2 sm:p-2.5">
                    <Icon size={20} className="text-blue-500" />
                </div>
            </div>
        </div>
    );
}

// ============================================================
// SECTION
// ============================================================

function Section({ title, children }) {
    return (
        <section className="mb-6 min-w-0">
            <h2 className="mb-3 text-base font-semibold sm:text-lg">
                {title}
            </h2>

            {children}
        </section>
    );
}

// ============================================================
// DETAIL CARD
// ============================================================

function DetailCard({ label, value }) {
    return (
        <div className="min-w-0">
            <p className="text-muted break-words text-xs">
                {label}
            </p>

            <p className="mt-1 break-words text-sm font-semibold sm:text-base">
                {value ?? 0}
            </p>
        </div>
    );
}

// ============================================================
// TEAM PERFORMANCE MOBILE CARD
// ============================================================

function TeamPerformanceCard({ user }) {
    return (
        <div className="bg-app border-app min-w-0 rounded-xl border p-4 shadow-sm">
            {/* USER */}
            <div className="border-app mb-4 min-w-0 border-b pb-3">
                <div className="flex min-w-0 items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-500/10 text-sm font-bold text-blue-500">
                        {(user.name || 'U')
                            .trim()
                            .charAt(0)
                            .toUpperCase()}
                    </div>

                    <div className="min-w-0 flex-1">
                        <h3 className="break-words text-base font-semibold">
                            {user.name || 'Unknown User'}
                        </h3>

                        {user.email && (
                            <p className="text-muted mt-1 break-all text-xs">
                                {user.email}
                            </p>
                        )}
                    </div>
                </div>
            </div>

            {/* LEADS AND DEALS */}
            <div className="grid min-w-0 grid-cols-2 gap-3">
                <div className="bg-surface min-w-0 rounded-lg p-3">
                    <p className="text-muted text-xs">
                        Total Leads
                    </p>

                    <p className="mt-1 break-words text-lg font-bold">
                        {user.leads || 0}
                    </p>
                </div>

                <div className="bg-surface min-w-0 rounded-lg p-3">
                    <p className="text-muted text-xs">
                        Won Deals
                    </p>

                    <p className="mt-1 break-words text-lg font-bold">
                        {user.won || 0}
                    </p>
                </div>

                <div className="bg-surface min-w-0 rounded-lg p-3">
                    <p className="text-muted text-xs">
                        Conversion Rate
                    </p>

                    <p className="mt-1 break-words text-lg font-bold">
                        {user.conversionRate || 0}%
                    </p>
                </div>

                <div className="bg-surface min-w-0 rounded-lg p-3">
                    <p className="text-muted text-xs">
                        Pipeline Value
                    </p>

                    <p className="mt-1 break-words text-base font-bold">
                        {money(user.pipelineValue)}
                    </p>
                </div>
            </div>

            {/* TASKS */}
            <div className="mt-4">
                <p className="text-muted mb-3 text-xs font-semibold uppercase tracking-wide">
                    Task Performance
                </p>

                <div className="space-y-3">
                    <div className="flex min-w-0 items-center justify-between gap-3">
                        <span className="text-muted text-sm">
                            Total Tasks
                        </span>

                        <span className="font-semibold">
                            {user.tasks || 0}
                        </span>
                    </div>

                    <div className="flex min-w-0 items-center justify-between gap-3">
                        <span className="text-muted text-sm">
                            Completed
                        </span>

                        <span className="font-semibold">
                            {user.tasksCompleted || 0}
                        </span>
                    </div>
                </div>
            </div>

            {/* CALLS */}
            <div className="border-app mt-4 border-t pt-4">
                <p className="text-muted mb-3 text-xs font-semibold uppercase tracking-wide">
                    Call Activity
                </p>

                <div className="space-y-3">
                    <div className="flex min-w-0 items-center justify-between gap-3">
                        <span className="text-muted text-sm">
                            Total Calls
                        </span>

                        <span className="font-semibold">
                            {user.calls || 0}
                        </span>
                    </div>

                    <div className="flex min-w-0 items-center justify-between gap-3">
                        <span className="text-muted text-sm">
                            Connected
                        </span>

                        <span className="font-semibold">
                            {user.callsConnected || 0}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}

// ============================================================
// LOADING SKELETON
// ============================================================

function ReportsSkeleton() {
    return (
        <div className="space-y-6">
            <div className="grid min-w-0 grid-cols-2 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4">
                {Array.from({ length: 8 }).map((_, index) => (
                    <div
                        key={index}
                        className="bg-app border-app h-24 min-w-0 animate-pulse rounded-xl border"
                    />
                ))}
            </div>

            <div className="bg-app border-app h-52 animate-pulse rounded-xl border" />

            <div className="bg-app border-app h-52 animate-pulse rounded-xl border" />
        </div>
    );
}

// ============================================================
// MAIN REPORTS COMPONENT
// ============================================================

export default function Reports() {
    const [range, setRange] = useState('this_month');
    const [from, setFrom] = useState('');
    const [to, setTo] = useState('');
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    // --------------------------------------------------------
    // FETCH REPORTS
    // --------------------------------------------------------

    useEffect(() => {
        if (range === 'custom' && (!from || !to)) {
            setLoading(false);
            return;
        }

        let cancelled = false;

        const fetchReports = async () => {
            try {
                setLoading(true);

                const params = { range };

                if (range === 'custom') {
                    params.from = from;
                    params.to = to;
                }

                const res = await axios.get('/api/user/reports', {
                    params,
                    withCredentials: true,
                });

                if (cancelled) return;

                if (res.data?.success) {
                    setData(res.data.data);
                } else {
                    toast.error(
                        res.data?.message || 'Failed to load reports.'
                    );
                }
            } catch (error) {
                if (cancelled) return;

                console.error('Failed to load reports:', error);

                toast.error(
                    error?.response?.data?.message ||
                        'Failed to load reports.'
                );
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        };

        fetchReports();

        return () => {
            cancelled = true;
        };
    }, [range, from, to]);

    // --------------------------------------------------------
    // REPORT DATA
    // --------------------------------------------------------

    const leads = data?.leads || {};
    const deals = data?.deals || {};
    const tasks = data?.tasks || {};
    const calls = data?.calls || {};

    // --------------------------------------------------------
    // UI
    // --------------------------------------------------------

    return (
        <div className="bg-surface text-app min-h-[calc(100vh-64px)] w-full min-w-0 max-w-full overflow-x-clip p-3 sm:p-4 md:p-6">
            {/* HEADER */}
            <div className="mb-6 min-w-0">
                <h1 className="text-2xl font-bold sm:text-3xl">
                    Reports
                </h1>

                <p className="text-muted mt-1 break-words text-xs sm:text-sm">
                    Analyze your CRM performance and activity.
                </p>
            </div>

            {/* DATE FILTER */}
            <div className="bg-app border-app mb-6 min-w-0 rounded-xl border p-3 shadow-sm sm:p-4">
                <div className="mb-3 flex items-center gap-2">
                    <Calendar
                        size={18}
                        className="shrink-0 text-blue-500"
                    />

                    <h2 className="font-semibold">
                        Report Period
                    </h2>
                </div>

                <div className="flex min-w-0 flex-wrap gap-2">
                    {ranges.map((item) => (
                        <button
                            key={item.value}
                            type="button"
                            onClick={() => setRange(item.value)}
                            className={`max-w-full whitespace-normal break-words rounded-lg border px-3 py-2 text-xs transition sm:text-sm ${
                                range === item.value
                                    ? 'border-blue-500 bg-blue-500 text-white'
                                    : 'border-app hover-app'
                            }`}
                        >
                            {item.label}
                        </button>
                    ))}
                </div>

                {/* CUSTOM DATE RANGE */}
                {range === 'custom' && (
                    <div className="mt-4 grid min-w-0 grid-cols-1 gap-3 sm:grid-cols-2">
                        <div className="min-w-0">
                            <label className="text-muted mb-1 block text-xs">
                                From
                            </label>

                            <input
                                type="date"
                                value={from}
                                max={to || undefined}
                                onChange={(e) => setFrom(e.target.value)}
                                className="border-app bg-surface text-app block w-full min-w-0 max-w-full rounded-lg border px-3 py-2 text-sm"
                            />
                        </div>

                        <div className="min-w-0">
                            <label className="text-muted mb-1 block text-xs">
                                To
                            </label>

                            <input
                                type="date"
                                value={to}
                                min={from || undefined}
                                onChange={(e) => setTo(e.target.value)}
                                className="border-app bg-surface text-app block w-full min-w-0 max-w-full rounded-lg border px-3 py-2 text-sm"
                            />
                        </div>
                    </div>
                )}
            </div>

            {/* LOADING */}
            {loading && <ReportsSkeleton />}

            {/* REPORT CONTENT */}
            {!loading && data && (
                <>
                    {/* OVERVIEW */}
                    <Section title="Overview">
                        <div className="grid min-w-0 grid-cols-2 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4">
                            <StatCard
                                icon={Users}
                                title="Total Leads"
                                value={leads.total || 0}
                            />

                            <StatCard
                                icon={IndianRupee}
                                title="Deal Value"
                                value={money(deals.totalValue)}
                            />

                            <StatCard
                                icon={Phone}
                                title="Total Calls"
                                value={calls.total || 0}
                            />

                            <StatCard
                                icon={CheckSquare}
                                title="Total Tasks"
                                value={tasks.total || 0}
                            />
                        </div>
                    </Section>

                    {/* DEALS AND PIPELINE */}
                    <Section title="Deal & Pipeline Report">
                        <div className="grid min-w-0 grid-cols-2 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4">
                            <StatCard
                                icon={IndianRupee}
                                title="Total Deal Value"
                                value={money(deals.totalValue)}
                            />

                            <StatCard
                                icon={IndianRupee}
                                title="Won Value"
                                value={money(deals.wonValue)}
                            />

                            <StatCard
                                icon={IndianRupee}
                                title="Lost Value"
                                value={money(deals.lostValue)}
                            />

                            <StatCard
                                icon={BarChart3}
                                title="Open Pipeline"
                                value={money(deals.openPipelineValue)}
                            />
                        </div>

                        {/* PIPELINE BREAKDOWN */}
                        <div className="bg-app border-app mt-4 min-w-0 rounded-xl border p-3 sm:p-4">
                            <h3 className="mb-4 font-semibold">
                                Pipeline
                            </h3>

                            {Object.entries(leads.pipeline || {}).length > 0 ? (
                                <div className="min-w-0 space-y-3">
                                    {Object.entries(leads.pipeline || {}).map(
                                        ([stage, value]) => (
                                            <div
                                                key={stage}
                                                className="border-app/50 flex min-w-0 flex-col gap-1 border-b pb-3 last:border-b-0 sm:flex-row sm:items-center sm:justify-between sm:gap-4"
                                            >
                                                <span className="min-w-0 break-words text-sm capitalize">
                                                    {stage.replace(/_/g, ' ')}
                                                </span>

                                                <div className="flex min-w-0 flex-wrap items-center gap-x-3 gap-y-1 text-xs sm:gap-4 sm:text-sm">
                                                    <span>
                                                        {value.count ?? 0} leads
                                                    </span>

                                                    <span className="break-words font-medium">
                                                        {money(value.value)}
                                                    </span>
                                                </div>
                                            </div>
                                        )
                                    )}
                                </div>
                            ) : (
                                <p className="text-muted text-sm">
                                    No pipeline data for this period.
                                </p>
                            )}

                            <div className="border-app mt-4 flex min-w-0 items-center justify-between gap-3 border-t pt-4 text-sm">
                                <span>Conversion Rate</span>

                                <strong className="shrink-0">
                                    {leads.conversionRate ?? 0}%
                                </strong>
                            </div>
                        </div>
                    </Section>

                    {/* CALL ACTIVITY */}
                    <Section title="Call Activity">
                        <div className="grid min-w-0 grid-cols-2 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4">
                            <StatCard
                                icon={Phone}
                                title="Total"
                                value={calls.total ?? 0}
                            />

                            <StatCard
                                icon={Phone}
                                title="Connected"
                                value={calls.completed ?? 0}
                            />

                            <StatCard
                                icon={Phone}
                                title="Missed"
                                value={calls.missed ?? 0}
                            />

                            <StatCard
                                icon={Phone}
                                title="Connection Rate"
                                value={`${calls.connectionRate || 0}%`}
                            />
                        </div>

                        <div className="bg-app border-app mt-4 grid min-w-0 grid-cols-2 gap-4 rounded-xl border p-3 sm:grid-cols-2 sm:p-4 lg:grid-cols-4">
                            <DetailCard
                                label="Initiated"
                                value={calls.initiated}
                            />

                            <DetailCard
                                label="Busy"
                                value={calls.busy}
                            />

                            <DetailCard
                                label="No Answer"
                                value={calls.no_answer}
                            />

                            <DetailCard
                                label="Failed"
                                value={calls.failed}
                            />

                            <DetailCard
                                label="Total Duration"
                                value={duration(calls.totalDuration)}
                            />

                            <DetailCard
                                label="Average Duration"
                                value={duration(calls.averageDuration)}
                            />
                        </div>
                    </Section>

                    {/* TASK OVERVIEW */}
                    <Section title="Task Overview">
                        <div className="grid min-w-0 grid-cols-2 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4">
                            <StatCard
                                icon={CheckSquare}
                                title="Total"
                                value={tasks.total ?? 0}
                            />

                            <StatCard
                                icon={CheckSquare}
                                title="Pending"
                                value={tasks.pending ?? 0}
                            />

                            <StatCard
                                icon={CheckSquare}
                                title="Completed"
                                value={tasks.completed ?? 0}
                            />

                            <StatCard
                                icon={CheckSquare}
                                title="Overdue"
                                value={tasks.overdue ?? 0}
                            />
                        </div>

                        <div className="bg-app border-app mt-4 grid min-w-0 grid-cols-2 gap-4 rounded-xl border p-3 sm:grid-cols-3 sm:p-4">
                            <DetailCard
                                label="Cancelled"
                                value={tasks.cancelled}
                            />

                            <DetailCard
                                label="Completed On Time"
                                value={tasks.completedOnTime}
                            />

                            <DetailCard
                                label="Completed Late"
                                value={tasks.completedLate}
                            />
                        </div>
                    </Section>

                    {/* TEAM / MY PERFORMANCE */}
                    {Array.isArray(data?.perUser) &&
                        data.perUser.length > 0 && (
                            <Section
                                title={
                                    data.isAdmin
                                        ? 'Team Performance'
                                        : 'My Performance'
                                }
                            >
                                {/* MOBILE: VERTICAL USER CARDS */}
                                <div className="space-y-3 md:hidden">
                                    {data.perUser.map((user) => (
                                        <TeamPerformanceCard
                                            key={String(user.userId)}
                                            user={user}
                                        />
                                    ))}
                                </div>

                                {/* DESKTOP: PERFORMANCE TABLE */}
                                <div className="bg-app border-app hidden overflow-hidden rounded-xl border md:block">
                                    <div className="w-full overflow-x-auto">
                                        <table className="w-full min-w-[900px] text-sm">
                                            <thead className="border-app border-b text-left">
                                                <tr className="text-muted text-xs uppercase tracking-wide">
                                                    <th className="px-4 py-3 font-medium">
                                                        User
                                                    </th>

                                                    <th className="px-4 py-3 text-right font-medium">
                                                        Leads
                                                    </th>

                                                    <th className="px-4 py-3 text-right font-medium">
                                                        Won
                                                    </th>

                                                    <th className="px-4 py-3 text-right font-medium">
                                                        Conv. Rate
                                                    </th>

                                                    <th className="px-4 py-3 text-right font-medium">
                                                        Pipeline Value
                                                    </th>

                                                    <th className="px-4 py-3 text-right font-medium">
                                                        Tasks
                                                    </th>

                                                    <th className="px-4 py-3 text-right font-medium">
                                                        Completed
                                                    </th>

                                                    <th className="px-4 py-3 text-right font-medium">
                                                        Calls
                                                    </th>

                                                    <th className="px-4 py-3 text-right font-medium">
                                                        Connected
                                                    </th>
                                                </tr>
                                            </thead>

                                            <tbody>
                                                {data.perUser.map((user) => (
                                                    <tr
                                                        key={String(user.userId)}
                                                        className="border-app hover-app border-b last:border-b-0"
                                                    >
                                                        <td className="max-w-[220px] px-4 py-3">
                                                            <div className="flex min-w-0 flex-col">
                                                                <span className="break-words font-medium">
                                                                    {user.name ||
                                                                        'Unknown User'}
                                                                </span>

                                                                {user.email && (
                                                                    <span className="text-muted break-all text-[11px]">
                                                                        {user.email}
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </td>

                                                        <td className="px-4 py-3 text-right">
                                                            {user.leads || 0}
                                                        </td>

                                                        <td className="px-4 py-3 text-right">
                                                            {user.won || 0}
                                                        </td>

                                                        <td className="px-4 py-3 text-right">
                                                            {user.conversionRate ||
                                                                0}
                                                            %
                                                        </td>

                                                        <td className="px-4 py-3 text-right">
                                                            {money(
                                                                user.pipelineValue
                                                            )}
                                                        </td>

                                                        <td className="px-4 py-3 text-right">
                                                            {user.tasks || 0}
                                                        </td>

                                                        <td className="px-4 py-3 text-right">
                                                            {user.tasksCompleted ||
                                                                0}
                                                        </td>

                                                        <td className="px-4 py-3 text-right">
                                                            {user.calls || 0}
                                                        </td>

                                                        <td className="px-4 py-3 text-right">
                                                            {user.callsConnected ||
                                                                0}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </Section>
                        )}

                    {/* EMPTY TEAM STATE */}
                    {Array.isArray(data?.perUser) &&
                        data.perUser.length === 0 && (
                            <Section
                                title={
                                    data.isAdmin
                                        ? 'Team Performance'
                                        : 'My Performance'
                                }
                            >
                                <div className="bg-app border-app rounded-xl border p-6 text-center">
                                    <Users
                                        size={28}
                                        className="text-muted mx-auto mb-2"
                                    />

                                    <p className="font-medium">
                                        No performance data available
                                    </p>

                                    <p className="text-muted mt-1 text-sm">
                                        No user activity was found for the
                                        selected period.
                                    </p>
                                </div>
                            </Section>
                        )}
                </>
            )}

            {/* NO DATA */}
            {!loading && !data && (
                <div className="bg-app border-app rounded-xl border p-6 text-center">
                    <BarChart3
                        size={32}
                        className="text-muted mx-auto mb-3"
                    />

                    <h2 className="font-semibold">
                        Reports unavailable
                    </h2>

                    <p className="text-muted mt-1 text-sm">
                        Report data could not be loaded. Please select a
                        report period again to retry.
                    </p>

                    <button
                        type="button"
                        onClick={() => {
                            // Trigger a new fetch by updating the range.
                            setRange((current) => {
                                const currentIndex = ranges.findIndex(
                                    (item) => item.value === current
                                );

                                return ranges[
                                    (currentIndex + 1) % ranges.length
                                ].value;
                            });
                        }}
                        className="mt-4 rounded-lg bg-blue-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-600"
                    >
                        Try another period
                    </button>
                </div>
            )}
        </div>
    );
}