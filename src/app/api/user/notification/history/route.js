// src/app/api/user/notification/history/route.js

import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { connectDB } from '@/config/db';
import { ENV } from '@/config/env';
import User from '@/models/user.model';
import Notification from '@/models/notification.model';

export async function GET(request) {
    try {
        await connectDB();

        const token = request.cookies.get(ENV.CLIENT_COOKIE_NAME)?.value;

        if (!token) {
            return NextResponse.json(
                { success: false, message: 'Not authenticated' },
                { status: 401 }
            );
        }

        const decoded = jwt.verify(token, ENV.JWT_CLIENT_SECRET);
        const user = await User.findById(decoded.id);

        if (!user) {
            return NextResponse.json(
                { success: false, message: 'Unauthorized' },
                { status: 401 }
            );
        }

        const { searchParams } = new URL(request.url);

        const page = Math.max(1, parseInt(searchParams.get('page') || '1'));
        const limit = Math.min(100, parseInt(searchParams.get('limit') || '25'));
        const type = searchParams.get('type') || ''; // 'lead' | 'task' | ''
        const isRead = searchParams.get('isRead'); // 'true' | 'false' | null

        const filter = { recipient: user._id };

        if (type === 'lead') filter.refModel = 'Lead';
        if (type === 'task') filter.refModel = 'LeadTask';

        if (isRead === 'true') filter.isRead = true;
        if (isRead === 'false') filter.isRead = false;

        const skip = (page - 1) * limit;

        const [items, total] = await Promise.all([
            Notification.find(filter)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .lean(),

            Notification.countDocuments(filter),
        ]);

        return NextResponse.json({
            success: true,
            data: {
                notifications: items,
                pagination: {
                    page,
                    limit,
                    total,
                    totalPages: Math.ceil(total / limit),
                },
            },
        });
    } catch (error) {
        return NextResponse.json(
            { success: false, message: error.message },
            { status: 400 }
        );
    }
}