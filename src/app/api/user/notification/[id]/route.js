// src/app/api/user/notification/[id]/route.js

import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { connectDB } from '@/config/db';
import { ENV } from '@/config/env';
import User from '@/models/user.model';
import Notification from '@/models/notification.model';

export async function PATCH(request, { params }) {
    try {
        await connectDB();

        const { id } = await params;
        const token = request.cookies.get(ENV.CLIENT_COOKIE_NAME)?.value;

        if (!token) {
            return NextResponse.json({ success: false, message: 'Not authenticated' }, { status: 401 });
        }

        const decoded = jwt.verify(token, ENV.JWT_CLIENT_SECRET);
        const user = await User.findById(decoded.id);

        if (!user) {
            return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
        }

        await Notification.findOneAndUpdate({ _id: id, recipient: user._id }, { isRead: true });

        return NextResponse.json({ success: true, message: 'Marked as read' });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 400 });
    }
}
