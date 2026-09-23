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
    const [stats, setStats] =
        useState(defaultStats);

    const [analytics, setAnalytics] =
        useState(null);

    const [loading, setLoading] =
        useState(true);

    const [analyticsLoading, setAnalyticsLoading] =
        useState(true);

    // ========================================================
    // GET DASHBOARD STATS
    // ========================================================

    const getDashboardStats = async () => {
        try {
            setLoading(true);

            const res = await axios.get(
                '/api/user/dashboard',
                {
                    withCredentials: true,
                }
            );

            if (res.data?.success) {
                setStats({
                    ...defaultStats,
                    ...(res.data.data || {}),
                });
            }
        } catch (error) {
            console.error(
                'Failed to load dashboard:',
                error
            );

            toast.error(
                error?.response?.data?.message ||
                    'Failed to load dashboard.'
            );
        } finally {
            setLoading(false);
        }
    };

    // ========================================================
    // GET DASHBOARD ANALYTICS
    // ========================================================

    const getDashboardAnalytics =
        async () => {
            try {
                setAnalyticsLoading(true);

                const res = await axios.get(
                    '/api/user/dashboard/analytics',
                    {
                        withCredentials: true,
                    }
                );

                if (res.data?.success) {
                    setAnalytics(
                        res.data.data || null
                    );
                }
            } catch (error) {
                console.error(
                    'Failed to load dashboard analytics:',
                    error
                );

                toast.error(
                    error?.response?.data?.message ||
                        'Failed to load dashboard analytics.'
                );
            } finally {
                setAnalyticsLoading(false);
            }
        };

    // ========================================================
    // INITIAL LOAD
    // ========================================================

    useEffect(() => {
        getDashboardStats();

        getDashboardAnalytics();
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

                <h1 className="text-2xl font-bold sm:text-3xl">
                    Dashboard
                </h1>

                <p className="mt-1 text-xs opacity-70 sm:text-sm">
                    Welcome to your CRM dashboard.
                </p>

            </div>

            {/* ==================================================
                TOP STATS
            ================================================== */}

            <DashboardStats
                stats={stats}
                loading={loading}
            />

            {/* ==================================================
                ANALYTICS
            ================================================== */}

            <DashboardAnalytics
                analytics={analytics}
                loading={analyticsLoading}
            />

        </div>
    );
}