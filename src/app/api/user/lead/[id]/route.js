import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { connectDB } from "@/config/db";
import { ENV } from "@/config/env";
import User from "@/models/user.model";
import { getLeadByIdService } from "@/controllers/user/leadsController";

export async function GET(request, { params }) {
    try {
        await connectDB();
        const { id } = await params
        const token = request.cookies.get(ENV.CLIENT_COOKIE_NAME)?.value;

        if (!token) {
            return NextResponse.json({ success: false, message: "Not authenticated", }, { status: 401 });
        }

        const decoded = jwt.verify(token, ENV.JWT_CLIENT_SECRET);
        const user = await User.findById(decoded.id);

        if (!user) {
            return NextResponse.json({ success: false, message: "Unauthorized", }, { status: 401 });
        }

        const lead = await getLeadByIdService(user, id);
        return NextResponse.json({ success: true, data: lead, });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message, }, { status: 400, });
    }
}