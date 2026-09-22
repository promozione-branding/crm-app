// src/components/user/ui/DynamicTable.jsx

'use client';

import { ChevronDown, ChevronUp, MoreVertical, Eye } from 'lucide-react';

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

        return path.split('.').reduce((value, key) => {
            return value?.[key];
        }, obj);
    };

    // ============================================================
    // PAGINATION
    // ============================================================

    const totalPages = Math.ceil(total / rowsPerPage);

    const startItem = total > 0 ? (page - 1) * rowsPerPage + 1 : 0;

    const endItem = total > 0 ? Math.min(page * rowsPerPage, total) : 0;

    // ============================================================
    // SERIAL NUMBER
    // ============================================================

    const getSerialNumber = (index) => {
        return (page - 1) * rowsPerPage + index + 1;
    };

    // ============================================================
    // TOTAL TABLE COLUMNS
    // ============================================================

    const totalColumns = columns.length + (showSno ? 1 : 0) + (onAction ? 1 : 0);

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
        <div className="border-app overflow-hidden rounded-2xl border shadow-sm">
            {/* =====================================================
                TABLE WRAPPER
            ====================================================== */}

            <div className="overflow-x-auto">
                <table className="w-full text-xs">
                    {/* =================================================
                        HEADER
                    ================================================== */}

                    <thead className="border-app bg-app border-b">
                        <tr>
                            {/* S.NO */}
                            {showSno && <th className="px-6 py-4 text-left font-semibold">S.NO</th>}

                            {/* DYNAMIC COLUMNS */}
                            {columns.map((col) => (
                                <th key={col.key} className="cursor-pointer px-6 py-4 text-left font-semibold">
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
                            {onAction && <th className="px-6 py-4 text-left font-semibold">Action</th>}
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
                                <td colSpan={totalColumns} className="py-16 text-center">
                                    <div className="flex flex-col items-center justify-center gap-3">
                                        {/* Spinner */}
                                        <div className="relative h-9 w-9">
                                            <div className="border-app absolute inset-0 rounded-full border-4 opacity-30" />

                                            <div className="absolute inset-0 animate-spin rounded-full border-4 border-transparent border-t-blue-600" />
                                        </div>

                                        {/* Loading Text */}
                                        <div className="flex items-center gap-1 text-sm font-medium opacity-70">
                                            <span>Loading data</span>

                                            <span className="flex gap-0.5">
                                                <span className="animate-bounce [animation-delay:0ms]">.</span>

                                                <span className="animate-bounce [animation-delay:150ms]">.</span>

                                                <span className="animate-bounce [animation-delay:300ms]">.</span>
                                            </span>
                                        </div>

                                        <p className="text-[11px] opacity-50">Please wait a moment</p>
                                    </div>
                                </td>
                            </tr>
                        ) : data.length > 0 ? (
                            /* =================================================
                                DATA
                            ================================================== */

                            data.map((row, index) => (
                                <tr key={row.id || row._id || index} className="border-app hover-app bg-surface border-b transition">
                                    {/* S.NO */}
                                    {showSno && <td className="px-6 py-4">{getSerialNumber(index)}</td>}

                                    {/* DYNAMIC CELLS */}
                                    {columns.map((col) => (
                                        <td key={col.key} className="px-6 py-4 capitalize">
                                            {col.render
                                                ? col.render(row)
                                                : col.type === 'date'
                                                  ? getNestedValue(row, col.key)
                                                      ? new Date(getNestedValue(row, col.key)).toLocaleString()
                                                      : '-'
                                                  : (getNestedValue(row, col.key) ?? '-')}
                                        </td>
                                    ))}

                                    {/* ACTION */}
                                    {onAction && (
                                        <td className="px-6 py-4">
                                            <button
                                                type="button"
                                                onClick={() => onAction(row)}
                                                className="btn-primary flex h-8 w-8 items-center justify-center rounded-lg"
                                            >
                                                <Eye size={18} />
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
                                <td colSpan={totalColumns} className="py-10 text-center opacity-60">
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
                <div className="bg-app flex items-center justify-between px-6 py-2 text-xs">
                    {/* SHOWING COUNT */}

                    <p className="opacity-70">{total > 0 ? `Showing ${startItem}-${endItem} of ${total}` : 'Showing 0 of 0'}</p>

                    {/* CONTROLS */}

                    <div className="flex items-center gap-2">
                        {/* ROWS PER PAGE */}

                        {setRowsPerPage && (
                            <select value={rowsPerPage} onChange={handleRowsPerPageChange} className="border-app text-app bg-app rounded-lg border px-1.5 py-2">
                                <option value={25}>25</option>

                                <option value={50}>50</option>

                                <option value={75}>75</option>

                                <option value={100}>100</option>
                            </select>
                        )}

                        {/* PREVIOUS */}

                        <button
                            type="button"
                            disabled={page <= 1}
                            onClick={() => handlePageChange(page - 1)}
                            className={`border-app h-9 rounded-lg border px-3 ${page <= 1 ? 'cursor-not-allowed opacity-50' : 'hover-app'}`}
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
                            className={`border-app h-9 rounded-lg border px-3 ${
                                totalPages === 0 || page >= totalPages ? 'cursor-not-allowed opacity-50' : 'hover-app'
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
