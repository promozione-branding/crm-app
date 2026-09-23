// src/app/api/user/lead/create/route.js

import { NextResponse } from 'next/server';
import { connectDB } from '@/config/db';
import { createLeadService } from '@/controllers/user/leadsController';
import { sendNewLeadEmail } from '@/lib/mail/reminderMail';
import { ENV } from '@/config/env';
import User from '@/models/user.model.js';
import jwt from 'jsonwebtoken';

export async function POST(request) {
    try {
        await connectDB();

        const token =
            request.cookies.get(
                ENV.CLIENT_COOKIE_NAME
            )?.value;

        if (!token) {
            return NextResponse.json(
                { message: 'Not authenticated' },
                { status: 401 }
            );
        }

        const decoded =
            jwt.verify(
                token,
                ENV.JWT_CLIENT_SECRET
            );

        const user =
            await User.findById(
                decoded.id
            ).select('-password');

        const body =
            await request.json();

        const lead =
            await createLeadService(
                user?._id,
                user?.companyId,
                body
            );

        console.log('========================================');
        console.log('🟢 LEAD CREATED');
        console.log('Lead ID:', lead?._id);
        console.log('Lead Name:', lead?.name);
        console.log('Lead Email:', lead?.email);
        console.log('========================================');

        // Send email to client
        if (lead?.email) {
            await sendNewLeadEmail({ lead });
        } else {
            console.log(
                '⚠️ Lead has no email. Skipping email.'
            );
        }

        return NextResponse.json(
            {
                success: true,
                message: 'Lead created successfully.',
                data: lead,
            },
            { status: 201 }
        );

    } catch (error) {
        console.error(
            '❌ CREATE LEAD ERROR:',
            error
        );

        return NextResponse.json(
            {
                success: false,
                message: error.message,
            },
            { status: 400 }
        );
    }
}