// src/app/dashboard/components/PageStats.jsx

'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';

import {
    Phone,
    PhoneCall,
    PhoneMissed,
    PhoneOff,
    CheckCircle2,
    XCircle,
    ClipboardList,
    Clock,
    AlertCircle,
    CalendarClock,
    UserPlus,
    TrendingUp,
    Trophy,
    Target,
} from 'lucide-react';

// ============================================================
// ENDPOINTS
// ============================================================

const ENDPOINTS = {
    calls: '/api/user/call/stats',
    tasks: '/api/user/task/stats',
    leads: '/api/user/lead/stats',
};

// ============================================================
// STAT CONFIG BUILDERS  (unchanged — all your fields kept)
// ============================================================

const builders = {
    calls: () => [
        { key: 'total', label: 'Total', icon: PhoneCall, iconClass: 'text-purple-500', iconBg: 'bg-purple-500/10' },
        { key: 'today', label: 'Today', icon: Phone, iconClass: 'text-blue-500', iconBg: 'bg-blue-500/10' },
        {
            key: 'completed',
            label: 'Connected',
            icon: CheckCircle2,
            iconClass: 'text-green-500',
            iconBg: 'bg-green-500/10',
            from: 'byStatus.completed',
        },
        {
            key: 'missed',
            label: 'Missed',
            icon: PhoneMissed,
            iconClass: 'text-red-500',
            iconBg: 'bg-red-500/10',
            from: 'byStatus.missed',
        },
        {
            key: 'no_answer',
            label: 'No Answer',
            icon: PhoneOff,
            iconClass: 'text-orange-500',
            iconBg: 'bg-orange-500/10',
            from: 'byStatus.no_answer',
        },
        {
            key: 'failed',
            label: 'Failed',
            icon: XCircle,
            iconClass: 'text-red-600',
            iconBg: 'bg-red-600/10',
            from: 'byStatus.failed',
        },
    ],

    tasks: () => [
        { key: 'total', label: 'Total', icon: ClipboardList, iconClass: 'text-orange-500', iconBg: 'bg-orange-500/10' },
        { key: 'pending', label: 'Pending', icon: Clock, iconClass: 'text-yellow-500', iconBg: 'bg-yellow-500/10' },
        {
            key: 'completed',
            label: 'Completed',
            icon: CheckCircle2,
            iconClass: 'text-green-500',
            iconBg: 'bg-green-500/10',
        },
        { key: 'overdue', label: 'Overdue', icon: AlertCircle, iconClass: 'text-red-500', iconBg: 'bg-red-500/10' },
        {
            key: 'dueToday',
            label: 'Due Today',
            icon: CalendarClock,
            iconClass: 'text-blue-500',
            iconBg: 'bg-blue-500/10',
        },
        { key: 'cancelled', label: 'Cancelled', icon: XCircle, iconClass: 'text-gray-500', iconBg: 'bg-gray-500/10' },
    ],

    leads: () => [
        { key: 'total', label: 'Total', icon: UserPlus, iconClass: 'text-blue-500', iconBg: 'bg-blue-500/10' },
        {
            key: 'new',
            label: 'New',
            icon: UserPlus,
            iconClass: 'text-cyan-500',
            iconBg: 'bg-cyan-500/10',
            from: 'pipeline.new',
        },
        {
            key: 'contacted',
            label: 'Contacted',
            icon: Phone,
            iconClass: 'text-yellow-500',
            iconBg: 'bg-yellow-500/10',
            from: 'pipeline.contacted',
        },
        {
            key: 'qualified',
            label: 'Qualified',
            icon: TrendingUp,
            iconClass: 'text-violet-500',
            iconBg: 'bg-violet-500/10',
            from: 'pipeline.qualified',
        },
        {
            key: 'won',
            label: 'Won',
            icon: Trophy,
            iconClass: 'text-green-500',
            iconBg: 'bg-green-500/10',
            from: 'pipeline.won',
        },
        {
            key: 'lost',
            label: 'Lost',
            icon: XCircle,
            iconClass: 'text-red-500',
            iconBg: 'bg-red-500/10',
            from: 'pipeline.lost',
        },
        {
            key: 'conversionRate',
            label: 'Conversion',
            icon: Target,
            iconClass: 'text-green-600',
            iconBg: 'bg-green-600/10',
            suffix: '%',
        },
    ],
};

// ============================================================
// HELPERS
// ============================================================

const readPath = (obj, path) => path.split('.').reduce((acc, key) => (acc && acc[key] !== undefined ? acc[key] : undefined), obj);

// ============================================================
// HOOK — fetch stats + expose isAdmin
// ============================================================

export function usePageStats(type) {
    const [data, setData] = useState(null);
    const [isAdmin, setIsAdmin] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let cancelled = false;

        const load = async () => {
            try {
                setLoading(true);

                const res = await axios.get(ENDPOINTS[type], { withCredentials: true });

                if (cancelled) return;

                if (res.data?.success) {
                    setData(res.data.data);
                    setIsAdmin(res.data.data?.isAdmin === true);
                }
            } catch (err) {
                console.error(`Failed to load ${type} stats:`, err);
            } finally {
                if (!cancelled) setLoading(false);
            }
        };

        load();

        return () => {
            cancelled = true;
        };
    }, [type]);

    return { data, isAdmin, loading };
}

// ============================================================
// COMPONENT — compact strip matching Dashboarddata
// ============================================================

export default function PageStats({ type, data, loading }) {
    const config = builders[type]?.() || [];

    return (
        <div className="grid w-full grid-cols-4 gap-x-2 gap-y-3 sm:flex sm:flex-wrap sm:items-center sm:justify-around sm:gap-x-4 sm:gap-y-3 lg:gap-x-6">
            {config.map((item) => {
                const Icon = item.icon;

                let value = item.from ? readPath(data || {}, item.from) : data?.[item.key];

                if (value === undefined || value === null) value = 0;

                if (item.suffix) value = `${value}${item.suffix}`;

                return (
                    <div
                        key={item.key}
                        className="sm:border-app sm:bg-app flex min-w-0 flex-col items-center justify-center gap-1 rounded-lg border border-transparent bg-transparent px-1.5 py-2 shadow-none transition-all sm:flex-row sm:items-center sm:justify-start sm:gap-2.5 sm:rounded-xl sm:px-3 sm:py-2 sm:shadow-sm sm:hover:-translate-y-0.5 sm:hover:shadow-md"
                    >
                        {/* ICON */}
                        <div
                            className={`flex h-[42px] w-[42px] shrink-0 items-center justify-center rounded-xl sm:h-[40px] sm:w-[40px] sm:rounded-lg ${item.iconBg}`}
                        >
                            <Icon size={26} className={`${item.iconClass} sm:hidden`} />
                            <Icon size={22} className={`${item.iconClass} hidden sm:block`} />
                        </div>

                        {/* LABEL + VALUE */}
                        <div className="flex w-full min-w-0 flex-col items-center sm:w-auto sm:flex-row sm:items-baseline sm:gap-1.5">
                            <span className="max-w-full truncate text-[10px] leading-none opacity-60 sm:text-sm">{item.label}</span>

                            <span className="max-w-full truncate text-sm leading-tight font-bold sm:text-lg">{loading ? '...' : value}</span>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
