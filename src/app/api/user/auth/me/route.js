import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { connectDB } from "@/config/db";
import User from "@/models/user.model.js";
import { ENV } from "@/config/env";
import "@/models/role.model.js";

export async function GET(req) {
    try {
        await connectDB();
        const token = req.cookies.get(ENV.CLIENT_COOKIE_NAME)?.value;

        if (!token) {
            return NextResponse.json(
                { message: "Not authenticated" },
                { status: 401 }
            );
        }

        const decoded = jwt.verify(token, ENV.JWT_CLIENT_SECRET);
        const user = await User.findById(decoded.id)
            .populate("roleId", "name permissions isSystemRole companyId")
            .select("-password");

        if (!user) {
            return NextResponse.json(
                { message: "User not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            data: user
        });
    }
    catch (error) {
        return NextResponse.json(
            { message: error.message },
            { status: 401 }
        );
    }
}