// src/app/reports/Reports.jsx

'use client';

import React, { useEffect, useState } from 'react';

import axios from 'axios';
import toast from 'react-hot-toast';

import { BarChart3, Phone, CheckSquare, IndianRupee, Users, Calendar } from 'lucide-react';

const ranges = [
    {
        value: 'today',
        label: 'Today',
    },
    {
        value: 'last_3_days',
        label: 'Last 3 Days',
    },
    {
        value: 'this_month',
        label: 'This Month',
    },
    {
        value: 'last_month',
        label: 'Last Month',
    },
    {
        value: 'last_3_months',
        label: 'Last 3 Months',
    },
    {
        value: 'custom',
        label: 'Custom Range',
    },
];

const money = (value) => `₹${Number(value || 0).toLocaleString('en-IN')}`;

const duration = (seconds) => {
    const total = Number(seconds || 0);

    const hours = Math.floor(total / 3600);

    const minutes = Math.floor((total % 3600) / 60);

    const secs = Math.floor(total % 60);

    if (hours) {
        return `${hours}h ${minutes}m`;
    }

    if (minutes) {
        return `${minutes}m ${secs}s`;
    }

    return `${secs}s`;
};

function StatCard({ icon: Icon, title, value }) {
    return (
        <div className="bg-app border-app rounded-xl border p-4 shadow-sm">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-muted text-xs">{title}</p>

                    <p className="mt-1 text-xl font-bold">{value}</p>
                </div>

                <div className="rounded-lg bg-blue-500/10 p-2.5">
                    <Icon size={20} className="text-blue-500" />
                </div>
            </div>
        </div>
    );
}

function Section({ title, children }) {
    return (
        <section className="mb-6">
            <h2 className="mb-3 text-lg font-semibold">{title}</h2>

            {children}
        </section>
    );
}

