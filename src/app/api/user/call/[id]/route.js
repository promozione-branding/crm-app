// src/app/api/user/call/[id]/route.js

import { NextResponse } from 'next/server';
import { connectDB } from '@/config/db';
import { getCurrentUser } from '@/utils/auth';
import Call from '@/models/call.model';

export async function PUT(request, { params }) {
    try {
        await connectDB();

        const user = await getCurrentUser(request);
        const { id } = await params;
        const body = await request.json();

        const allowed = [
            'status',
            'outcome',
            'durationSeconds',
            'notes',
            'followUpAt',
        ];

        const updates = {};
        for (const key of allowed) {
            if (body[key] !== undefined) updates[key] = body[key];
        }

        const call = await Call.findOneAndUpdate(
            { _id: id, companyId: user.companyId },
            updates,
            { new: true }
        );

        if (!call) {
            return NextResponse.json(
                { success: false, message: 'Call not found.' },
                { status: 404 }
            );
        }

        return NextResponse.json({ success: true, data: call });
    } catch (error) {
        console.error('UPDATE CALL ERROR:', error);
        return NextResponse.json(
            { success: false, message: error.message || 'Failed to update call.' },
            { status: 400 }
        );
    }
}