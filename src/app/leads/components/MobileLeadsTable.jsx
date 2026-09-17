"use client";

import React, { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

export default function MobileLeadsTable({
    loading,
    leads,
    router,

    // ✅ NEW pagination props (same as DynamicTable)
    page = 1,
    setPage,
    total = 0,
    rowsPerPage = 25,
    setRowsPerPage,
}) {
    const [expandedId, setExpandedId] = useState(null);

    // =====================================================
    // SERIAL NUMBER (matches DynamicTable)
    // =====================================================

    const getSerialNumber = (index) =>
        (page - 1) * rowsPerPage + index + 1;

    // =====================================================
    // PAGINATION CALC
    // =====================================================

    const totalPages = Math.ceil(total / rowsPerPage);

    const startItem =
        total > 0 ? (page - 1) * rowsPerPage + 1 : 0;

    const endItem =
        total > 0 ? Math.min(page * rowsPerPage, total) : 0;

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

    /* =====================================================
       LOADING
    ===================================================== */

    if (loading) {
        return (
            <div className="space-y-3">
                {[1, 2, 3, 4].map((item) => (
                    <div
                        key={item}
                        className="
                            h-24
                            rounded-xl
                            bg-app
                            border
                            border-app
                            animate-pulse
                        "
                    />
                ))}
            </div>
        );
    }

    /* =====================================================
       EMPTY
    ===================================================== */

    if (!leads?.length) {
        return (
            <div
                className="
                    rounded-xl
                    border
                    border-app
                    bg-app
                    p-6
                    text-center
                "
            >
                <p className="text-sm opacity-60">
                    No leads found
                </p>
            </div>
        );
    }

    /* =====================================================
       LEADS
    ===================================================== */

    return (
        <div className="space-y-3">
            {leads.map((lead, index) => {
                const isExpanded = expandedId === lead._id;

                return (
                    <div
                        key={lead._id}
                        className="
                            overflow-hidden
                            rounded-xl
                            border
                            border-app
                            bg-app
                        "
                    >
                        {/* =================================================
                            MAIN CARD
                        ================================================= */}

                        <button
                            type="button"
                            onClick={() =>
                                setExpandedId((prev) =>
                                    prev === lead._id
                                        ? null
                                        : lead._id
                                )
                            }
                            className="
                                w-full
                                p-4
                                text-left
                                hover-app
                                transition
                            "
                        >
                            <div
                                className="
                                    flex
                                    items-start
                                    justify-between
                                    gap-3
                                "
                            >
                                {/* LEFT */}
                                <div className="min-w-0 flex-1">
                                    {/* SNO + STAGE */}
                                    <div
                                        className="
                                            flex
                                            items-center
                                            gap-2
                                            mb-1
                                        "
                                    >
                                        {/* ✅ SERIAL NUMBER */}
                                        <span className="text-sm opacity-50">
                                            #{getSerialNumber(index)}
                                        </span>

                                        <span
                                            className="
                                                px-2
                                                py-0.5
                                                rounded-full
                                                text-[10px]
                                                bg-blue-500/10
                                                text-blue-500
                                                capitalize
                                            "
                                        >
                                            {lead.stage || "—"}
                                        </span>
                                    </div>

                                    {/* NAME */}
                                    <h3
                                        className="
                                            text-sm
                                            font-semibold
                                            truncate
                                        "
                                    >
                                        {lead.name || "Unnamed Lead"}
                                    </h3>

                                    {/* PHONE */}
                                    <p
                                        className="
                                            mt-1
                                            text-sm
                                            opacity-60
                                            truncate
                                        "
                                    >
                                        {lead.phone || "No phone"}
                                    </p>
                                </div>

                                {/* ASSIGNED TO */}
                                <div
                                    className="
                                        max-w-[40%]
                                        text-right
                                    "
                                >
                                    <p className="text-[10px] opacity-50">
                                        Assigned To
                                    </p>

                                    <p
                                        className="
                                            text-sm
                                            font-medium
                                            truncate
                                        "
                                    >
                                        {lead.assignedTo?.name || "—"}
                                    </p>
                                </div>
                            </div>

                            {/* EXPAND ICON */}
                            <div className="mt-2 flex justify-center opacity-50">
                                {isExpanded ? (
                                    <ChevronUp size={14} />
                                ) : (
                                    <ChevronDown size={14} />
                                )}
                            </div>
                        </button>

                        {/* =================================================
                            EXPANDED DETAILS
                        ================================================= */}

                        {isExpanded && (
                            <div
                                className="
                                    border-t
                                    border-app
                                    bg-surface
                                "
                            >
                                <div className="p-4 space-y-3">
                                    <DetailRow
                                        label="Stage"
                                        value={lead.stage}
                                        badge
                                    />

                                    <DetailRow
                                        label="Deal Value"
                                        value={lead.dealValue}
                                    />

                                    <DetailRow
                                        label="Lead Source"
                                        value={lead.source}
                                    />

                                    <DetailRow
                                        label="Created At"
                                        value={
                                            lead.createdAt
                                                ? new Date(
                                                      lead.createdAt
                                                  ).toLocaleDateString()
                                                : "—"
                                        }
                                    />

                                    <DetailRow
                                        label="Last Modified"
                                        value={
                                            lead.updatedAt
                                                ? new Date(
                                                      lead.updatedAt
                                                  ).toLocaleDateString()
                                                : "—"
                                        }
                                    />

                                    {/* EDIT */}
                                    <button
                                        type="button"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            router.push(
                                                `/leads/edit/${lead._id}`
                                            );
                                        }}
                                        className="
                                            w-full
                                            mt-2
                                            rounded-lg
                                            btn-primary
                                            py-2.5
                                            text-sm
                                            font-medium
                                        "
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
                PAGINATION (mobile)
            ===================================================== */}

            {setPage && (
                <div
                    className="
                        flex
                        flex-col
                        gap-3
                        rounded-xl
                        border
                        border-app
                        bg-app
                        px-4
                        py-3
                        text-sm
                    "
                >
                    {/* SHOWING COUNT */}
                    <p className="opacity-70 text-center">
                        {total > 0
                            ? `Showing ${startItem}-${endItem} of ${total}`
                            : "Showing 0 of 0"}
                    </p>

                    {/* CONTROLS */}
                    <div className="flex items-center justify-between gap-2">
                        {/* ROWS PER PAGE */}
                        {setRowsPerPage && (
                            <select
                                value={rowsPerPage}
                                onChange={handleRowsPerPageChange}
                                className="
                                    border
                                    border-app
                                    px-1.5
                                    py-2
                                    rounded-lg
                                    text-app
                                    bg-app
                                "
                            >
                                <option value={25}>25</option>
                                <option value={50}>50</option>
                                <option value={75}>75</option>
                                <option value={100}>100</option>
                            </select>
                        )}

                        <div className="flex gap-2 items-center">
                            {/* PREVIOUS */}
                            <button
                                type="button"
                                disabled={page <= 1}
                                onClick={() =>
                                    handlePageChange(page - 1)
                                }
                                className={`px-3 h-9 rounded-lg border border-app ${
                                    page <= 1
                                        ? "opacity-50 cursor-not-allowed"
                                        : "hover-app"
                                }`}
                            >
                                Prev
                            </button>

                            {/* CURRENT PAGE */}
                            <button
                                type="button"
                                className="px-3 h-8 rounded-lg bg-blue-600 text-white"
                            >
                                {page}
                            </button>

                            {/* NEXT */}
                            <button
                                type="button"
                                disabled={
                                    totalPages === 0 ||
                                    page >= totalPages
                                }
                                onClick={() =>
                                    handlePageChange(page + 1)
                                }
                                className={`px-3 h-9 rounded-lg border border-app ${
                                    totalPages === 0 ||
                                    page >= totalPages
                                        ? "opacity-50 cursor-not-allowed"
                                        : "hover-app"
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

/* =========================================================
   DETAIL ROW
========================================================= */

function DetailRow({ label, value, badge = false }) {
    return (
        <div
            className="
                flex
                items-start
                justify-between
                gap-4
            "
        >
            <span className="text-sm opacity-60">
                {label}
            </span>

            {badge ? (
                <span
                    className="
                        max-w-[60%]
                        px-3
                        py-1
                        rounded-full
                        text-sm
                        bg-blue-500/10
                        text-blue-500
                        capitalize
                        text-right
                    "
                >
                    {value || "—"}
                </span>
            ) : (
                <span
                    className="
                        max-w-[60%]
                        text-sm
                        text-right
                        break-words
                    "
                >
                    {value || "—"}
                </span>
            )}
        </div>
    );
}