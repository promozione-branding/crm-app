import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { connectDB } from "@/config/db";
import { ENV } from "@/config/env";
import User from "@/models/user.model.js";
import Company from "@/models/company.model.js";

export async function GET(request) {
    try {
        await connectDB();
        const token = request.cookies.get(ENV.CLIENT_COOKIE_NAME)?.value;

        if (!token) {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
        }

        const decoded = jwt.verify(token, ENV.JWT_CLIENT_SECRET);
        const user = await User.findById(decoded.id).select("companyId");
        if (!user) {
            return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
        }

        const company = await Company.findById(user.companyId);
        if (!company) {
            return NextResponse.json({ success: false, message: "Company not found" }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            data: company
        });

    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 400 });
    }
}