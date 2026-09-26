// src/app/api/website/connect/route.js
//1
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

        // The company sends their brandbnalo sellerId when connecting.
        // It's stored in metadata so the cron knows which sellerId to poll.
        const body = await request.json().catch(() => ({}));
        const sellerId = String(body?.sellerId || '').trim();

        if (!sellerId) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'Seller ID is required. Get it from your BrandBnalo dashboard.',
                },
                { status: 400 }
            );
        }

        const integration = await Integration.findOneAndUpdate(
            { companyId, provider: 'website' },
            {
                $set: {
                    status: 'connected',
                    connectedAt: new Date(),
                    errorMessage: null,
                    'metadata.brandBnaloSellerId': sellerId,
                },
            },
            { new: true, upsert: true, setDefaultsOnInsert: true }
        );

        return NextResponse.json({
            success: true,
            message: 'Website connected successfully',
            integration: {
                ...integration.toObject(),
                userId: integration.companyId, // for UI compatibility
            },
        });
    } catch (error) {
        console.error('Website connect error:', error);
        return NextResponse.json(
            {
                success: false,
                message: error?.message || 'Failed to connect website',
            },
            { status: 500 }
        );
    }
}
