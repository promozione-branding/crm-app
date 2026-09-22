// src/app/notifications/page.jsx

'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { Bell, User as UserIcon, CheckCircle2, Filter } from 'lucide-react';


export default function NotificationsHistoryPage() {
    const router = useRouter();

    const [data, setData] = useState([]);
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 25,
        total: 0,
        totalPages: 1,
    });

    const [loading, setLoading] = useState(true);

    const [filters, setFilters] = useState({
        type: '',
        isRead: '',
    });

    const load = useCallback(
        async (page = 1) => {
            try {
                setLoading(true);

                const params = {
                    page,
                    limit: pagination.limit,
                };

                if (filters.type) params.type = filters.type;
                if (filters.isRead !== '') params.isRead = filters.isRead;

                const res = await axios.get('/api/user/notification/history', {
                    params,
                    withCredentials: true,
                });

                setData(res.data?.data?.notifications || []);
                setPagination(res.data?.data?.pagination || {});
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        },
        [filters, pagination.limit]
    );

    useEffect(() => {
        load(1);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filters]);

    const handleOpen = async (n) => {
        // mark read
        if (!n.isRead) {
            try {
                await axios.patch(
                    `/api/user/notification/${n._id}`,
                    {},
                    { withCredentials: true }
                );

                setData((prev) =>
                    prev.map((x) => (x._id === n._id ? { ...x, isRead: true } : x))
                );
            } catch (err) {
                // silent
            }
        }

        if (n.refModel === 'Lead') router.push(`/leads/edit/${n.refId}`);
        else if (n.refModel === 'LeadTask') router.push(`/tasks/edit/${n.refId}`);
    };

    return (
        <div className="bg-surface text-app min-h-[calc(100vh-64px)] p-6">
            <div className="mx-auto max-w-4xl">
                {/* Header */}
                <div className="mb-6 flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">Notifications</h1>
                        <p className="text-muted text-sm">All your lead and task notifications</p>
                    </div>
                </div>

                {/* Filters */}
                <div className="border-app bg-app mb-4 flex flex-wrap items-center gap-3 rounded-xl border p-4">
                    <Filter size={16} className="text-muted" />

                    <select
                        value={filters.type}
                        onChange={(e) => setFilters((p) => ({ ...p, type: e.target.value }))}
                        className="border-app bg-surface text-app rounded-lg border px-3 py-2 text-sm"
                    >
                        <option value="">All types</option>
                        <option value="lead">Leads</option>
                        <option value="task">Tasks</option>
                    </select>

                    <select
                        value={filters.isRead}
                        onChange={(e) => setFilters((p) => ({ ...p, isRead: e.target.value }))}
                        className="border-app bg-surface text-app rounded-lg border px-3 py-2 text-sm"
                    >
                        <option value="">All statuses</option>
                        <option value="false">Unread only</option>
                        <option value="true">Read only</option>
                    </select>

                    <div className="text-muted ml-auto text-xs">
                        Total: {pagination.total || 0}
                    </div>
                </div>

                {/* List */}
                {loading ? (
    <div className="border-app bg-app text-muted rounded-xl border p-10 text-center text-sm">
        Loading notifications...
    </div>
) : data.length === 0 ? (
                    <div className="border-app bg-app rounded-xl border p-10 text-center">
                        <Bell size={40} className="text-muted mx-auto mb-3 opacity-40" />
                        <p className="text-muted text-sm">No notifications found.</p>
                    </div>
                ) : (
                    <div className="border-app bg-app overflow-hidden rounded-xl border">
                        {data.map((n) => {
                            const isLead = n.refModel === 'Lead';

                            return (
                                <button
                                    key={n._id}
                                    onClick={() => handleOpen(n)}
                                    className={`border-app flex w-full items-start gap-3 border-b px-4 py-4 text-left transition last:border-b-0 ${
                                        !n.isRead ? 'bg-blue-500/5' : ''
                                    } hover:bg-blue-500/10`}
                                >
                                    <div
                                        className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
                                            isLead
                                                ? 'bg-blue-500/10 text-blue-500'
                                                : 'bg-emerald-500/10 text-emerald-500'
                                        }`}
                                    >
                                        {isLead ? <UserIcon size={16} /> : <CheckCircle2 size={16} />}
                                    </div>

                                    <div className="min-w-0 flex-1">
                                        <div className="flex items-center gap-2">
                                            <p className="text-app truncate text-sm font-semibold">
                                                {n.title}
                                            </p>
                                            {!n.isRead && (
                                                <span className="rounded-full bg-blue-500 px-2 py-0.5 text-[10px] font-bold text-white">
                                                    New
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-muted mt-0.5 text-sm">{n.message}</p>
                                        <p className="text-muted mt-1 text-[11px]">
                                            {new Date(n.createdAt).toLocaleString('en-IN', {
                                                day: '2-digit',
                                                month: 'short',
                                                year: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit',
                                            })}
                                        </p>
                                    </div>

                                    <span
                                        className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase ${
                                            isLead
                                                ? 'bg-blue-500/10 text-blue-500'
                                                : 'bg-emerald-500/10 text-emerald-500'
                                        }`}
                                    >
                                        {isLead ? 'Lead' : 'Task'}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                )}

                {/* Pagination */}
                {pagination.totalPages > 1 && (
                    <div className="mt-5 flex items-center justify-center gap-2">
                        <button
                            disabled={pagination.page <= 1}
                            onClick={() => load(pagination.page - 1)}
                            className="border-app bg-app hover-app rounded-lg border px-4 py-2 text-sm disabled:opacity-40"
                        >
                            Previous
                        </button>

                        <span className="text-muted text-sm">
                            Page {pagination.page} of {pagination.totalPages}
                        </span>

                        <button
                            disabled={pagination.page >= pagination.totalPages}
                            onClick={() => load(pagination.page + 1)}
                            className="border-app bg-app hover-app rounded-lg border px-4 py-2 text-sm disabled:opacity-40"
                        >
                            Next
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}