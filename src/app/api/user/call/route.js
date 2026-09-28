// src/app/api/user/call/route.js

import { NextResponse } from 'next/server';
import { connectDB } from '@/config/db';
import { getCurrentUser } from '@/utils/auth';
import Call from '@/models/call.model';
import Lead from '@/models/leads.model';

// POST /api/user/call — log a new call
export async function POST(request) {
    try {
        await connectDB();

        const user = await getCurrentUser(request);
        const body = await request.json();

        const {
            refModel = 'Lead',
            refId,
            phoneNumber,
            status = 'initiated',
            outcome = '',
            durationSeconds = 0,
            notes = '',
            followUpAt = null,
            source = 'mobile_card',
        } = body;

        if (!refId || !phoneNumber) {
            return NextResponse.json({ success: false, message: 'refId and phoneNumber are required.' }, { status: 400 });
        }

        // Snapshot the lead's company (for multi-tenant safety)
        let companyId = user.companyId;
        if (refModel === 'Lead') {
            const lead = await Lead.findById(refId).select('companyId');
            if (lead?.companyId) companyId = lead.companyId;
        }

        const call = await Call.create({
            companyId,
            refModel,
            refId,
            callerId: user._id,
            callerRole: user.roleId?.name || '',
            phoneNumber,
            status,
            outcome,
            durationSeconds: Number(durationSeconds) || 0,
            notes: notes?.trim() || '',
            followUpAt: followUpAt ? new Date(followUpAt) : null,
            source,
        });

        return NextResponse.json({ success: true, message: 'Call logged.', data: call }, { status: 201 });
    } catch (error) {
        console.error('CREATE CALL ERROR:', error);
        return NextResponse.json({ success: false, message: error.message || 'Failed to log call.' }, { status: 400 });
    }
}

// ---------------- GET ----------------
export async function GET(request) {
    try {
        await connectDB();

        const user = await getCurrentUser(request);
        if (!user) {
            return NextResponse.json({ success: false, message: 'Not authenticated' }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);

        const page = Math.max(1, parseInt(searchParams.get('page') || '1'));
        const limit = Math.min(100, parseInt(searchParams.get('limit') || '25'));
        const leadId = searchParams.get('leadId'); // optional — for lead-scoped calls
        const status = searchParams.get('status'); // optional
        const callerId = searchParams.get('callerId'); // optional
        const search = searchParams.get('search'); // free text
        const from = searchParams.get('from'); // optional ISO date
        const to = searchParams.get('to'); // optional ISO date

        const filter = { companyId: user.companyId };

        if (leadId) filter.refId = leadId;
        if (status) filter.status = status;
        if (callerId) filter.callerId = callerId;

        if (from || to) {
            filter.calledAt = {};
            if (from) filter.calledAt.$gte = new Date(from);
            if (to) filter.calledAt.$lte = new Date(to);
        }

        if (search && search.trim()) {
            const rx = new RegExp(search.trim(), 'i');
            filter.$or = [{ phoneNumber: rx }, { notes: rx }, { callerRole: rx }];
        }

        const skip = (page - 1) * limit;

        const [calls, total] = await Promise.all([
            Call.find(filter).sort({ calledAt: -1 }).skip(skip).limit(limit).populate('callerId', 'name email').populate('refId', 'name phone').lean(),

            Call.countDocuments(filter),
        ]);

        return NextResponse.json({
            success: true,
            data: {
                calls,
                pagination: {
                    page,
                    limit,
                    total,
                    totalPages: Math.ceil(total / limit),
                },
            },
        });
    } catch (error) {
        console.error('GET CALLS ERROR:', error);
        return NextResponse.json({ success: false, message: error.message || 'Failed to fetch calls.' }, { status: 400 });
    }
}
