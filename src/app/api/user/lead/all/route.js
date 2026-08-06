import { NextResponse } from "next/server";
import { ENV } from "@/config/env";
import User from "@/models/user.model.js";
import jwt from "jsonwebtoken";
import { connectDB } from "@/config/db";
import { getAllLeadsService } from "@/controllers/user/leadsController";

export async function GET(request) {
    try {
        await connectDB();
        const token = request.cookies.get(ENV.CLIENT_COOKIE_NAME)?.value;

        if (!token) {
            return NextResponse.json({ success: false, message: "Not authenticated" }, { status: 401 });
        }

        const decoded = jwt.verify(token, ENV.JWT_CLIENT_SECRET);
        const user = await User.findById(decoded.id).select("-password");

        if (!user) {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);

        const query = {
            stage: searchParams.get("stage") || "",
            source: searchParams.get("source") || "",
            assignedTo: searchParams.get("assignedTo") || "",
            search: searchParams.get("search") || "",
            page: Number(searchParams.get("page")) || 1,
            limit: Number(searchParams.get("limit")) || 10,
        };

        const data = await getAllLeadsService(user, query);
        return NextResponse.json({ success: true, ...data }, { status: 200 });

    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 400 });
    }
}