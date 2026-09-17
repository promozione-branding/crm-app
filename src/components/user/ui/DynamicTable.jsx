"use client";

import { ChevronDown, ChevronUp, MoreVertical } from "lucide-react";

const DynamicTable = ({
    loading = false,
    columns = [],
    data = [],
    page = 1,
    setPage,
    total = 0,
    rowsPerPage = 25,
    setRowsPerPage,
    onAction,
    showSno = true,
}) => {
    // ============================================================
    // GET NESTED VALUE
    // Example: assignedTo.name
    // ============================================================

    const getNestedValue = (obj, path) => {
        if (!obj || !path) return undefined;

        return path.split(".").reduce((value, key) => {
            return value?.[key];
        }, obj);
    };

    // ============================================================
    // PAGINATION
    // ============================================================

    const totalPages = Math.ceil(total / rowsPerPage);

    const startItem =
        total > 0
            ? (page - 1) * rowsPerPage + 1
            : 0;

    const endItem =
        total > 0
            ? Math.min(page * rowsPerPage, total)
            : 0;

    // ============================================================
    // SERIAL NUMBER
    // ============================================================

    const getSerialNumber = (index) => {
        return (page - 1) * rowsPerPage + index + 1;
    };

    // ============================================================
    // TOTAL TABLE COLUMNS
    // ============================================================

    const totalColumns =
        columns.length +
        (showSno ? 1 : 0) +
        (onAction ? 1 : 0);

    // ============================================================
    // PAGE CHANGE
    // ============================================================

    const handlePageChange = (newPage) => {
        if (newPage < 1) return;

        if (totalPages > 0 && newPage > totalPages) {
            return;
        }

        setPage?.(newPage);
    };

    // ============================================================
    // ROWS PER PAGE
    // ============================================================

    const handleRowsPerPageChange = (e) => {
        const value = Number(e.target.value);

        setRowsPerPage?.(value);
        setPage?.(1);
    };

    return (
        <div className="rounded-2xl border border-app shadow-sm overflow-hidden">

            {/* =====================================================
                TABLE WRAPPER
            ====================================================== */}

            <div className="overflow-x-auto">

                <table className="w-full text-xs">

                    {/* =================================================
                        HEADER
                    ================================================== */}

                    <thead className="border-b border-app bg-app">
                        <tr>

                            {/* S.NO */}
                            {showSno && (
                                <th className="px-6 py-4 font-semibold text-left">
                                    S.NO
                                </th>
                            )}

                            {/* DYNAMIC COLUMNS */}
                            {columns.map((col) => (
                                <th
                                    key={col.key}
                                    className="px-6 py-4 font-semibold cursor-pointer text-left"
                                >
                                    <div className="flex items-center gap-2">
                                        {col.label}

                                        {col.sortable && (
                                            <span className="flex flex-col">
                                                <ChevronUp size={10} />
                                                <ChevronDown size={10} />
                                            </span>
                                        )}
                                    </div>
                                </th>
                            ))}

                            {/* ACTION */}
                            {onAction && (
                                <th className="px-6 py-4 font-semibold text-left">
                                    Action
                                </th>
                            )}

                        </tr>
                    </thead>

                    {/* =================================================
                        BODY
                    ================================================== */}

                    <tbody>

                        {/* =================================================
                            LOADING
                        ================================================== */}

                        {loading ? (
                            <tr>
                                <td
                                    colSpan={totalColumns}
                                    className="text-center py-16"
                                >
                                    <div className="flex flex-col items-center justify-center gap-3">

                                        {/* Spinner */}
                                        <div className="relative w-9 h-9">

                                            <div className="absolute inset-0 rounded-full border-4 border-app opacity-30" />

                                            <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-blue-600 animate-spin" />

                                        </div>

                                        {/* Loading Text */}
                                        <div className="flex items-center gap-1 text-sm font-medium opacity-70">

                                            <span>
                                                Loading data
                                            </span>

                                            <span className="flex gap-0.5">

                                                <span className="animate-bounce [animation-delay:0ms]">
                                                    .
                                                </span>

                                                <span className="animate-bounce [animation-delay:150ms]">
                                                    .
                                                </span>

                                                <span className="animate-bounce [animation-delay:300ms]">
                                                    .
                                                </span>

                                            </span>

                                        </div>

                                        <p className="text-[11px] opacity-50">
                                            Please wait a moment
                                        </p>

                                    </div>
                                </td>
                            </tr>

                        ) : data.length > 0 ? (

                            /* =================================================
                                DATA
                            ================================================== */

                            data.map((row, index) => (
                                <tr
                                    key={row.id || row._id || index}
                                    className="border-b border-app hover-app transition bg-surface"
                                >

                                    {/* S.NO */}
                                    {showSno && (
                                        <td className="px-6 py-4">
                                            {getSerialNumber(index)}
                                        </td>
                                    )}

                                    {/* DYNAMIC CELLS */}
                                    {columns.map((col) => (
                                        <td
                                            key={col.key}
                                            className="px-6 py-4 capitalize"
                                        >
                                            {col.render
                                                ? col.render(row)

                                                : col.type === "date"
                                                ? getNestedValue(
                                                    row,
                                                    col.key
                                                )
                                                    ? new Date(
                                                        getNestedValue(
                                                            row,
                                                            col.key
                                                        )
                                                    ).toLocaleString()
                                                    : "-"

                                                : getNestedValue(
                                                    row,
                                                    col.key
                                                ) ?? "-"}
                                        </td>
                                    ))}

                                    {/* ACTION */}
                                    {onAction && (
                                        <td className="px-6 py-4">
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    onAction(row)
                                                }
                                                className="w-8 h-8 rounded-lg btn-primary flex items-center justify-center"
                                            >
                                                <MoreVertical size={18} />
                                            </button>
                                        </td>
                                    )}

                                </tr>
                            ))

                        ) : (

                            /* =================================================
                                NO DATA
                            ================================================== */

                            <tr>
                                <td
                                    colSpan={totalColumns}
                                    className="text-center py-10 opacity-60"
                                >
                                    No Data Found
                                </td>
                            </tr>
                        )}

                    </tbody>

                </table>

            </div>

            {/* =====================================================
                PAGINATION
            ====================================================== */}

            {setPage && (
                <div className="flex items-center justify-between px-6 py-2 bg-app text-xs">

                    {/* SHOWING COUNT */}

                    <p className="opacity-70">
                        {total > 0
                            ? `Showing ${startItem}-${endItem} of ${total}`
                            : "Showing 0 of 0"}
                    </p>

                    {/* CONTROLS */}

                    <div className="flex gap-2 items-center">

                        {/* ROWS PER PAGE */}

                        {setRowsPerPage && (
                            <select
                                value={rowsPerPage}
                                onChange={handleRowsPerPageChange}
                                className="border border-app px-1.5 py-2 rounded-lg text-app bg-app"
                            >
                                <option value={25}>
                                    25
                                </option>

                                <option value={50}>
                                    50
                                </option>

                                <option value={75}>
                                    75
                                </option>

                                <option value={100}>
                                    100
                                </option>
                            </select>
                        )}

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
            )}

        </div>
    );
};

export default DynamicTable;