// src/app/api/user/notification/route.js

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

        const [leads, tasks, unreadCount] = await Promise.all([
            Notification.find({ recipient: user._id, refModel: 'Lead' })
                .sort({ isRead: 1, createdAt: -1 })
                .limit(20)
                .lean(),

            Notification.find({ recipient: user._id, refModel: 'LeadTask' })
                .sort({ isRead: 1, createdAt: -1 })
                .limit(20)
                .lean(),

            Notification.countDocuments({ recipient: user._id, isRead: false }),
        ]);

        return NextResponse.json({
            success: true,
            data: { leads, tasks, unreadCount },
        });
    } catch (error) {
        return NextResponse.json(
            { success: false, message: error.message },
            { status: 400 }
        );
    }
}