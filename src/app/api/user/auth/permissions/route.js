// src/app/api/user/auth/permissions/route.js

import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { connectDB } from '@/config/db';
import User from '@/models/user.model.js';
import '@/models/role.model.js';
import { ENV } from '@/config/env';

export async function GET(req) {
    try {
        await connectDB();

        const token = req.cookies.get(ENV.CLIENT_COOKIE_NAME)?.value;

        if (!token) {
            return NextResponse.json({ success: false, message: 'Not authenticated.' }, { status: 401 });
        }

        const decoded = jwt.verify(token, ENV.JWT_CLIENT_SECRET);

        const user = await User.findById(decoded.id)
            .select('-password')
            .populate('roleId', 'name permissions isSystemRole')
            .lean();

        if (!user) {
            return NextResponse.json({ success: false, message: 'User not found.' }, { status: 404 });
        }

        const permissions = Array.isArray(user.roleId?.permissions) ? user.roleId.permissions : [];

        return NextResponse.json(
            {
                success: true,
                data: {
                    user: {
                        _id: user._id,
                        name: user.name,
                        email: user.email,
                        companyId: user.companyId,
                        teamId: user.teamId ?? null,
                    },
                    role: {
                        _id: user.roleId?._id,
                        name: user.roleId?.name,
                        isSystemRole: user.roleId?.isSystemRole ?? false,
                    },
                    permissions,
                },
            },
            { status: 200 }
        );
    } catch (error) {
        console.error('GET /api/user/auth/permissions ERROR:', error);
        return NextResponse.json({ success: false, message: error.message || 'Failed.' }, { status: 401 });
    }
}