// src/app/api/website/status/route.js

import { NextResponse } from 'next/server';
import { connectDB } from '@/config/db';
import { getCurrentUser } from '@/utils/auth';
import Integration from '@/models/integration.model';

export const runtime = 'nodejs';

export async function GET(request) {
    try {
        await connectDB();

        const user = await getCurrentUser(request);
        if (!user) {
            return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
        }

        const companyId = user.companyId;

        const integration = await Integration.findOne({
            companyId,
            provider: 'website',
        }).lean();

        return NextResponse.json({
            success: true,
            integration: integration ? { ...integration, userId: integration.companyId } : null,
        });
    } catch (error) {
        console.error('Website status error:', error);
        return NextResponse.json(
            {
                success: false,
                message: error?.message || 'Failed to get website status',
            },
            { status: 500 }
        );
    }
}
