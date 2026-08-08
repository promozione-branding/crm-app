import { ChevronDown, ChevronUp, MoreVertical } from "lucide-react";

const DynamicTable = ({ loading, columns = [], data = [], page, setPage, total = 0, rowsPerPage = 25, setRowsPerPage, onAction, }) => {
    const getNestedValue = (obj, path) => {
        return path.split(".").reduce((value, key) => {
            return value?.[key];
        }, obj);
    };

    return (
        <div className="rounded-2xl border border-app shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-xs">
                    {/* Header */}
                    <thead className="border-b border-app bg-app">
                        <tr className="">
                            {columns.map((col) => (
                                <th key={col.key} className="px-6 py-4 font-semibold">
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

                            {onAction && (
                                <th className="px-6 py-4 font-semibold text-left">
                                    Action
                                </th>
                            )}
                        </tr>
                    </thead>

                    {/* Body */}
                    <tbody>
                        {loading ? (
                            <tr>
                                <td
                                    colSpan={columns.length + 1}
                                    className="text-center py-10"
                                >
                                    Loading...
                                </td>
                            </tr>
                        ) : data.length > 0 ? (data.map((row, index) => (
                            <tr key={row.id || index} className="border-b border-app hover-app transition bg-surface">
                                {columns.map((col) => (
                                    <td key={col.key} className="px-6 py-4 capitalize">
                                        {col.render ? col.render(row) : col.type === "date"
                                            ? new Date(row[col.key]).toLocaleString() : getNestedValue(row, col.key) ?? "-"}
                                    </td>
                                ))}

                                {onAction && (
                                    <td className="px-6 py-4">
                                        <button onClick={() => onAction(row)} className="w-8 h-8 rounded-lg btn-primary flex items-center justify-center">
                                            <MoreVertical size={18} />
                                        </button>
                                    </td>
                                )}
                            </tr>
                        ))) : (
                            <tr>
                                <td colSpan={columns.length + 1} className="text-center py-10 opacity-60">
                                    No Data Found
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            {setPage && (
                <div className="flex items-center justify-between px-6 py-2 bg-app text-xs">
                    <p className="opacity-70">
                        {total > 0
                            ? `Showing ${(page - 1) * rowsPerPage + 1}-${Math.min(page * rowsPerPage, total)} of ${total}`
                            : "Showing 0 of 0"}
                    </p>

                    <div className="flex gap-2 items-center">
                        <select value={rowsPerPage} onChange={(e) => { setRowsPerPage(Number(e.target.value)); setPage(1); }} className="border border-app px-1.5 py-2 rounded-lg text-app bg-app">
                            <option value={25}>25</option>
                            <option value={50}>50</option>
                            <option value={75}>75</option>
                            <option value={100}>100</option>
                        </select>

                        <button disabled={page <= 1} onClick={() => setPage(page - 1)}
                            className={`px-3 h-9 rounded-lg border border-app ${page <= 1 ? "opacity-50 cursor-not-allowed" : "hover-app"}`}>
                            Prev
                        </button>

                        <button className="px-3 h-8 rounded-lg bg-blue-600 text-white">
                            {page}
                        </button>

                        <button disabled={page >= Math.ceil(total / rowsPerPage)} onClick={() => setPage(page + 1)}
                            className={`px-3 h-9 rounded-lg border border-app ${page >= Math.ceil(total / rowsPerPage) ? "opacity-50 cursor-not-allowed" : "hover-app"}`}>
                            Next
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DynamicTable;