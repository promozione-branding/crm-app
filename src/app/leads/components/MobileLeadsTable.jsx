"use client";

import React, { useState } from "react";
import { ChevronDown, ChevronUp, Phone, UserRound } from "lucide-react";

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
          <div
            key={item}
            className="
                            h-28
                            w-full
                            animate-pulse
                            rounded-xl
                            border
                            border-app
                            bg-app
                        "
          />
        ))}
      </div>
    );
  }

  // =====================================================
  // EMPTY
  // =====================================================

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
          <div
            key={lead._id}
            className="
                            overflow-hidden
                            rounded-xl
                            border
                            border-app
                            bg-app
                            shadow-sm
                        "
          >
            {/* =================================================
                            MAIN CARD
                        ================================================= */}

            <button
              type="button"
              onClick={() =>
                setExpandedId((prev) => (prev === lead._id ? null : lead._id))
              }
              className="
                                w-full
                                px-4
                                py-3.5
                                text-left
                                transition
                                hover-app
                            "
            >
              {/* TOP ROW */}
              <div
                className="
                                    flex
                                    items-start
                                    justify-between
                                    gap-3
                                "
              >
                {/* CUSTOMER INFO */}
                <div className="min-w-0 flex-1">
                  {/* S.NO + CUSTOMER NAME */}
                  <div
                    className="
                                            flex
                                            min-w-0
                                            items-center
                                            gap-2
                                        "
                  >
                    <span
                      className="
                                                shrink-0
                                                text-xs
                                                font-medium
                                                opacity-70
                                            "
                    >
                      #{getSerialNumber(index)}
                    </span>

                    <h3
                      className="
                                                min-w-0
                                                truncate
                                                text-sm
                                                font-semibold
                                            "
                    >
                      {lead.name || "Unnamed Lead"}
                    </h3>
                  </div>

                  {/* PHONE */}
                  <div
                    className="
                                            mt-1.5
                                            flex
                                            items-center
                                            gap-1.5
                                        "
                  >
                    <Phone
                      size={13}
                      className="
                                                shrink-0
                                                opacity-50
                                            "
                    />

                    <span
                      className="
                                                truncate
                                                text-sm
                                                opacity-60
                                            "
                    >
                      {lead.phone || "No phone"}
                    </span>
                  </div>
                </div>

                {/* STAGE / PRIORITY RIGHT END */}
                <div className="shrink-0">
                  <span
                    className="
                                            inline-flex
                                            items-center
                                            rounded-full
                                            bg-blue-500/10
                                            px-2.5
                                            py-1
                                            text-xs
                                            font-medium
                                            capitalize
                                            text-blue-500
                                        "
                  >
                    {lead.stage || "—"}
                  </span>
                </div>
              </div>

              {/* ASSIGNED TO */}
              <div
                className="
                                    mt-3
                                    flex
                                    items-center
                                    justify-between
                                    gap-3
                                    border-t
                                    border-app
                                    pt-2.5
                                "
              >
                <div
                  className="
                                        flex
                                        items-center
                                        gap-1.5
                                        min-w-0
                                    "
                >
                  <UserRound
                    size={13}
                    className="
                                            shrink-0
                                            opacity-70
                                        "
                  />

                  <span
                    className="
                                            text-xs
                                            opacity-50
                                        "
                  >
                    Assigned To
                  </span>
                </div>

                <span
                  className="
                                        max-w-[55%]
                                        truncate
                                        text-sm
                                        font-medium
                                        text-right
                                    "
                >
                  {lead.assignedTo?.name || "—"}
                </span>
              </div>

              {/* EXPAND ICON */}
              <div
                className="
                                    mt-2
                                    flex
                                    justify-center
                                    opacity-70
                                "
              >
                {isExpanded ? (
                  <ChevronUp size={15} />
                ) : (
                  <ChevronDown size={15} />
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
                <div
                  className="
                                        space-y-3
                                        p-4
                                    "
                >
                  <DetailRow label="Stage" value={lead.stage} badge />

                  <DetailRow label="Deal Value" value={lead.dealValue} />

                  <DetailRow label="Lead Source" value={lead.source} />

                  <DetailRow
                    label="Created At"
                    value={
                      lead.createdAt
                        ? new Date(lead.createdAt).toLocaleDateString()
                        : "—"
                    }
                  />

                  <DetailRow
                    label="Last Modified"
                    value={
                      lead.updatedAt
                        ? new Date(lead.updatedAt).toLocaleDateString()
                        : "—"
                    }
                  />

                  {/* EDIT */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();

                      router.push(`/leads/edit/${lead._id}`);
                    }}
                    className="
                                            mt-2
                                            w-full
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
                PAGINATION
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
          <p className="text-center opacity-70">
            {total > 0
              ? `Showing ${startItem}-${endItem} of ${total}`
              : "Showing 0 of 0"}
          </p>

          {/* CONTROLS */}
          <div
            className="
                            flex
                            items-center
                            justify-between
                            gap-2
                        "
          >
            {/* ROWS PER PAGE */}
            {setRowsPerPage && (
              <select
                value={rowsPerPage}
                onChange={handleRowsPerPageChange}
                className="
                                    rounded-lg
                                    border
                                    border-app
                                    bg-app
                                    px-2
                                    py-2
                                    text-app
                                "
              >
                <option value={25}>25</option>

                <option value={50}>50</option>

                <option value={75}>75</option>

                <option value={100}>100</option>
              </select>
            )}

            <div
              className="
                                flex
                                items-center
                                gap-2
                            "
            >
              {/* PREVIOUS */}
              <button
                type="button"
                disabled={page <= 1}
                onClick={() => handlePageChange(page - 1)}
                className={`
                                    h-9
                                    rounded-lg
                                    border
                                    border-app
                                    px-3
                                    ${
                                      page <= 1
                                        ? "cursor-not-allowed opacity-50"
                                        : "hover-app"
                                    }
                                `}
              >
                Prev
              </button>

              {/* CURRENT PAGE */}
              <button
                type="button"
                className="
                                    h-8
                                    rounded-lg
                                    bg-blue-600
                                    px-3
                                    text-white
                                "
              >
                {page}
              </button>

              {/* NEXT */}
              <button
                type="button"
                disabled={totalPages === 0 || page >= totalPages}
                onClick={() => handlePageChange(page + 1)}
                className={`
                                    h-9
                                    rounded-lg
                                    border
                                    border-app
                                    px-3
                                    ${
                                      totalPages === 0 || page >= totalPages
                                        ? "cursor-not-allowed opacity-50"
                                        : "hover-app"
                                    }
                                `}
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
    <div
      className="
                flex
                items-start
                justify-between
                gap-4
            "
    >
      <span className="text-sm opacity-60">{label}</span>

      {badge ? (
        <span
          className="
                        max-w-[60%]
                        rounded-full
                        bg-blue-500/10
                        px-3
                        py-1
                        text-sm
                        capitalize
                        text-right
                        text-blue-500
                    "
        >
          {value || "—"}
        </span>
      ) : (
        <span
          className="
                        max-w-[60%]
                        break-words
                        text-right
                        text-sm
                    "
        >
          {value || "—"}
        </span>
      )}
    </div>
  );
}
