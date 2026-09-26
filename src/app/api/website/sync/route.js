// src/app/api/website/sync/route.js

import { NextResponse } from 'next/server';
import { connectDB } from '@/config/db';
import { getCurrentUser } from '@/utils/auth';
import { syncBrandBnaloLeads } from '@/utils/integrations/syncLeads';

export const runtime = 'nodejs';

export async function POST(request) {
    try {
        await connectDB();

        const user = await getCurrentUser(request);
        if (!user) {
            return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
        }

        const result = await syncBrandBnaloLeads(user.companyId);
        return NextResponse.json(result, {
            status: result.success ? 200 : 400,
        });
    } catch (error) {
        console.error('Manual sync error:', error);
        return NextResponse.json(
            {
                success: false,
                message: error?.message || 'Website sync failed',
            },
            { status: 500 }
        );
    }
}