export default function Reports() {
    const [range, setRange] = useState('this_month');

    const [from, setFrom] = useState('');

    const [to, setTo] = useState('');

    const [data, setData] = useState(null);

    const [loading, setLoading] = useState(true);

    const fetchReports = async () => {
        try {
            setLoading(true);

            const params = {
                range,
            };

            if (range === 'custom') {
                params.from = from;
                params.to = to;
            }

            const res = await axios.get('/api/user/reports', {
                params,
                withCredentials: true,
            });

            if (res.data?.success) {
                setData(res.data.data);
            }
        } catch (error) {
            console.error('Failed to load reports:', error);

            toast.error(error?.response?.data?.message || 'Failed to load reports.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (range === 'custom' && (!from || !to)) {
            return;
        }

        fetchReports();
    }, [range, from, to]);

    const leads = data?.leads || {};

    const deals = data?.deals || {};

    const tasks = data?.tasks || {};

    const calls = data?.calls || {};

    return (
        <div className="bg-surface text-app min-h-[calc(100vh-64px)] p-3 sm:p-4 md:p-6">
            {/* HEADER */}

            <div className="mb-6">
                <h1 className="text-2xl font-bold sm:text-3xl">Reports</h1>

                <p className="mt-1 text-xs opacity-70 sm:text-sm">Analyze your CRM performance and activity.</p>
            </div>

            {/* DATE FILTER */}

            <div className="bg-app border-app mb-6 rounded-xl border p-4 shadow-sm">
                <div className="mb-3 flex items-center gap-2">
                    <Calendar size={18} className="text-blue-500" />

                    <h2 className="font-semibold">Report Period</h2>
                </div>

                <div className="flex flex-wrap gap-2">
                    {ranges.map((item) => (
                        <button
                            key={item.value}
                            type="button"
                            onClick={() => setRange(item.value)}
                            className={`rounded-lg border px-3 py-2 text-sm transition ${
                                range === item.value ? 'border-blue-500 bg-blue-500 text-white' : 'border-app hover-app'
                            }`}
                        >
                            {item.label}
                        </button>
                    ))}
                </div>

                {range === 'custom' && (
                    <div className="mt-4 grid gap-3 sm:grid-cols-2">
                        <div>
                            <label className="text-muted mb-1 block text-xs">From</label>

                            <input
                                type="date"
                                value={from}
                                onChange={(e) => setFrom(e.target.value)}
                                className="border-app bg-surface text-app w-full rounded-lg border px-3 py-2 text-sm"
                            />
                        </div>

                        <div>
                            <label className="text-muted mb-1 block text-xs">To</label>

                            <input
                                type="date"
                                value={to}
                                onChange={(e) => setTo(e.target.value)}
                                className="border-app bg-surface text-app w-full rounded-lg border px-3 py-2 text-sm"
                            />
                        </div>
                    </div>
                )}
            </div>

            {/* LOADING */}

            {loading && (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {Array.from({
                        length: 8,
                    }).map((_, index) => (
                        <div key={index} className="bg-app border-app h-24 animate-pulse rounded-xl border" />
                    ))}
                </div>
            )}

            {!loading && data && (
                <>
                    {/* OVERVIEW */}

                    <Section title="Overview">
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                            <StatCard icon={Users} title="Total Leads" value={leads.total || 0} />

                            <StatCard icon={IndianRupee} title="Deal Value" value={money(deals.totalValue)} />

                            <StatCard icon={Phone} title="Total Calls" value={calls.total || 0} />

                            <StatCard icon={CheckSquare} title="Total Tasks" value={tasks.total || 0} />
                        </div>
                    </Section>

                    {/* DEALS */}

                    <Section title="Deal & Pipeline Report">
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                            <StatCard icon={IndianRupee} title="Total Deal Value" value={money(deals.totalValue)} />

                            <StatCard icon={IndianRupee} title="Won Value" value={money(deals.wonValue)} />

                            <StatCard icon={IndianRupee} title="Lost Value" value={money(deals.lostValue)} />

                            <StatCard icon={BarChart3} title="Open Pipeline" value={money(deals.openPipelineValue)} />
                        </div>

                        <div className="bg-app border-app mt-4 rounded-xl border p-4">
                            <h3 className="mb-4 font-semibold">Pipeline</h3>

                            <div className="space-y-3">
                                {Object.entries(leads.pipeline || {}).map(([stage, value]) => (
                                    <div key={stage} className="flex items-center justify-between gap-4">
                                        <span className="text-sm capitalize">{stage.replace(/_/g, ' ')}</span>

                                        <div className="flex items-center gap-4 text-sm">
                                            <span>{value.count} leads</span>

                                            <span className="font-medium">{money(value.value)}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="border-app mt-4 flex justify-between border-t pt-4 text-sm">
                                <span>Conversion Rate</span>

                                <strong>{leads.conversionRate}%</strong>
                            </div>
                        </div>
                    </Section>

                    {/* CALLS */}

                    <Section title="Call Activity">
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                            <StatCard icon={Phone} title="Total" value={calls.total} />

                            <StatCard icon={Phone} title="Connected" value={calls.completed} />

                            <StatCard icon={Phone} title="Missed" value={calls.missed} />

                            <StatCard icon={Phone} title="Connection Rate" value={`${calls.connectionRate || 0}%`} />
                        </div>

                        <div className="bg-app border-app mt-4 grid gap-4 rounded-xl border p-4 sm:grid-cols-2 lg:grid-cols-4">
                            <div>
                                <p className="text-muted text-xs">Initiated</p>
                                <p className="mt-1 font-semibold">{calls.initiated}</p>
                            </div>

                            <div>
                                <p className="text-muted text-xs">Busy</p>
                                <p className="mt-1 font-semibold">{calls.busy}</p>
                            </div>

                            <div>
                                <p className="text-muted text-xs">No Answer</p>
                                <p className="mt-1 font-semibold">{calls.no_answer}</p>
                            </div>

                            <div>
                                <p className="text-muted text-xs">Failed</p>
                                <p className="mt-1 font-semibold">{calls.failed}</p>
                            </div>

                            <div>
                                <p className="text-muted text-xs">Total Duration</p>
                                <p className="mt-1 font-semibold">{duration(calls.totalDuration)}</p>
                            </div>

                            <div>
                                <p className="text-muted text-xs">Average Duration</p>
                                <p className="mt-1 font-semibold">{duration(calls.averageDuration)}</p>
                            </div>
                        </div>
                    </Section>

                    {/* TASKS */}

                    <Section title="Task Overview">
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                            <StatCard icon={CheckSquare} title="Total" value={tasks.total} />

                            <StatCard icon={CheckSquare} title="Pending" value={tasks.pending} />

                            <StatCard icon={CheckSquare} title="Completed" value={tasks.completed} />

                            <StatCard icon={CheckSquare} title="Overdue" value={tasks.overdue} />
                        </div>

                        <div className="bg-app border-app mt-4 grid gap-4 rounded-xl border p-4 sm:grid-cols-3">
                            <div>
                                <p className="text-muted text-xs">Cancelled</p>

                                <p className="mt-1 font-semibold">{tasks.cancelled}</p>
                            </div>

                            <div>
                                <p className="text-muted text-xs">Completed On Time</p>

                                <p className="mt-1 font-semibold">{tasks.completedOnTime}</p>
                            </div>

                            <div>
                                <p className="text-muted text-xs">Completed Late</p>

                                <p className="mt-1 font-semibold">{tasks.completedLate}</p>
                            </div>
                        </div>
                    </Section>
                </>
            )}
        </div>
    );
}
