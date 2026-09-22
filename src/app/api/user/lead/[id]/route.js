// src/app/api/user/lead/[id]/route.js

import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { connectDB } from '@/config/db';
import { ENV } from '@/config/env';
import User from '@/models/user.model';
import Lead from '@/models/leads.model';
import Notification from '@/models/notification.model';
import { getLeadByIdService, updateLeadService } from '@/controllers/user/leadsController';

export async function GET(request, { params }) {
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

        const lead = await getLeadByIdService(user, id);
        return NextResponse.json({ success: true, data: lead });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 400 });
    }
}

export async function PUT(request, { params }) {
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

        const body = await request.json();

        // ---------------------------------------------
        // Capture previous assignee BEFORE the update
        // ---------------------------------------------
        const existingLead = await Lead.findById(id).select('assignedTo companyId');
        const previousAssignedTo = existingLead?.assignedTo?.toString() || null;

        const lead = await updateLeadService(user, id, body);

        // ---------------------------------------------
        // Create notification if assignee changed
        // ---------------------------------------------
        const newAssignedTo = lead?.assignedTo?._id?.toString() || lead?.assignedTo?.toString() || null;

        if (newAssignedTo && previousAssignedTo !== newAssignedTo) {
            await Notification.create({
                companyId: lead.companyId,
                recipient: newAssignedTo,
                actor: user._id,
                type: 'lead_assigned',
                title: 'New Lead Assigned',
                message: `${lead.name}${lead.phone ? ' — ' + lead.phone : ''}`,
                refModel: 'Lead',
                refId: lead._id,
            });
        }

        return NextResponse.json({
            success: true,
            message: 'Lead updated successfully.',
            data: lead,
        });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 400 });
    }
}
