// src/app/api/user/lead/route.js

import { NextResponse } from 'next/server';

import { connectDB } from '@/config/db';
import { getCurrentUser } from '@/utils/auth';

import { createLeadService } from '@/controllers/user/leadsController';

import { sendNewLeadEmail } from '@/lib/mail/reminderMail';

export async function POST(request) {
    console.log('🔥🔥🔥 LEAD POST ROUTE HIT 🔥🔥🔥');
    try {
        await connectDB();

        const user = await getCurrentUser(request);

        const body = await request.json();

        // Create lead
        const lead = await createLeadService(user._id, user.companyId, body);

        console.log('========================================');
        console.log('🟢 LEAD CREATED');
        console.log('Lead ID:', lead?._id);
        console.log('Lead Name:', lead?.name);
        console.log('Lead Email:', lead?.email);
        console.log('========================================');

        // Send email to client
        if (lead?.email) {
            await sendNewLeadEmail({
                lead,
            });
        } else {
            console.log('⚠️ No email found on lead. Client email skipped.');
        }

        return NextResponse.json(
            {
                success: true,
                message: 'Lead created successfully.',
                data: lead,
            },
            {
                status: 201,
            }
        );
    } catch (error) {
        console.error('CREATE LEAD ERROR:', error);

        return NextResponse.json(
            {
                success: false,
                message: error.message || 'Failed to create lead.',
            },
            {
                status: error.message === 'Not authenticated' ? 401 : 400,
            }
        );
    }
}
