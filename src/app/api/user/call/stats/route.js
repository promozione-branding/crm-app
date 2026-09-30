// src/app/api/user/call/stats/route.js

// src/app/api/user/call-logs/stats/route.js

import { NextResponse } from 'next/server';

import { connectDB } from '@/config/db';
import { getCurrentUser } from '@/utils/auth';

import Call from '@/models/call.model';

export async function GET(request) {
    try {
        await connectDB();

        const user = await getCurrentUser(request);

        if (!user) {
            return NextResponse.json({ success: false, message: 'User not found.' }, { status: 401 });
        }

        const companyId = user.companyId;
        const userId = user._id;

        await user.populate({ path: 'roleId', select: 'name isSystemRole' });

        const isAdmin = user.roleId?.isSystemRole === true && user.roleId?.name?.toLowerCase() === 'admin';

        const callFilter = isAdmin ? { companyId } : { companyId, callerId: userId };

        const now = new Date();
        const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const dayOfWeek = now.getDay();
        const daysFromMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
        const startOfWeek = new Date(now.getFullYear(), now.getMonth(), now.getDate() - daysFromMonday);
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

        const [totalsAgg, statusAgg] = await Promise.all([
            Call.aggregate([
                { $match: callFilter },
                {
                    $group: {
                        _id: null,
                        total: { $sum: 1 },
                        today: { $sum: { $cond: [{ $gte: ['$calledAt', startOfToday] }, 1, 0] } },
                        week: { $sum: { $cond: [{ $gte: ['$calledAt', startOfWeek] }, 1, 0] } },
                        month: { $sum: { $cond: [{ $gte: ['$calledAt', startOfMonth] }, 1, 0] } },
                    },
                },
            ]),
            Call.aggregate([{ $match: callFilter }, { $group: { _id: '$status', count: { $sum: 1 } } }]),
        ]);

        const totals = totalsAgg[0] || { total: 0, today: 0, week: 0, month: 0 };

        const byStatus = {
            initiated: 0,
            completed: 0,
            missed: 0,
            busy: 0,
            no_answer: 0,
            failed: 0,
        };

        statusAgg.forEach((row) => {
            if (row._id in byStatus) byStatus[row._id] = row.count;
        });

        const meaningful = byStatus.completed + byStatus.missed + byStatus.busy + byStatus.no_answer + byStatus.failed;
        const connectionRate = meaningful > 0 ? Number(((byStatus.completed / meaningful) * 100).toFixed(1)) : 0;

        return NextResponse.json({
            success: true,
            data: {
                isAdmin,
                total: totals.total || 0,
                today: totals.today || 0,
                week: totals.week || 0,
                month: totals.month || 0,
                byStatus,
                connectionRate,
            },
        });
    } catch (error) {
        console.error('GET CALL LOGS STATS ERROR:', error);
        return NextResponse.json({ success: false, message: error.message || 'Failed to fetch call stats.' }, { status: 500 });
    }
}
