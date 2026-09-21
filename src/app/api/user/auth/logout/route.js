// src/app/api/user/auth/logout/route.js

import { ENV } from '@/config/env';
import { NextResponse } from 'next/server';

export async function POST() {
    try {
        const response = NextResponse.json(
            { success: true, message: 'Logout successfully' },
            {
                status: 200,
                headers: {
                    'Cache-Control': 'no-store, no-cache, must-revalidate',
                },
            }
        );

        // Delete the client cookie — matches the name your middleware reads
        response.cookies.set(ENV.CLIENT_COOKIE_NAME, '', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
            maxAge: 0,
            expires: new Date(0),
        });

        return response;
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}