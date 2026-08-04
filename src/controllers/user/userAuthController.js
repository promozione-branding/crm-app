import { NextResponse } from "next/server";
import User from "@/models/user.model.js";
import jwt from "jsonwebtoken";
import { ENV } from "@/config/env";
import { hashPassword, comparePassword, } from "@/utils/hashPassword";

export const loginUser = async (request) => {
    try {
        const body = await request.json();
        const { email, password } = body;

        if (!email || !password) {
            return NextResponse.json(
                { success: false, message: "Email and Password are required.", },
                { status: 400 }
            );
        }

        // Find User
        const user = await User.findOne({ email: email.toLowerCase(), }).select("+password");
        if (!user) {
            return NextResponse.json(
                { success: false, message: "Invalid email or password.", },
                { status: 401 }
            );
        }

        // Check Status
        if (user.status !== "active") {
            return NextResponse.json(
                { success: false, message: "Your account is inactive." },
                { status: 403 }
            );
        }

        // Compare Password
        const isMatch = await comparePassword(password, user.password);
        if (!isMatch) {
            return NextResponse.json(
                { success: false, message: "Invalid email or password.", },
                { status: 401 }
            );
        }

        // JWT
        const token = jwt.sign(
            { id: user._id, role: user.role, email: user.email, },
            ENV.JWT_CLIENT_SECRET,
            { expiresIn: `${ENV.COOKIE_EXPIRE}d`, }
        );

        const response = NextResponse.json({
            success: true,
            message: "Login successful.",
            data: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        }, { status: 200, });

        // Cookie
        response.cookies.set(ENV.CLIENT_COOKIE_NAME, token, {
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