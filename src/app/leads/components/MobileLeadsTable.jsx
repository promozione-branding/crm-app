// src/app/leads/components/MobileLeadsTable.jsx

'use client';

import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Phone, UserRound, Package } from 'lucide-react';

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

    // =====================================================
    // SERIAL NUMBER
    // =====================================================

    const getSerialNumber = (index) => (page - 1) * rowsPerPage + index + 1;

    // =====================================================
    // PAGINATION CALC
    // =====================================================

    const totalPages = Math.ceil(total / rowsPerPage);

    const startItem = total > 0 ? (page - 1) * rowsPerPage + 1 : 0;

    const endItem = total > 0 ? Math.min(page * rowsPerPage, total) : 0;

    const handlePageChange = (newPage) => {
        if (newPage < 1) return;

        if (totalPages > 0 && newPage > totalPages) {
            return;
        }

        setPage?.(newPage);
    };

    const handleRowsPerPageChange = (e) => {
        const value = Number(e.target.value);

        setRowsPerPage?.(value);
        setPage?.(1);
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
        <div className="space-y-3">
            {leads.map((lead, index) => {
                const isExpanded = expandedId === lead._id;

                return (
                    <div key={lead._id} className="border-app bg-app overflow-hidden rounded-xl border shadow-sm">
                        {/* =================================================
                            MAIN CARD
                        ================================================= */}

                        <button
                            type="button"
                            onClick={() => setExpandedId((prev) => (prev === lead._id ? null : lead._id))}
                            className="hover-app w-full px-4 py-3.5 text-left transition"
                        >
                            <div className="flex min-w-0 items-center gap-3">
                                {/* S.NO */}
                                <span className="w-7 shrink-0 text-xs font-medium opacity-50">#{getSerialNumber(index)}</span>

                                {/* TWO ROWS */}
                                <div className="min-w-0 flex-1">
                                    {/* ROW 1 — NAME + PHONE (PHONE RIGHT ALIGNED) */}
                                    <div className="flex w-full min-w-0 items-center gap-2">
                                        <h3 className="min-w-0 flex-1 truncate text-sm font-semibold">{lead.name || 'Unnamed Lead'}</h3>

                                        {lead.phone ? (
                                            <a
                                                href={`tel:${lead.phone}`}
                                                onClick={(e) => e.stopPropagation()}
                                                className="ml-auto inline-flex max-w-[48%] min-w-0 shrink-0 items-center gap-1 rounded-full border border-amber-700/40 bg-amber-900/70 px-2 py-0.5 text-xs font-medium text-amber-50 opacity-70 transition hover:opacity-100"
                                            >
                                                <Phone size={11} className="shrink-0" />
                                                <span className="truncate">{lead.phone}</span>
                                            </a>
                                        ) : null}
                                    </div>

                                    {/* ROW 2 — PRODUCT */}
                                    <div className="mt-1.5 flex min-w-0 items-center">
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

                                {/* RIGHT END — STATUS */}
                                <div className="flex shrink-0 flex-col items-end gap-1">
                                    <span className="inline-flex max-w-[95px] truncate rounded-full bg-blue-500/10 px-2.5 py-1 text-[11px] font-medium text-blue-500 capitalize">
                                        {(lead.stage || '—').replace(/_/g, ' ')}
                                    </span>

                                    <span
                                        className={`text-[10px] font-medium capitalize ${
                                            lead.status === 'open'
                                                ? 'text-emerald-500'
                                                : lead.status === 'closed'
                                                  ? 'text-blue-500'
                                                  : lead.status === 'junk'
                                                    ? 'text-red-500'
                                                    : 'opacity-50'
                                        } `}
                                    >
                                        {lead.status || '—'}
                                    </span>
                                </div>

                                {/* EXPAND */}
                                <div className="shrink-0 opacity-50">{isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}</div>
                            </div>
                        </button>

                        {/* =================================================
                            EXPANDED DETAILS
                        ================================================= */}

                        {isExpanded && (
                            <div className="border-app bg-surface border-t">
                                <div className="space-y-3 p-4">
                                    <DetailRow label="Stage" value={lead.stage} badge />

                                    <DetailRow label="Deal Value" value={lead.dealValue} />

                                    <DetailRow label="Lead Source" value={lead.source} />

                                    <DetailRow label="Created At" value={lead.createdAt ? new Date(lead.createdAt).toLocaleDateString() : '—'} />

                                    <DetailRow label="Last Modified" value={lead.updatedAt ? new Date(lead.updatedAt).toLocaleDateString() : '—'} />

                                    {/* EDIT */}
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

            {/* =====================================================
                PAGINATION
            ===================================================== */}

            {setPage && (
                <div className="border-app bg-app flex flex-col gap-3 rounded-xl border px-4 py-3 text-sm">
                    {/* SHOWING COUNT */}
                    <p className="text-center opacity-70">{total > 0 ? `Showing ${startItem}-${endItem} of ${total}` : 'Showing 0 of 0'}</p>

                    {/* CONTROLS */}
                    <div className="flex items-center justify-between gap-2">
                        {/* ROWS PER PAGE */}
                        {setRowsPerPage && (
                            <select value={rowsPerPage} onChange={handleRowsPerPageChange} className="border-app bg-app text-app rounded-lg border px-2 py-2">
                                <option value={25}>25</option>

                                <option value={50}>50</option>

                                <option value={75}>75</option>

                                <option value={100}>100</option>
                            </select>
                        )}

                        <div className="flex items-center gap-2">
                            {/* PREVIOUS */}
                            <button
                                type="button"
                                disabled={page <= 1}
                                onClick={() => handlePageChange(page - 1)}
                                className={`border-app h-9 rounded-lg border px-3 ${page <= 1 ? 'cursor-not-allowed opacity-50' : 'hover-app'} `}
                            >
                                Prev
                            </button>

                            {/* CURRENT PAGE */}
                            <button type="button" className="h-8 rounded-lg bg-blue-600 px-3 text-white">
                                {page}
                            </button>

                            {/* NEXT */}
                            <button
                                type="button"
                                disabled={totalPages === 0 || page >= totalPages}
                                onClick={() => handlePageChange(page + 1)}
                                className={`border-app h-9 rounded-lg border px-3 ${totalPages === 0 || page >= totalPages ? 'cursor-not-allowed opacity-50' : 'hover-app'} `}
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
