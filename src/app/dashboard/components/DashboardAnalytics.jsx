// src/app/dashboard/components/DashboardAnalytics.jsx

'use client';

// ============================================================
// CHART ITEMS
// ============================================================

const chartItems = [
    {
        key: 'users',
        label: 'Users',
        color: '#3b82f6',
    },
    {
        key: 'leads',
        label: 'Leads',
        color: '#22c55e',
    },
    {
        key: 'calls',
        label: 'Calls',
        color: '#a855f7',
    },
    {
        key: 'tasks',
        label: 'Tasks',
        color: '#f97316',
    },
];

// ============================================================
// COMPONENT
// ============================================================

export default function DashboardAnalytics({ stats, loading }) {
    const total = Number(stats.users || 0) + Number(stats.leads || 0) + Number(stats.calls || 0) + Number(stats.tasks || 0);

    const radius = 72;

    const circumference = 2 * Math.PI * radius;

    let accumulated = 0;

    return (
        <section className="bg-app border-app mt-6 rounded-2xl border p-4 sm:mt-8 sm:p-6">
            {/* ==================================================
                HEADER
            ================================================== */}

            <div className="mb-5 sm:mb-6">
                <h2 className="text-lg font-semibold sm:text-xl">Analytics</h2>

                <p className="mt-1 text-xs opacity-60 sm:text-sm">Overview of your CRM data</p>
            </div>

            {/* ==================================================
                ANALYTICS CONTENT
            ================================================== */}

            <div className="grid grid-cols-1 items-center gap-6 lg:grid-cols-2 lg:gap-10">
                {/* ==================================================
                    DONUT CHART
                ================================================== */}

                <div className="flex justify-center">
                    <div className="relative h-[220px] w-[220px] sm:h-[260px] sm:w-[260px]">
                        {loading ? (
                            <div className="border-surface absolute inset-0 animate-pulse rounded-full border-[24px] sm:border-[28px]" />
                        ) : total === 0 ? (
                            <div className="border-surface absolute inset-0 rounded-full border-[24px] sm:border-[28px]" />
                        ) : (
                            <svg viewBox="0 0 200 200" className="h-full w-full -rotate-90">
                                {/* ==================================================
                                    BACKGROUND
                                ================================================== */}

                                <circle cx="100" cy="100" r={radius} fill="none" stroke="currentColor" strokeWidth="26" className="text-surface" />

                                {/* ==================================================
                                    DONUT SEGMENTS
                                ================================================== */}

                                {chartItems.map((item) => {
                                    const value = Number(stats[item.key] || 0);

                                    if (value <= 0 || total <= 0) {
                                        return null;
                                    }

                                    const percentage = value / total;

                                    const segmentLength = percentage * circumference;

                                    const dashOffset = -accumulated;

                                    accumulated += segmentLength;

                                    return (
                                        <circle
                                            key={item.key}
                                            cx="100"
                                            cy="100"
                                            r={radius}
                                            fill="none"
                                            stroke={item.color}
                                            strokeWidth="26"
                                            strokeDasharray={`${segmentLength} ${circumference - segmentLength}`}
                                            strokeDashoffset={dashOffset}
                                            strokeLinecap="butt"
                                        />
                                    );
                                })}
                            </svg>
                        )}

                        {/* ==================================================
                          CENTER TEXT
                        ================================================== */}

                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className="text-xs opacity-60">Total</span>

                            <span className="mt-1 text-2xl font-bold sm:text-3xl">{loading ? '—' : total}</span>

                            <span className="mt-1 text-xs opacity-50">Records</span>
                        </div>
                    </div>
                </div>

                {/* ==================================================
                    LEGEND / DETAILS
                ================================================== */}

                <div className="space-y-3 sm:space-y-4">
                    {chartItems.map((item) => {
                        const value = Number(stats[item.key] || 0);

                        const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : '0.0';

                        return (
                            <div key={item.key} className="border-app flex items-center justify-between gap-3 rounded-xl border p-3 sm:p-4">
                                {/* ==================================================
                                        LABEL
                                    ================================================== */}

                                <div className="flex min-w-0 items-center gap-3">
                                    <span
                                        className="h-3 w-3 shrink-0 rounded-full"
                                        style={{
                                            backgroundColor: item.color,
                                        }}
                                    />

                                    <span className="truncate text-sm font-medium">{item.label}</span>
                                </div>

                                {/* ==================================================
                                        VALUE
                                    ================================================== */}

                                <div className="flex shrink-0 items-center gap-3 sm:gap-5">
                                    <span className="text-xs opacity-60 sm:text-sm">{percentage}%</span>

                                    <span className="min-w-[32px] text-right font-semibold">{loading ? '—' : value}</span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
