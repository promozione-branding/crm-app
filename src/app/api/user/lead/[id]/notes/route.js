import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { connectDB } from "@/config/db";
import { ENV } from "@/config/env";
import { addLeadNoteService } from "@/controllers/user/leadsController";

export async function POST(request, { params }) {
    try {
        await connectDB();
        const token = request.cookies.get(ENV.CLIENT_COOKIE_NAME)?.value;

        if (!token) {
            return NextResponse.json({ success: false, message: "Not authenticated", }, { status: 401 });
        }

        const decoded = jwt.verify(token, ENV.JWT_CLIENT_SECRET);

        const { id } = await params;
        const body = await request.json();
        const { message } = body;
        const lead = await addLeadNoteService(decoded.id, id, message);

        return NextResponse.json({
            success: true,
            message: "Note added successfully.",
            data: lead,
        }, { status: 201 });

    } catch (error) {
        console.error("ADD NOTE ERROR:", error);
        return NextResponse.json({ success: false, message: error.message || "Failed to add note.", }, { status: 400 });
    }
}