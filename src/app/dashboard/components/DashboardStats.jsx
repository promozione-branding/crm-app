// src/app/dashboard/components/DashboardStats.jsx

'use client';

import { Users, UserPlus, Phone, ClipboardList } from 'lucide-react';

import StatCard from './StatCard';

// ============================================================
// STATS CONFIG
// ============================================================

const statsConfig = [
    {
        key: 'users',
        title: 'Users',
        icon: Users,
        color: 'text-blue-500',
    },
    {
        key: 'leads',
        title: 'Leads',
        icon: UserPlus,
        color: 'text-green-500',
    },
    {
        key: 'calls',
        title: 'Calls',
        icon: Phone,
        color: 'text-purple-500',
    },
    {
        key: 'tasks',
        title: 'Tasks',
        icon: ClipboardList,
        color: 'text-orange-500',
    },
];

// ============================================================
// COMPONENT
// ============================================================

export default function DashboardStats({ stats, loading }) {
    return (
        <div
            className="
                grid
                grid-cols-2
                gap-3
                sm:gap-4
                md:grid-cols-2
                lg:grid-cols-4
                lg:gap-6
            "
        >
            {statsConfig.map((item) => {
                const Icon = item.icon;

                return <StatCard key={item.key} title={item.title} value={stats[item.key]} icon={Icon} color={item.color} loading={loading} />;
            })}
        </div>
    );
}
