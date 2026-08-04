import { NextResponse } from "next/server";
import AdminUser from "@/models/adminUser.model.js";
import jwt from "jsonwebtoken";
import { ENV } from "@/config/env";
import { hashPassword, comparePassword, } from "@/utils/hashPassword";

export const registerAdmin = async (request) => {
    try {
        const body = await request.json();
        const { name, email, phone, password, } = body;

        // Validation
        if (!name || !email || !phone || !password) {
            return NextResponse.json(
                { success: false, message: "Name, Email, Phone and Password are required.", },
                { status: 400, }
            );
        }

        // Check existing email
        const existingAdmin = await AdminUser.findOne({ email: email.toLowerCase(), phone });
        if (existingAdmin) {
            return NextResponse.json(
                { success: false, message: "Email or phone already exists.", },
                { status: 409, }
            );
        }

        // Hash password
        const hashedPassword = await hashPassword(password);
        const admin = await AdminUser.create({
            name,
            email: email.toLowerCase(),
            phone,
            password: hashedPassword,
            role: "owner",
        });

        return NextResponse.json(
            {
                success: true,
                message: "Admin created successfully.",
                data: {
                    id: admin._id,
                    name: admin.name,
                    email: admin.email,
                    role: admin.role,
                },
            },
            { status: 201, }
        );

    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { success: false, message: error.message, },
            { status: 500, }
        );
    }
};

export const loginAdmin = async (request) => {
    try {
        const body = await request.json();
        const { email, password } = body;

        if (!email || !password) {
            return NextResponse.json(
                { success: false, message: "Email and Password are required.", },
                { status: 400 }
            );
        }

        // Find Admin
        const admin = await AdminUser.findOne({ email: email.toLowerCase(), }).select("+password");
        if (!admin) {
            return NextResponse.json(
                { success: false, message: "Invalid email or password.", },
                { status: 401 }
            );
        }

        // Check Status
        if (admin.status !== "active") {
            return NextResponse.json(
                { success: false, message: "Your account is inactive.", },
                { status: 403 }
            );
        }

        // Compare Password
        const isMatch = await comparePassword(password, admin.password);
        if (!isMatch) {
            return NextResponse.json(
                { success: false, message: "Invalid email or password.", },
                { status: 401 }
            );
        }

        // Update Last Login
        await AdminUser.updateOne(
            { _id: admin._id },
            { lastLogin: new Date() }
        );

        // JWT
        const token = jwt.sign(
            { id: admin._id, role: admin.role, email: admin.email, },
            ENV.JWT_ADMIN_SECRET,
            { expiresIn: `${ENV.COOKIE_EXPIRE}d`, }
        );

        const response = NextResponse.json({
            success: true,
            message: "Login successful.",
            data: {
                id: admin._id,
                name: admin.name,
                email: admin.email,
                role: admin.role,
            },
        }, { status: 200, });

        // Cookie
        response.cookies.set(ENV.ADMIN_COOKIE_NAME, token, {
            httpOnly: true,
            secure: ENV.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: ENV.COOKIE_EXPIRE * 24 * 60 * 60,
            path: "/",
        });

        return response;
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { success: false, message: error.message, },
            { status: 500, }
        );
    }
};