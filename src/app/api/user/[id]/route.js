// src/app/api/user/[id]/route.js

import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';

import { connectDB } from '@/config/db';
import User from '@/models/user.model.js';
import Role from '@/models/role.model.js';

// GET USER BY ID
export async function GET(request, { params }) {
    try {
        await connectDB();

        const { id } = await params;

        const user = await User.findById(id).populate('roleId', 'name').select('-password');

        if (!user) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'User not found',
                },
                { status: 404 }
            );
        }

        return NextResponse.json(
            {
                success: true,
                user,
            },
            { status: 200 }
        );
    } catch (error) {
        console.error('Get user error:', error);

        return NextResponse.json(
            {
                success: false,
                message: 'Failed to get user',
            },
            { status: 500 }
        );
    }
}

// UPDATE USER
export async function PUT(request, { params }) {
    try {
        await connectDB();

        const { id } = await params;
        const body = await request.json();

        const { name, email, phone, password, roleId, leadSources, status } = body;

        const user = await User.findById(id);

        if (!user) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'User not found',
                },
                { status: 404 }
            );
        }

        // -------------------------
        // Check duplicate email
        // -------------------------
        if (email && email !== user.email) {
            const existingUser = await User.findOne({
                email,
                _id: { $ne: id },
            });

            if (existingUser) {
                return NextResponse.json(
                    {
                        success: false,
                        message: 'Email already exists',
                    },
                    { status: 400 }
                );
            }
        }

        // -------------------------
        // Update basic fields
        // -------------------------
        if (name !== undefined) {
            user.name = name;
        }

        if (email !== undefined) {
            user.email = email;
        }

        if (phone !== undefined) {
            user.phone = phone;
        }

        if (roleId !== undefined) {
            user.roleId = roleId;
        }

        // -------------------------
        // Update Lead Sources
        // -------------------------
        if (Array.isArray(leadSources)) {
            user.leadSources = leadSources;
        }

        if (status !== undefined) {
            user.status = status;
        }

        // -------------------------
        // Update password only
        // -------------------------
        if (password && password.trim()) {
            user.password = await bcrypt.hash(password, 10);
        }

        await user.save();

        const updatedUser = await User.findById(id).populate('roleId', 'name').select('-password');

        return NextResponse.json(
            {
                success: true,
                message: 'User updated successfully',
                user: updatedUser,
            },
            { status: 200 }
        );
    } catch (error) {
        console.error('Update user error:', error);

        return NextResponse.json(
            {
                success: false,
                message: 'Failed to update user',
            },
            { status: 500 }
        );
    }
}

export async function DELETE(request, { params }) {
    try {
        await connectDB();

        const { id } = await params;

        const user = await User.findById(id);

        if (!user) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'User not found',
                },
                { status: 404 }
            );
        }

        await User.findByIdAndDelete(id);

        return NextResponse.json(
            {
                success: true,
                message: 'User deleted successfully',
            },
            { status: 200 }
        );
    } catch (error) {
        console.error('Delete user error:', error);

        return NextResponse.json(
            {
                success: false,
                message: 'Failed to delete user',
            },
            { status: 500 }
        );
    }
}
