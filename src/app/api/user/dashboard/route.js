// src/app/api/user/dashboard/route.js

import { NextResponse } from 'next/server';

import { connectDB } from '@/config/db';
import { getCurrentUser } from '@/utils/auth';

import User from '@/models/user.model';
import Lead from '@/models/leads.model';
import LeadTask from '@/models/task.model';
import Call from '@/models/call.model';

export async function GET(request) {
    try {
        await connectDB();

        const user = await getCurrentUser(request);

        if (!user) {
            return NextResponse.json(
                { success: false, message: 'User not found.' },
                { status: 401 }
            );
        }

        const companyId = user.companyId;

        // ---- Time ranges for calls
        const now = new Date();
        const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const startOfWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        const startOfMonth = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

        const [
            usersCount,
            leadsCount,
            tasksCount,
            callsTotal,
            callsToday,
            callsWeek,
            callsMonth,
            callsByStatus,
            callsByCaller,
            recentCalls,
        ] = await Promise.all([
            User.countDocuments({ companyId }),

            Lead.countDocuments({ companyId }),

            LeadTask.countDocuments({ companyId }),

            // ---- Total calls
            Call.countDocuments({ companyId }),

            // ---- Calls today
            Call.countDocuments({
                companyId,
                calledAt: { $gte: startOfToday },
            }),

            // ---- Calls last 7 days
            Call.countDocuments({
                companyId,
                calledAt: { $gte: startOfWeek },
            }),

            // ---- Calls last 30 days
            Call.countDocuments({
                companyId,
                calledAt: { $gte: startOfMonth },
            }),

            // ---- Calls grouped by status (initiated, completed, missed, etc.)
            Call.aggregate([
                { $match: { companyId } },
                { $group: { _id: '$status', count: { $sum: 1 } } },
            ]),

            // ---- Calls grouped by caller (who calls most)
            Call.aggregate([
                { $match: { companyId } },
                {
                    $group: {
                        _id: '$callerId',
                        count: { $sum: 1 },
                    },
                },
                { $sort: { count: -1 } },
                { $limit: 5 },
                {
                    $lookup: {
                        from: 'users',
                        localField: '_id',
                        foreignField: '_id',
                        as: 'user',
                    },
                },
                { $unwind: { path: '$user', preserveNullAndEmptyArrays: true } },
                {
                    $project: {
                        _id: 1,
                        count: 1,
                        name: '$user.name',
                        email: '$user.email',
                    },
                },
            ]),

            // ---- Latest 5 calls with caller + lead info
            Call.find({ companyId })
                .sort({ calledAt: -1 })
                .limit(5)
                .populate('callerId', 'name email')
                .populate('refId', 'name phone')
                .lean(),
        ]);

        // ---- Convert byStatus array to a clean object
        const statusMap = callsByStatus.reduce((acc, item) => {
            acc[item._id] = item.count;
            return acc;
        }, {});

        return NextResponse.json({
            success: true,

            data: {
                users: usersCount,
                leads: leadsCount,
                tasks: tasksCount,

                // ---- Flat calls count (for the top stat card)
                calls: callsTotal,

                // ---- Detailed call metrics
                callsDetail: {
                    total: callsTotal,
                    today: callsToday,
                    week: callsWeek,
                    month: callsMonth,
                    byStatus: {
                        initiated: statusMap.initiated || 0,
                        completed: statusMap.completed || 0,
                        missed: statusMap.missed || 0,
                        busy: statusMap.busy || 0,
                        no_answer: statusMap.no_answer || 0,
                        failed: statusMap.failed || 0,
                    },
                    byCaller: callsByCaller,
                    recent: recentCalls,
                },
            },
        });
    } catch (error) {
        console.error('GET DASHBOARD ERROR:', error);

        return NextResponse.json(
            { success: false, message: error.message || 'Failed to fetch dashboard data.' },
            { status: 400 }
        );
    }
}