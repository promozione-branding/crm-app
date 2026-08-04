"use client";

import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import SelectInput from "./SelectInput";

export default function FilterSidebar({ open, onClose, filters, setFilters, onApply, onReset, }) {

    return (
        <AnimatePresence>
            {open && (
                <>
                    {/* Overlay */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.4 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black z-40"
                    />

                    {/* Sidebar */}
                    <motion.div
                        initial={{ x: 380 }}
                        animate={{ x: 0 }}
                        exit={{ x: 380 }}
                        transition={{ duration: 0.25 }}
                        className="fixed right-0 top-0 h-screen w-full sm:w-96 bg-white z-50 shadow-xl flex flex-col text-gray-800"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between border-b border-gray-300 px-4 py-2">
                            <h2 className="text-lg font-semibold ">
                                Filters
                            </h2>

                            <button
                                onClick={onClose}
                                className="p-2 rounded-lg hover:bg-gray-100"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Body */}
                        <div className="flex-1 overflow-y-auto p-5 space-y-5">
                            <SelectInput
                                label="Status"
                                value={filters.status}
                                onChange={(e) =>
                                    setFilters({
                                        ...filters,
                                        status: e.target.value,
                                    })
                                }
                                options={[
                                    { label: "All", value: "" },
                                    { label: "Active", value: "active" },
                                    { label: "Inactive", value: "inactive" },
                                    { label: "Blocked", value: "blocked" },
                                ]}
                            />

                            <SelectInput
                                label="Plan"
                                value={filters.plan}
                                onChange={(e) =>
                                    setFilters({
                                        ...filters,
                                        plan: e.target.value,
                                    })
                                }
                                options={[
                                    { label: "All", value: "" },
                                    { label: "Free", value: "free" },
                                    { label: "Starter", value: "starter" },
                                    { label: "Growth", value: "growth" },
                                    { label: "Pro", value: "pro" },
                                    { label: "Elite", value: "elite" },
                                ]}
                            />
                        </div>

                        {/* Footer */}
                        <div className="border-t border-gray-300 px-4 py-2 flex gap-3">
                            <button
                                onClick={onReset}
                                className="flex-1 rounded-lg border border-gray-300 py-2.5 hover:bg-gray-100"
                            >
                                Reset
                            </button>

                            <button
                                onClick={onApply}
                                className="flex-1 rounded-lg bg-[#082c62] text-white py-2.5 hover:bg-[#051f48]"
                            >
                                Apply
                            </button>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}