// src/components/user/leads/form/Activities.jsx

'use client';

import { Activity } from 'lucide-react';

export default function Activities({ activities = [] }) {
    return (
        <div className="bg-card border-app overflow-hidden rounded-2xl border p-5">
            <h3 className="text-muted text-xs font-semibold tracking-widest uppercase">Activities</h3>

            <div className="border-app my-4 border-b" />

            {activities.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                    <div className="bg-app border-app text-app flex h-14 w-14 items-center justify-center rounded-full border">
                        <Activity size={24} className="opacity-80" />
                    </div>

                    <h4 className="text-app mt-4 text-sm font-medium">No Activities Found</h4>

                    <p className="text-muted mt-1 text-xs">Activity history will appear here.</p>
                </div>
            ) : (
                <div className="space-y-5">
                    {activities.map((activity, idx) => (
                        <div key={activity._id} className="relative pl-8">
                            {/* Timeline */}
                            {idx !== activities.length - 1 && <div className="border-app absolute top-1.5 bottom-0 left-3 h-24 w-px border" />}

                            {/* Dot */}
                            <div className="bg-surface absolute top-1.5 left-0 flex h-6 w-6 items-center justify-center rounded-full border-2 border-blue-500">
                                <Activity size={12} className="text-blue-500" />
                            </div>

                            <div className="border-app bg-app rounded-xl border p-4">
                                <p className="text-app text-sm capitalize">{activity.description}</p>

                                <div className="text-muted mt-2 flex flex-wrap items-center gap-2 text-xs">
                                    <span>
                                        By <strong>{activity.createdBy?.name || 'N/A'}</strong>
                                    </span>

                                    <span>•</span>
                                    {activity.createdBy?.email && (
                                        <>
                                            <span>{activity.createdBy?.email}</span>

                                            <span>•</span>
                                        </>
                                    )}

                                    <span>{new Date(activity.createdAt).toLocaleString()}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
