"use client";

import { GitBranch } from "lucide-react";

export default function Stage({ stage = [] }) {
    return (
        <div className="bg-card border border-app rounded-2xl p-5 overflow-hidden">
            <h3 className="uppercase tracking-widest text-xs font-semibold text-muted">
                Stage History
            </h3>

            <div className="border-b border-app my-4" />

            {stage.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                    <div className="w-14 h-14 rounded-full bg-app border border-app flex items-center justify-center text-app">
                        <GitBranch size={24} className="opacity-80" />
                    </div>

                    <h4 className="mt-4 text-sm font-medium text-app">
                        No Stage History Found
                    </h4>

                    <p className="mt-1 text-xs text-muted">
                        Stage updates will appear here.
                    </p>
                </div>
            ) : (
                <div className="space-y-5">
                    {stage.map((item, idx) => (
                        <div key={item._id} className="relative pl-8">
                            {/* Timeline line */}
                            {idx !== stage.length - 1 && (
                                <div className="absolute left-3 top-1.5 bottom-0 w-px border border-app h-25" />
                            )}

                            {/* Timeline dot */}
                            <div className="absolute left-0 top-1.5 w-6 h-6 rounded-full border-2 border-blue-500 bg-surface flex items-center justify-center">
                                <GitBranch size={12} className="text-blue-500" />
                            </div>

                            {/* Card */}
                            <div className="rounded-xl border border-app bg-app p-4">
                                <div className="flex flex-wrap items-center justify-between gap-2">
                                    <span className="px-3 py-1 rounded-full bg-blue-500/10 text-blue-600 text-xs font-medium capitalize">
                                        {item.stage}
                                    </span>

                                    <span className="text-xs text-muted">
                                        {new Date(item.createdAt).toLocaleString()}
                                    </span>
                                </div>

                                {/* <p className="mt-2 text-sm text-app">
                                    {item.description}
                                </p> */}

                                <div className="mt-2 text-xs text-muted">
                                    Updated by{" "}
                                    <span className="font-medium text-app">
                                        {item.updatedBy?.name || "N/A"}
                                    </span>{" "}
                                    {item.updatedBy?.email && <>
                                        ({item.updatedBy?.email})
                                    </>}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}