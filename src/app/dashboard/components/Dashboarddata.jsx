// src/app/dashboard/components/Dashboarddata.jsx

'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { Users, UserPlus, Phone, ClipboardList } from 'lucide-react';

// ============================================================
// DEFAULT STATS
// ============================================================

const defaultStats = {
    users: 0,
    leads: 0,
    calls: 0,
    tasks: 0,
};

// ============================================================
// STATS CONFIG
// ============================================================

const statsConfig = [
    {
        key: 'users',
        label: 'Users',
        icon: Users,
        iconClass: 'text-blue-500',
        iconBg: 'bg-blue-500/10',
    },
    {
        key: 'leads',
        label: 'Leads',
        icon: UserPlus,
        iconClass: 'text-green-500',
        iconBg: 'bg-green-500/10',
    },
    {
        key: 'calls',
        label: 'Calls',
        icon: Phone,
        iconClass: 'text-purple-500',
        iconBg: 'bg-purple-500/10',
    },
    {
        key: 'tasks',
        label: 'Tasks',
        icon: ClipboardList,
        iconClass: 'text-orange-500',
        iconBg: 'bg-orange-500/10',
    },
];

// ============================================================
// COMPONENT
// ============================================================

export default function Dashboarddata() {
    const [stats, setStats] = useState(defaultStats);
    const [loading, setLoading] = useState(true);

    // ========================================================
    // GET DASHBOARD STATS
    // ========================================================

    useEffect(() => {
        const getDashboardStats = async () => {
            try {
                const res = await axios.get('/api/user/dashboard', {
                    withCredentials: true,
                });

                if (res.data?.success) {
                    setStats({
                        ...defaultStats,
                        ...(res.data.data || {}),
                    });
                }
            } catch (error) {
                console.error('Failed to load dashboard stats:', error);
            } finally {
                setLoading(false);
            }
        };

        getDashboardStats();
    }, []);

    // ========================================================
    // UI
    // ========================================================

    return (
        <div className="grid w-full grid-cols-4 gap-2 sm:flex sm:items-center sm:justify-between sm:gap-4 lg:gap-6">
            {statsConfig.map((item) => {
                const Icon = item.icon;

                return (
                    <div
                        key={item.key}
                        className="sm:border-app sm:bg-app flex min-w-0 flex-col items-center justify-center gap-1 rounded-lg border border-transparent bg-transparent px-1.5 py-2 shadow-none transition-all sm:flex-row sm:items-center sm:justify-start sm:gap-2.5 sm:rounded-xl sm:px-3 sm:py-2 sm:shadow-sm sm:hover:-translate-y-0.5 sm:hover:shadow-md"
                    >
                        {/* ICON */}
                        <div className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-lg sm:h-7 sm:w-7 ${item.iconBg} `}>
                            <Icon size={16} className={item.iconClass} />
                        </div>

                        {/* LABEL + VALUE
                            Mobile  → stacked (label on top, value below), centered
                            Desktop → inline side by side
                        */}
                        <div className="flex w-full min-w-0 flex-col items-center sm:w-auto sm:flex-row sm:items-baseline sm:gap-1.5">
                            <span className="max-w-full truncate text-[10px] leading-none opacity-60 sm:text-sm">{item.label}</span>

                            <span className="max-w-full truncate text-sm leading-tight font-bold sm:text-lg">{loading ? '...' : stats[item.key]}</span>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
