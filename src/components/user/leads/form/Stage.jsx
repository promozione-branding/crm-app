// src/components/user/leads/form/Stage.jsx

// src/components/user/leads/form/Stage.jsx

'use client';

import { GitBranch } from 'lucide-react';

export default function Stage({ stage = [] }) {
    const sortedStage = [...stage].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    return (
        <div className="bg-card border-app overflow-hidden rounded-2xl border p-5">
            <h3 className="text-muted text-xs font-semibold tracking-widest uppercase">Stage History</h3>

            <div className="border-app my-4 border-b" />

            {stage.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                    <div className="bg-app border-app text-app flex h-14 w-14 items-center justify-center rounded-full border">
                        <GitBranch size={24} className="opacity-80" />
                    </div>

                    <h4 className="text-app mt-4 text-sm font-medium">No Stage History Found</h4>

                    <p className="text-muted mt-1 text-xs">Stage updates will appear here.</p>
                </div>
            ) : (
                <div className="space-y-5">
                    {sortedStage.map((item, idx) => (
                        <div key={item._id} className="relative pl-8">
                            {/* Timeline line */}
                            {idx !== sortedStage.length - 1 && <div className="border-app absolute top-1.5 bottom-0 left-3 h-25 w-px border" />}

                            {/* Timeline dot */}
                            <div className="bg-surface absolute top-1.5 left-0 flex h-6 w-6 items-center justify-center rounded-full border-2 border-blue-500">
                                <GitBranch size={12} className="text-blue-500" />
                            </div>

                            {/* Card */}
                            <div className="border-app bg-app rounded-xl border p-4">
                                <div className="flex flex-wrap items-center justify-between gap-2">
                                    <span className="rounded-full bg-blue-500/10 px-3 py-1 text-xs font-medium text-blue-600 capitalize">{item.stage}</span>

                                    <span className="text-muted text-xs">{new Date(item.createdAt).toLocaleString()}</span>
                                </div>

                                {/* <p className="mt-2 text-sm text-app">
                                    {item.description}
                                </p> */}

                                <div className="text-muted mt-2 text-xs">
                                    Updated by <span className="text-app font-medium">{item.updatedBy?.name || 'N/A'}</span>{' '}
                                    {item.updatedBy?.email && <>({item.updatedBy?.email})</>}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
