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
        <div
            className="
                w-full
                grid
                grid-cols-4
                gap-2
                sm:flex
                sm:items-center
                sm:justify-between
                sm:gap-4
                lg:gap-6
            "
        >
            {statsConfig.map((item) => {
                const Icon = item.icon;

                return (
                    <div
                        key={item.key}
                        className="
                            flex
                            items-center
                            justify-center
                            sm:justify-start
                            gap-1.5
                            sm:gap-2.5
                            min-w-0

                            px-1.5
                            py-1.5

                            sm:px-3
                            sm:py-2

                            rounded-lg
                            sm:rounded-xl

                            border
                            border-transparent
                            sm:border-app

                            shadow-none
                            sm:shadow-sm

                            bg-transparent
                            sm:bg-app

                            transition-all
                            sm:hover:-translate-y-0.5
                            sm:hover:shadow-md
                        "
                    >
                        {/* ICON */}
                        <div
                            className={`
                                shrink-0
                                flex
                                items-center
                                justify-center
                                w-7
                                h-7
                                sm:w-8
                                sm:h-8
                                rounded-lg
                                ${item.iconBg}
                            `}
                        >
                            <Icon size={14} className={item.iconClass} />
                        </div>

                        {/* LABEL + VALUE */}
                        <div className="flex items-baseline gap-1.5 min-w-0">
                            <span
                                className="
                                    text-[11px]
                                    sm:text-sm
                                    opacity-60
                                "
                            >
                                {item.label}
                            </span>

                            <span
                                className="
                                    text-sm
                                    sm:text-lg
                                    font-bold
                                "
                            >
                                {loading ? '...' : stats[item.key]}
                            </span>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
