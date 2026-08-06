import { NextResponse } from "next/server";
import { connectDB } from "@/config/db"; // your DB connection
import { createLeadService } from "@/controllers/user/leadsController";
import { ENV } from "@/config/env";
import User from "@/models/user.model.js";
import jwt from "jsonwebtoken";

export async function POST(request) {
    try {
        await connectDB();
        const token = request.cookies.get(ENV.CLIENT_COOKIE_NAME)?.value;

        if (!token) {
            return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
        }

        const decoded = jwt.verify(token, ENV.JWT_CLIENT_SECRET);
        const user = await User.findById(decoded.id).select("-password");
        const body = await request.json();
        const lead = await createLeadService(user?._id, user?.companyId, body);

        return NextResponse.json({
            success: true,
            message: "Lead created successfully.",
            data: lead,
        }, { status: 201 });

    } catch (error) {
        return NextResponse.json({ success: false, message: error.message, }, { status: 400 });
    }
}