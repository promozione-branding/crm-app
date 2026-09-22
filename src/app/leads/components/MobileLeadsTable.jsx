// src/app/leads/components/MobileLeadsTable.jsx

'use client';

import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Phone, Package } from 'lucide-react';
import StageBadge from '@/components/user/ui/StageBadge';
import { useCallLog } from '@/hooks/useCallLog';

export default function MobileLeadsTable({
    loading,
    leads,
    router,

    page = 1,
    setPage,
    total = 0,
    rowsPerPage = 25,
    setRowsPerPage,
}) {
    const [expandedId, setExpandedId] = useState(null);

    // 👇 Call logging hook
    const { logCall } = useCallLog();

    const getSerialNumber = (index) => (page - 1) * rowsPerPage + index + 1;

    const totalPages = Math.ceil(total / rowsPerPage);
    const startItem = total > 0 ? (page - 1) * rowsPerPage + 1 : 0;
    const endItem = total > 0 ? Math.min(page * rowsPerPage, total) : 0;

    const handlePageChange = (newPage) => {
        if (newPage < 1) return;
        if (totalPages > 0 && newPage > totalPages) return;
        setPage?.(newPage);
    };

    const handleRowsPerPageChange = (e) => {
        const value = Number(e.target.value);
        setRowsPerPage?.(value);
        setPage?.(1);
    };

    const toggleExpand = (leadId) => {
        setExpandedId((prev) => (prev === leadId ? null : leadId));
    };

    // =====================================================
    // CALL HANDLER
    // =====================================================

    const handleCallClick = async (e, lead) => {
        e.stopPropagation();

        // Log the call (fire and forget)
        logCall({
            refId: lead._id,
            phoneNumber: lead.phone,
            refModel: 'Lead',
            source: 'mobile_card',
        });

        // Open the dialer
        window.location.href = `tel:${lead.phone}`;
    };

    // =====================================================
    // LOADING
    // =====================================================

    if (loading) {
        return (
            <div className="space-y-3">
                {[1, 2, 3, 4].map((item) => (
                    <div key={item} className="border-app bg-app h-28 w-full animate-pulse rounded-xl border" />
                ))}
            </div>
        );
    }

    // =====================================================
    // EMPTY
    // =====================================================

    if (!leads?.length) {
        return (
            <div className="border-app bg-app rounded-xl border p-6 text-center">
                <p className="text-sm font-medium opacity-60">No leads found</p>
            </div>
        );
    }

    // =====================================================
    // LEADS
    // =====================================================

    return (
        <div className="space-y-4">
            {leads.map((lead, index) => {
                const isExpanded = expandedId === lead._id;

                return (
                    <div key={lead._id} className="border-app bg-app overflow-hidden rounded-xl border shadow-sm">
                        {/* ✅ Outer is a DIV now — no nested button error */}
                        <div
                            role="button"
                            tabIndex={0}
                            onClick={() => toggleExpand(lead._id)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' || e.key === ' ') {
                                    e.preventDefault();
                                    toggleExpand(lead._id);
                                }
                            }}
                            className="hover-app w-full cursor-pointer px-4 py-3.5 text-left transition"
                        >
                            <div className="flex min-w-0 items-stretch gap-3">
                                {/* S.NO */}
                                <div className="flex w-7 shrink-0 items-center">
                                    <span className="text-xs font-medium opacity-50">#{getSerialNumber(index)}</span>
                                </div>

                                {/* NAME + PRODUCT */}
                                <div className="min-w-0 flex-1">
                                    <div className="flex h-6 min-w-0 items-center">
                                        <h3 className="min-w-0 truncate text-sm font-semibold">{lead.name || 'Unnamed Lead'}</h3>
                                    </div>

                                    <div className="mt-1.5 flex h-6 min-w-0 items-center">
                                        {lead.product ? (
                                            <span
                                                className="inline-flex max-w-full min-w-0 items-center gap-1 truncate rounded-full border border-purple-500/20 bg-purple-500/10 px-2 py-0.5 text-[11px] font-medium text-purple-400"
                                                title={lead.product}
                                            >
                                                <Package size={11} className="shrink-0" />
                                                <span className="truncate">{lead.product}</span>
                                            </span>
                                        ) : (
                                            <span className="text-[11px] opacity-40">No product</span>
                                        )}
                                    </div>
                                </div>

                                {/* RIGHT SIDE — STAGE + CALL */}
                                <div className="flex shrink-0 items-center gap-2">
                                    <StageBadge stage={lead.stage} />

                                    {lead.phone ? (
                                        <button
                                            type="button"
                                            onClick={(e) => handleCallClick(e, lead)}
                                            title={`Call ${lead.phone}`}
                                            aria-label={`Call ${lead.phone}`}
                                            className="flex h-8 w-8 items-center justify-center rounded-full border border-amber-700/40 bg-amber-900/70 text-amber-50 opacity-70 transition hover:opacity-100"
                                        >
                                            <Phone size={15} />
                                        </button>
                                    ) : null}
                                </div>

                                {/* EXPAND ICON */}
                                <div className="flex w-5 shrink-0 items-center justify-center opacity-50">
                                    {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                                </div>
                            </div>
                        </div>

                        {/* EXPANDED DETAILS */}
                        {isExpanded && (
                            <div className="border-app bg-surface border-t">
                                <div className="space-y-3 p-4">
                                    <DetailRow label="Deal Value" value={lead.dealValue} />
                                    <DetailRow label="Lead Source" value={lead.source} />
                                    <DetailRow label="Created At" value={lead.createdAt ? new Date(lead.createdAt).toLocaleDateString() : '—'} />
                                    <DetailRow label="Last Modified" value={lead.updatedAt ? new Date(lead.updatedAt).toLocaleDateString() : '—'} />

                                    <button
                                        type="button"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            router.push(`/leads/edit/${lead._id}`);
                                        }}
                                        className="btn-primary mt-2 w-full rounded-lg py-2.5 text-sm font-medium"
                                    >
                                        View / Edit Lead
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                );
            })}

            {/* PAGINATION */}
            {setPage && (
                <div className="border-app bg-app flex flex-col gap-3 rounded-xl border px-4 py-3 text-sm">
                    <p className="text-center opacity-70">{total > 0 ? `Showing ${startItem}-${endItem} of ${total}` : 'Showing 0 of 0'}</p>

                    <div className="flex items-center justify-between gap-2">
                        {setRowsPerPage && (
                            <select value={rowsPerPage} onChange={handleRowsPerPageChange} className="border-app bg-app text-app rounded-lg border px-2 py-2">
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
                                onClick={() => handlePageChange(page - 1)}
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
                                onClick={() => handlePageChange(page + 1)}
                                className={`border-app h-9 rounded-lg border px-3 ${
                                    totalPages === 0 || page >= totalPages ? 'cursor-not-allowed opacity-50' : 'hover-app'
                                }`}
                            >
                                Next
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

// =========================================================
// DETAIL ROW
// =========================================================

function DetailRow({ label, value, badge = false }) {
    return (
        <div className="flex items-start justify-between gap-4">
            <span className="text-sm opacity-60">{label}</span>

            {badge ? (
                <span className="max-w-[60%] rounded-full bg-blue-500/10 px-3 py-1 text-right text-sm text-blue-500 capitalize">{value || '—'}</span>
            ) : (
                <span className="max-w-[60%] text-right text-sm break-words">{value || '—'}</span>
            )}
        </div>
    );
}
