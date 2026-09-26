// src/app/api/website/disconnect/route.js

import { NextResponse } from 'next/server';
import { connectDB } from '@/config/db';
import { getCurrentUser } from '@/utils/auth';
import Integration from '@/models/integration.model';

export const runtime = 'nodejs';

export async function POST(request) {
    try {
        await connectDB();

        const user = await getCurrentUser(request);
        if (!user) {
            return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
        }

        const companyId = user.companyId;

        const integration = await Integration.findOneAndUpdate(
            { companyId, provider: 'website' },
            {
                $set: {
                    status: 'disconnected',
                    errorMessage: null,
                },
            },
            { new: true }
        );

        if (!integration) {
            return NextResponse.json({
                success: true,
                message: 'Website integration was already disconnected',
            });
        }

        return NextResponse.json({
            success: true,
            message: 'Website disconnected successfully',
            integration: {
                ...integration.toObject(),
                userId: integration.companyId,
            },
        });
    } catch (error) {
        console.error('Website disconnect error:', error);
        return NextResponse.json(
            {
                success: false,
                message: error?.message || 'Failed to disconnect website',
            },
            { status: 500 }
        );
    }
}
