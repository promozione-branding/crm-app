"use client";

import React, {
    useState,
} from "react";

export default function MobileLeadsTable({
    loading,
    leads,
    router,
}) {
    const [expandedId, setExpandedId] =
        useState(null);

    /* =====================================================
       LOADING
    ===================================================== */

    if (loading) {
        return (
            <div className="space-y-3">
                {[1, 2, 3, 4].map(
                    (item) => (
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
                    )
                )}
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
            {leads.map((lead) => {
                const isExpanded =
                    expandedId ===
                    lead._id;

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
                                setExpandedId(
                                    (prev) =>
                                        prev ===
                                        lead._id
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
                                        <span className="text-xs opacity-50">
                                            #{lead.sno}
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
                                            {lead.stage ||
                                                "—"}
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
                                        {lead.name ||
                                            "Unnamed Lead"}
                                    </h3>

                                    {/* PHONE */}
                                    <p
                                        className="
                                            mt-1
                                            text-xs
                                            opacity-60
                                            truncate
                                        "
                                    >
                                        {lead.phone ||
                                            "No phone"}
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
                                            text-xs
                                            font-medium
                                            truncate
                                        "
                                    >
                                        {lead.assignedTo
                                            ?.name ||
                                            "—"}
                                    </p>
                                </div>
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
                                <div
                                    className="
                                        p-4
                                        space-y-3
                                    "
                                >
                                    <DetailRow
                                        label="Stage"
                                        value={
                                            lead.stage
                                        }
                                        badge
                                    />

                                    <DetailRow
                                        label="Deal Value"
                                        value={
                                            lead.dealValue
                                        }
                                    />

                                    <DetailRow
                                        label="Lead Source"
                                        value={
                                            lead.source
                                        }
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
                                        onClick={(
                                            e
                                        ) => {
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
        </div>
    );
}

/* =========================================================
   DETAIL ROW
========================================================= */

function DetailRow({
    label,
    value,
    badge = false,
}) {
    return (
        <div
            className="
                flex
                items-start
                justify-between
                gap-4
            "
        >
            <span className="text-xs opacity-60">
                {label}
            </span>

            {badge ? (
                <span
                    className="
                        max-w-[60%]
                        px-3
                        py-1
                        rounded-full
                        text-xs
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