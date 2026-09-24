import { NextResponse } from 'next/server';

import { connectDB } from '@/config/db';
import { getCurrentUser } from '@/utils/auth';
import { getReportsService } from '@/controllers/user/reportsController';

export async function GET(request) {
    try {
        await connectDB();

        const user = await getCurrentUser(request);

        if (!user) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'User not found.',
                },
                { status: 401 }
            );
        }

        await user.populate({
            path: 'roleId',
            select: 'name isSystemRole permissions',
        });

        const { searchParams } = new URL(request.url);

        const range =
            searchParams.get('range') || 'this_month';

        const from = searchParams.get('from');
        const to = searchParams.get('to');

        const allowedRanges = [
            'today',
            'last_3_days',
            'this_month',
            'last_month',
            'last_3_months',
            'custom',
        ];

        if (!allowedRanges.includes(range)) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'Invalid report range.',
                },
                { status: 400 }
            );
        }

        const data = await getReportsService({
            user,
            range,
            from,
            to,
        });

        return NextResponse.json({
            success: true,
            data,
        });
    } catch (error) {
        console.error('GET REPORTS ERROR:', error);

        return NextResponse.json(
            {
                success: false,
                message:
                    error?.message ||
                    'Failed to fetch reports.',
            },
            { status: 500 }
        );
    }
}
