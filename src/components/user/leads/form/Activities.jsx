"use client";

import { Activity } from "lucide-react";

export default function Activities({ activities = [] }) {
    return (
        <div className="bg-card border border-app rounded-2xl p-5 overflow-hidden">
            <h3 className="uppercase tracking-widest text-xs font-semibold text-muted">
                Activities
            </h3>

            <div className="border-b border-app my-4" />

            {activities.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                    <div className="w-14 h-14 rounded-full bg-app border border-app flex items-center justify-center text-app">
                        <Activity size={24} className="opacity-80" />
                    </div>

                    <h4 className="mt-4 text-sm font-medium text-app">
                        No Activities Found
                    </h4>

                    <p className="mt-1 text-xs text-muted">
                        Activity history will appear here.
                    </p>
                </div>
            ) : (
                <div className="space-y-5">
                    {activities.map((activity, idx) => (
                        <div
                            key={activity._id}
                            className="relative pl-8"
                        >
                            {/* Timeline */}
                            {idx !== activities.length - 1 && (
                                <div className="absolute left-3 top-1.5 bottom-0 w-px border border-app h-24" />)}

                            {/* Dot */}
                            <div className="absolute left-0 top-1.5 w-6 h-6 rounded-full border-2 border-blue-500 bg-surface flex items-center justify-center">
                                <Activity size={12} className="text-blue-500" />
                            </div>

                            <div className="rounded-xl border border-app bg-app p-4">
                                <p className="text-sm text-app capitalize">
                                    {activity.description}
                                </p>

                                <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-muted">
                                    <span>
                                        By <strong>{activity.createdBy?.name || "N/A"}</strong>
                                    </span>

                                    <span>•</span>
                                    {activity.createdBy?.email && <>
                                        <span>{activity.createdBy?.email}</span>

                                        <span>•</span></>}

                                    <span>
                                        {new Date(activity.createdAt).toLocaleString()}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}