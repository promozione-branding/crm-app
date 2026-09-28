// src/app/leads/edit/[id]/components/EditHeader.jsx
'use client';

import Link from 'next/link';
import {
    Activity, ArrowLeft, ClipboardCheck, FileText,
    LaptopMinimalCheck, Phone, TrendingUp, User,
} from 'lucide-react';

export default function EditHeader({ lead, loading, onEdit, active, setActive }) {
    const tabs = [
        { id: 'Insight', label: 'Insight', icon: User },
        { id: 'overview', label: 'Overview', icon: User },
        { id: 'meeting', label: 'Meetings', icon: LaptopMinimalCheck, badge: lead?.meetingCount || '0' },
        { id: 'notes', label: 'Notes', icon: FileText, badge: lead?.notes?.length || '0' },
        { id: 'activities', label: 'Activities', icon: Activity, badge: lead?.activities?.length || '0' },
        { id: 'calls', label: 'Call History', icon: Phone, badge: lead?.callCount || '0' },
        { id: 'stage', label: 'Stage History', icon: TrendingUp, badge: lead?.stageHistory?.length || '0' },
        { id: 'task', label: 'Tasks', icon: ClipboardCheck, badge: lead?.taskCount || '0' },
    ];

    return (
        <>
            {/* HEADER */}
            <div className="bg-surface border-app sticky top-16 z-40 flex h-16 items-center justify-between border-b px-1 md:px-8">
                <div className="flex items-center gap-1 md:gap-2">
                    <Link href="/leads" className="bg-app border-app hover-app text-app rounded-xl border p-2">
                        <ArrowLeft size={20} />
                    </Link>

                    <h1 className="text-app flex flex-col text-sm font-bold">
                        {lead?.name || '-'}
                        <span className="text-muted flex items-center gap-1 text-xs">
                            <User size={12} />
                            {lead?.assignedTo?.name}
                        </span>
                    </h1>
                </div>

                <div className="flex gap-1 text-sm md:gap-2">
                    <Link href="/leads" className="bg-app border-app hover-app text-app flex h-8 items-center rounded-lg border px-3">
                        Cancel
                    </Link>
                    <button disabled={loading} onClick={onEdit} className="btn-primary h-8 rounded-lg px-3">
                        {loading ? 'Editing' : 'Edit Lead'}
                    </button>
                </div>
            </div>

            {/* TABS */}
            <div className="bg-surface border-app sticky top-32 z-40 flex h-10 items-center overflow-x-auto overflow-y-hidden border-b px-1 md:px-4">
                {tabs.map((tab) => {
                    const Icon = tab.icon;
                    const isActive = active === tab.id;
                    return (
                        <button
                            key={tab.id}
                            onClick={() => setActive(tab.id)}
                            className={`relative flex h-11 min-w-max items-center justify-center gap-2 border-b-2 px-5 text-sm font-medium whitespace-nowrap transition-all duration-200 ${
                                isActive
                                    ? 'border-blue-600 bg-blue-500/10 text-blue-600 dark:text-blue-400'
                                    : 'text-app hover-app border-transparent'
                            }`}
                        >
                            <Icon size={16} />
                            <span>{tab.label}</span>
                            {tab.badge && (
                                <span className={`flex h-5 min-w-5 items-center justify-center rounded-full text-[10px] ${
                                    isActive ? 'bg-blue-600 text-white' : 'bg-app border-app text-app border'
                                }`}>
                                    {tab.badge}
                                </span>
                            )}
                        </button>
                    );
                })}
            </div>
        </>
    );
}