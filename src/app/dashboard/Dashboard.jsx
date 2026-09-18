// src/app/dashboard/Dashboard.jsx

'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

import DashboardStats from './components/DashboardStats';
import DashboardAnalytics from './components/DashboardAnalytics';

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
// MAIN DASHBOARD
// ============================================================

export default function Dashboard() {
    const [stats, setStats] = useState(defaultStats);
    const [loading, setLoading] = useState(true);

    // ========================================================
    // GET DASHBOARD STATS
    // ========================================================

    const getDashboardStats = async () => {
        try {
            setLoading(true);

            const res = await axios.get('/api/user/dashboard', {
                withCredentials: true,
            });

            if (res.data?.success) {
                setStats(res.data.data || defaultStats);
            }
        } catch (error) {
            console.error('Failed to load dashboard:', error);

            toast.error(error?.response?.data?.message || 'Failed to load dashboard.');
        } finally {
            setLoading(false);
        }
    };

    // ========================================================
    // INITIAL LOAD
    // ========================================================

    useEffect(() => {
        getDashboardStats();
    }, []);

    // ========================================================
    // UI
    // ========================================================

    return (
        <div className="bg-surface text-app min-h-screen p-4 sm:p-6">
            {/* ==================================================
                HEADER
            ================================================== */}

            <div className="mb-6 sm:mb-8">
                <h1 className="text-2xl sm:text-3xl font-bold">Dashboard</h1>

                <p className="text-xs sm:text-sm opacity-70 mt-1">Welcome to your CRM dashboard.</p>
            </div>

            {/* ==================================================
                STATS
            ================================================== */}

            <DashboardStats stats={stats} loading={loading} />

            {/* ==================================================
                ANALYTICS
            ================================================== */}

            <DashboardAnalytics stats={stats} loading={loading} />
        </div>
    );
}
