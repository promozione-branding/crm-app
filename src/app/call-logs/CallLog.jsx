// src/app/call-logs/CallLog.jsx

'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { PhoneOff, Search, Filter, Phone, User as UserIcon, Calendar, ChevronDown, ChevronUp } from 'lucide-react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import toast from 'react-hot-toast';

import Dashboarddata from '../../app/dashboard/components/Dashboarddata';
import DynamicTable from '@/components/user/ui/DynamicTable';

// ============================================================
// STATUS BADGE
// ============================================================

const statusStyles = {
    initiated: 'bg-blue-500/10 text-blue-600',
    completed: 'bg-green-500/10 text-green-600',
    missed: 'bg-red-500/10 text-red-600',
    busy: 'bg-yellow-500/10 text-yellow-600',
    no_answer: 'bg-orange-500/10 text-orange-600',
    failed: 'bg-gray-500/10 text-gray-600',
};

const formatLabel = (val) => {
    if (!val) return '—';
    return val.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
};

function CallStatusBadge({ status }) {
    const cls = statusStyles[status?.toLowerCase()] || 'bg-gray-500/10 text-gray-600';
    return <span className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-medium ${cls}`}>{formatLabel(status)}</span>;
}

// ============================================================
// COLUMNS (desktop)
// ============================================================

const columns = [
    {
        key: 'callerId.name',
        label: 'Called By',
        sortable: true,
        render: (row) => (
            <div className="flex flex-col">
                <span className="font-medium">{row.callerId?.name || '—'}</span>
                {row.callerRole && <span className="text-[10px] opacity-60">{row.callerRole}</span>}
            </div>
        ),
    },
    {
        key: 'refId.name',
        label: 'Lead',
        sortable: true,
        render: (row) => (
            <div className="flex flex-col">
                <span className="font-medium">{row.refId?.name || '—'}</span>
                {row.refId?.phone && <span className="text-[10px] opacity-60">{row.refId.phone}</span>}
            </div>
        ),
    },
    {
        key: 'phoneNumber',
        label: 'Number',
        sortable: false,
    },
    {
        key: 'status',
        label: 'Status',
        sortable: true,
        render: (row) => <CallStatusBadge status={row.status} />,
    },
    {
        key: 'durationSeconds',
        label: 'Duration',
        sortable: true,
        render: (row) => {
            const s = Number(row.durationSeconds) || 0;
            if (!s) return '—';
            const m = Math.floor(s / 60);
            const sec = s % 60;
            return `${m}m ${sec}s`;
        },
    },
    {
        key: 'calledAt',
        label: 'Called At',
        type: 'date',
        sortable: true,
    },
    {
        key: 'source',
        label: 'Source',
        sortable: false,
        render: (row) => <span className="capitalize">{formatLabel(row.source)}</span>,
    },
];

// ============================================================
// MOBILE CARD
// ============================================================

function MobileCallCard({ call, router }) {
    const [expanded, setExpanded] = useState(false);

    const durationSec = Number(call.durationSeconds) || 0;
    const durationText = durationSec ? `${Math.floor(durationSec / 60)}m ${durationSec % 60}s` : '—';

    const handleOpenLead = () => {
        const leadId = call?.refId?._id;
        if (leadId) router.push(`/leads/edit/${leadId}`);
    };

    return (
        <div className="border-app bg-app overflow-hidden rounded-xl border shadow-sm">
            {/* MAIN ROW */}
            <div
                role="button"
                tabIndex={0}
                onClick={() => setExpanded((v) => !v)}
                onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        setExpanded((v) => !v);
                    }
                }}
                className="hover-app w-full cursor-pointer px-4 py-3.5 text-left transition"
            >
                <div className="flex min-w-0 items-center gap-3">
                    {/* LEAD + CALLER */}
                    <div className="min-w-0 flex-1">
                        <div className="flex h-6 min-w-0 items-center gap-2">
                            <h3 className="min-w-0 truncate text-sm font-semibold">{call.refId?.name || 'Unknown Lead'}</h3>
                        </div>

                        <div className="mt-1.5 flex h-6 min-w-0 items-center gap-2 text-[11px] opacity-70">
                            <UserIcon size={11} className="shrink-0" />
                            <span className="truncate">
                                {call.callerId?.name || '—'}
                                {call.callerRole ? ` · ${call.callerRole}` : ''}
                            </span>
                        </div>
                    </div>

                    {/* STATUS + EXPAND */}
                    <div className="flex shrink-0 items-center gap-2">
                        <CallStatusBadge status={call.status} />

                        <div className="flex w-5 items-center justify-center opacity-50">{expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}</div>
                    </div>
                </div>
            </div>

            {/* EXPANDED */}
            {expanded && (
                <div className="border-app bg-surface border-t">
                    <div className="space-y-3 p-4">
                        <DetailRow
                            icon={Phone}
                            label="Number"
                            value={
                                call.phoneNumber ? (
                                    <a href={`tel:${call.phoneNumber}`} className="text-blue-500 hover:underline">
                                        {call.phoneNumber}
                                    </a>
                                ) : (
                                    '—'
                                )
                            }
                        />

                        <DetailRow icon={Calendar} label="Called At" value={call.calledAt ? new Date(call.calledAt).toLocaleString('en-IN') : '—'} />

                        <DetailRow label="Duration" value={durationText} />
                        <DetailRow label="Source" value={formatLabel(call.source)} />
                        <DetailRow label="Outcome" value={formatLabel(call.outcome)} />

                        {call.notes && (
                            <div>
                                <p className="text-muted mb-1 text-xs">Notes</p>
                                <p className="text-app text-sm whitespace-pre-wrap">{call.notes}</p>
                            </div>
                        )}

                        {call.refId?._id && (
                            <button type="button" onClick={handleOpenLead} className="btn-primary mt-2 w-full rounded-lg py-2.5 text-sm font-medium">
                                View Lead
                            </button>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

function DetailRow({ icon: Icon, label, value }) {
    return (
        <div className="flex items-start justify-between gap-4">
            <span className="flex items-center gap-1.5 text-sm opacity-60">
                {Icon && <Icon size={13} />}
                {label}
            </span>

            <span className="max-w-[60%] text-right text-sm break-words">{value || '—'}</span>
        </div>
    );
}

// ============================================================
// MOBILE PAGINATION
// ============================================================

function MobilePagination({ page, setPage, total, rowsPerPage, setRowsPerPage }) {
    const totalPages = Math.ceil(total / rowsPerPage);
    const startItem = total > 0 ? (page - 1) * rowsPerPage + 1 : 0;
    const endItem = total > 0 ? Math.min(page * rowsPerPage, total) : 0;

    const go = (n) => {
        if (n < 1) return;
        if (totalPages > 0 && n > totalPages) return;
        setPage?.(n);
    };

    return (
        <div className="border-app bg-app flex flex-col gap-3 rounded-xl border px-4 py-3 text-sm">
            <p className="text-center opacity-70">{total > 0 ? `Showing ${startItem}-${endItem} of ${total}` : 'Showing 0 of 0'}</p>

            <div className="flex items-center justify-between gap-2">
                {setRowsPerPage && (
                    <select
                        value={rowsPerPage}
                        onChange={(e) => {
                            setRowsPerPage?.(Number(e.target.value));
                            setPage?.(1);
                        }}
                        className="border-app bg-app text-app rounded-lg border px-2 py-2"
                    >
                        <option value={25}>25</option>
                        <option value={50}>50</option>
                        <option value={75}>75</option>
                        <option value={100}>100</option>
                    </select>
                )}

                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        disabled={page <= 1}
                        onClick={() => go(page - 1)}
                        className={`border-app h-9 rounded-lg border px-3 ${page <= 1 ? 'cursor-not-allowed opacity-50' : 'hover-app'}`}
                    >
                        Prev
                    </button>

                    <button type="button" className="h-8 rounded-lg bg-blue-600 px-3 text-white">
                        {page}
                    </button>

                    <button
                        type="button"
                        disabled={totalPages === 0 || page >= totalPages}
                        onClick={() => go(page + 1)}
                        className={`border-app h-9 rounded-lg border px-3 ${
                            totalPages === 0 || page >= totalPages ? 'cursor-not-allowed opacity-50' : 'hover-app'
                        }`}
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
}

// ============================================================
// MAIN COMPONENT
// ============================================================

export default function CallLog() {
    const router = useRouter();

    const [calls, setCalls] = useState([]);
    const [loading, setLoading] = useState(true);
    const [total, setTotal] = useState(0);

    const [page, setPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(25);

    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('');

    // ========================================================
    // FETCH
    // ========================================================

    const fetchCalls = useCallback(async () => {
        try {
            setLoading(true);

            const params = {
                page,
                limit: rowsPerPage,
                search: search.trim() || undefined,
                status: statusFilter || undefined,
            };

            const res = await axios.get('/api/user/call', {
                params,
                withCredentials: true,
            });

            const payload = res.data?.data || {};

            setCalls(payload.calls || []);
            setTotal(payload.pagination?.total || 0);
        } catch (error) {
            console.error('Fetch calls error:', error);
            toast.error(error.response?.data?.message || 'Failed to load calls.');
        } finally {
            setLoading(false);
        }
    }, [page, rowsPerPage, search, statusFilter]);

    useEffect(() => {
        fetchCalls();
    }, [fetchCalls]);

    // Debounced search
    useEffect(() => {
        const t = setTimeout(() => {
            setPage(1);
        }, 400);
        return () => clearTimeout(t);
    }, [search, statusFilter]);

    // ========================================================
    // ROW ACTION
    // ========================================================

    const handleRowAction = (row) => {
        const leadId = row?.refId?._id;
        if (leadId) {
            router.push(`/leads/edit/${leadId}`);
        }
    };

    // ========================================================
    // UI
    // ========================================================

    return (
        <div className="bg-surface text-app min-h-[calc(100vh-64px)] p-3 sm:p-4 md:p-6">
            {/* ---------- HEADER (stats) ---------- */}
            <div className="mb-4 sm:mb-5 md:mb-6">
                <div className="border-app bg-app w-full overflow-hidden rounded-xl border px-2 py-2 shadow-sm sm:rounded-2xl sm:px-4 sm:py-3">
                    <Dashboarddata />
                </div>
            </div>

            {/* ---------- FILTERS ---------- */}
            <div className="border-app bg-app mb-4 flex flex-col gap-3 rounded-xl border p-3 sm:flex-row sm:flex-wrap sm:items-center sm:p-4">
                {/* SEARCH */}
                <div className="relative w-full flex-1 sm:min-w-[200px]">
                    <Search size={16} className="text-muted absolute top-1/2 left-3 -translate-y-1/2" />
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search number, notes..."
                        className="border-app bg-surface text-app w-full rounded-lg border py-2 pr-3 pl-9 text-sm"
                    />
                </div>

                {/* STATUS */}
                <div className="flex w-full items-center gap-2 sm:w-auto">
                    <Filter size={14} className="text-muted shrink-0" />
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="border-app bg-surface text-app w-full rounded-lg border px-3 py-2 text-sm sm:w-auto"
                    >
                        <option value="">All statuses</option>
                        <option value="initiated">Initiated</option>
                        <option value="completed">Completed</option>
                        <option value="missed">Missed</option>
                        <option value="busy">Busy</option>
                        <option value="no_answer">No Answer</option>
                        <option value="failed">Failed</option>
                    </select>
                </div>
            </div>

            {/* ---------- LOADING SKELETON (mobile/tablet) ---------- */}
            {loading && (
                <>
                    <div className="space-y-3 md:hidden">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="border-app bg-app h-20 w-full animate-pulse rounded-xl border" />
                        ))}
                    </div>

                    <div className="hidden md:block">
                        <DynamicTable
                            loading
                            columns={columns}
                            data={[]}
                            page={page}
                            setPage={setPage}
                            total={0}
                            rowsPerPage={rowsPerPage}
                            setRowsPerPage={setRowsPerPage}
                            onAction={handleRowAction}
                        />
                    </div>
                </>
            )}

            {/* ---------- EMPTY STATE ---------- */}
            {!loading && calls.length === 0 && (
                <div className="bg-app border-app flex min-h-[calc(100vh-280px)] w-full items-center justify-center rounded-xl border px-4 py-10 sm:min-h-[400px] sm:rounded-2xl sm:px-6 sm:py-12">
                    <div className="w-full max-w-md text-center">
                        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-500/10 sm:mb-6 sm:h-20 sm:w-20">
                            <PhoneOff size={32} className="text-green-500 sm:hidden" />
                            <PhoneOff size={40} className="hidden text-green-500 sm:block" />
                        </div>

                        <h2 className="mb-2 text-lg font-semibold sm:text-xl">No Call Logs Found</h2>

                        <p className="mx-auto text-xs leading-5 opacity-70 sm:text-sm sm:leading-6">
                            Your call history is empty. Once calls are made or received through the CRM, they'll appear here for easy tracking and follow-up.
                        </p>

                        <button
                            type="button"
                            onClick={fetchCalls}
                            className="mt-5 h-10 rounded-xl bg-green-600 px-4 text-sm font-medium text-white shadow-sm transition-all hover:-translate-y-0.5 hover:bg-green-700 hover:shadow-md sm:mt-6 sm:px-5"
                        >
                            Refresh
                        </button>
                    </div>
                </div>
            )}

            {/* ---------- DATA ---------- */}
            {!loading && calls.length > 0 && (
                <>
                    {/* MOBILE / TABLET */}
                    <div className="space-y-3 md:hidden">
                        {calls.map((call) => (
                            <MobileCallCard key={call._id} call={call} router={router} />
                        ))}

                        <MobilePagination page={page} setPage={setPage} total={total} rowsPerPage={rowsPerPage} setRowsPerPage={setRowsPerPage} />
                    </div>

                    {/* DESKTOP */}
                    <div className="hidden md:block">
                        <DynamicTable
                            loading={false}
                            columns={columns}
                            data={calls}
                            page={page}
                            setPage={setPage}
                            total={total}
                            rowsPerPage={rowsPerPage}
                            setRowsPerPage={setRowsPerPage}
                            onAction={handleRowAction}
                        />
                    </div>
                </>
            )}
        </div>
    );
}
