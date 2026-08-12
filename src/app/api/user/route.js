import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { connectDB } from "@/config/db";
import { ENV } from "@/config/env";
import { getAllUsersService, createUserService, } from "@/controllers/user/usersController";
import { getCurrentUser } from "@/utils/auth";

// GET USERS
export async function GET(request) {
    try {
        await connectDB();
        const token = request.cookies.get(ENV.CLIENT_COOKIE_NAME)?.value;
        if (!token) {
            return NextResponse.json({ success: false, message: "Not authenticated.", }, { status: 401, });
        }

        const decoded = jwt.verify(token, ENV.JWT_CLIENT_SECRET);
        const { searchParams } = new URL(request.url);
        const result = await getAllUsersService(decoded.id, {
            search: searchParams.get("search") || "",
            role: searchParams.get("role") || "",
            status: searchParams.get("status") || "",
            page: searchParams.get("page") || 1,
            limit: searchParams.get("limit") || 25,
        });

        return NextResponse.json({
            success: true,
            data: result.users,
            pagination: result.pagination,
        });
    } catch (error) {
        console.error("GET USERS ERROR:", error);
        return NextResponse.json(
            { success: false, message: error.message || "Failed to get users.", },
            { status: error.name === "JsonWebTokenError" ? 401 : 400, }
        );
    }
}

// CREATE USER
export async function POST(request) {
    try {
        await connectDB();
        const user = await getCurrentUser(request);
        const body = await request.json();
        const userData = await createUserService(user, body);
        return NextResponse.json(
            { success: true, message: "User created successfully.", data: userData, },
            { status: 201, }
        );
    } catch (error) {
        console.error("CREATE USER ERROR:", error);
        return NextResponse.json(
            { success: false, message: error.message || "Failed to create user.", },
            { status: error.name === "JsonWebTokenError" ? 401 : 400, }
        );
    }
}