// src/components/user/leads/form/Call.jsx

'use client';

import { useEffect, useState } from 'react';
import {
    Phone,
    PhoneOff,
    PhoneCall,
    PhoneIncoming,
    PhoneOutgoing,
    Clock,
    User as UserIcon,
    Calendar,
    ChevronDown,
    ChevronUp,
    Loader2,
} from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

// ============================================================
// STATUS STYLES
// ============================================================

const STATUS_STYLES = {
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

const formatDuration = (seconds) => {
    const s = Number(seconds) || 0;
    if (!s) return '—';
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return m > 0 ? `${m}m ${sec}s` : `${sec}s`;
};

const timeAgo = (date) => {
    if (!date) return '';
    const diff = Date.now() - new Date(date).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'just now';
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    const days = Math.floor(hrs / 24);
    if (days < 7) return `${days}d ago`;
    return new Date(date).toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
    });
};

// ============================================================
// MAIN COMPONENT
// ============================================================

export default function Call({ leadId }) {
    const [calls, setCalls] = useState([]);
    const [loading, setLoading] = useState(true);
    const [expanded, setExpanded] = useState({});

    const toggle = (id) =>
        setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));

    // ========================================================
    // FETCH CALLS FOR THIS LEAD
    // ========================================================

    useEffect(() => {
        if (!leadId) {
            setLoading(false);
            return;
        }

        const fetchCalls = async () => {
            try {
                setLoading(true);

                const res = await axios.get('/api/user/call', {
                    params: { leadId, limit: 100 },
                    withCredentials: true,
                });

                setCalls(res.data?.data?.calls || []);
            } catch (error) {
                console.error('Fetch lead calls error:', error);
                toast.error(
                    error.response?.data?.message || 'Failed to load calls.'
                );
            } finally {
                setLoading(false);
            }
        };

        fetchCalls();
    }, [leadId]);

    // ========================================================
    // UI
    // ========================================================

    return (
        <div className="bg-card border-app rounded-2xl border p-5">
            <div className="mb-4 flex items-center justify-between">
                <div>
                    <h3 className="text-muted text-xs font-semibold tracking-widest uppercase">
                        Call Log
                    </h3>
                    <p className="text-muted mt-0.5 text-[11px]">
                        {loading
                            ? 'Loading…'
                            : `${calls.length} call${calls.length === 1 ? '' : 's'} recorded`}
                    </p>
                </div>
            </div>

            <div className="border-app mb-4 border-b" />

            {/* LOADING */}
            {loading && (
                <div className="flex items-center justify-center py-10">
                    <Loader2 size={20} className="animate-spin opacity-60" />
                </div>
            )}

            {/* EMPTY STATE */}
            {!loading && calls.length === 0 && (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                    <div className="bg-app border-app text-app flex h-14 w-14 items-center justify-center rounded-full border">
                        <Phone size={24} className="opacity-80" />
                    </div>

                    <h4 className="text-app mt-4 text-sm font-medium">
                        No Call Log Found
                    </h4>

                    <p className="text-muted mt-1 text-xs">
                        Call history will appear here.
                    </p>
                </div>
            )}

            {/* CALL LIST */}
            {!loading && calls.length > 0 && (
                <div className="space-y-2">
                    {calls.map((call) => {
                        const isOpen = !!expanded[call._id];
                        const statusClass =
                            STATUS_STYLES[call.status?.toLowerCase()] ||
                            'bg-gray-500/10 text-gray-600';

                        return (
                            <div
                                key={call._id}
                                className="border-app bg-app overflow-hidden rounded-xl border"
                            >
                                {/* MAIN ROW */}
                                <button
                                    type="button"
                                    onClick={() => toggle(call._id)}
                                    className="hover-app flex w-full items-center gap-3 px-3.5 py-3 text-left transition"
                                >
                                    {/* ICON */}
                                    <div
                                        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
                                            call.status === 'completed'
                                                ? 'bg-green-500/10 text-green-600'
                                                : call.status === 'missed'
                                                  ? 'bg-red-500/10 text-red-600'
                                                  : 'bg-blue-500/10 text-blue-600'
                                        }`}
                                    >
                                        {call.status === 'completed' ? (
                                            <PhoneOutgoing size={15} />
                                        ) : call.status === 'missed' ? (
                                            <PhoneOff size={15} />
                                        ) : (
                                            <PhoneCall size={15} />
                                        )}
                                    </div>

                                    {/* WHO + WHEN */}
                                    <div className="min-w-0 flex-1">
                                        <p className="text-app truncate text-sm font-medium">
                                            {call.callerId?.name || 'Unknown'}
                                            {call.callerRole
                                                ? ` · ${call.callerRole}`
                                                : ''}
                                        </p>
                                        <div className="text-muted mt-0.5 flex items-center gap-2 text-[11px]">
                                            <span className="flex items-center gap-1">
                                                <Clock size={10} />
                                                {timeAgo(call.calledAt)}
                                            </span>
                                            {call.durationSeconds > 0 && (
                                                <>
                                                    <span>·</span>
                                                    <span>
                                                        {formatDuration(
                                                            call.durationSeconds
                                                        )}
                                                    </span>
                                                </>
                                            )}
                                        </div>
                                    </div>

                                    {/* STATUS BADGE */}
                                    <span
                                        className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium ${statusClass}`}
                                    >
                                        {formatLabel(call.status)}
                                    </span>

                                    {/* EXPAND CHEVRON */}
                                    <div className="text-muted flex w-4 shrink-0 justify-center">
                                        {isOpen ? (
                                            <ChevronUp size={14} />
                                        ) : (
                                            <ChevronDown size={14} />
                                        )}
                                    </div>
                                </button>

                                {/* EXPANDED DETAILS */}
                                {isOpen && (
                                    <div className="border-app bg-surface space-y-2.5 border-t px-3.5 py-3">
                                        <Row
                                            icon={Phone}
                                            label="Number"
                                            value={
                                                call.phoneNumber ? (
                                                    <a
                                                        href={`tel:${call.phoneNumber}`}
                                                        className="text-blue-500 hover:underline"
                                                    >
                                                        {call.phoneNumber}
                                                    </a>
                                                ) : (
                                                    '—'
                                                )
                                            }
                                        />

                                        <Row
                                            icon={Calendar}
                                            label="Called At"
                                            value={
                                                call.calledAt
                                                    ? new Date(
                                                          call.calledAt
                                                      ).toLocaleString('en-IN')
                                                    : '—'
                                            }
                                        />

                                        <Row
                                            icon={UserIcon}
                                            label="Outcome"
                                            value={formatLabel(call.outcome)}
                                        />

                                        <Row
                                            label="Duration"
                                            value={formatDuration(
                                                call.durationSeconds
                                            )}
                                        />

                                        <Row
                                            label="Source"
                                            value={formatLabel(call.source)}
                                        />

                                        {call.notes && (
                                            <div className="pt-1">
                                                <p className="text-muted mb-1 text-[11px]">
                                                    Notes
                                                </p>
                                                <p className="text-app text-xs leading-5 whitespace-pre-wrap">
                                                    {call.notes}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

// ============================================================
// ROW
// ============================================================

function Row({ icon: Icon, label, value }) {
    return (
        <div className="flex items-start justify-between gap-3">
            <span className="text-muted flex items-center gap-1.5 text-[11px]">
                {Icon && <Icon size={11} />}
                {label}
            </span>
            <span className="text-app max-w-[65%] text-right text-xs break-words">
                {value || '—'}
            </span>
        </div>
    );
}