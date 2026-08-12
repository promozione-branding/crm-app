import { NextResponse } from "next/server";
import { connectDB } from "@/config/db";
import { createMeetingService, getMeetingsByLeadService, } from "@/controllers/user/meetingController";
import { getCurrentUser } from "@/utils/auth";

export async function POST(request) {
    try {
        await connectDB();
        const user = await getCurrentUser(request);
        const body = await request.json();
        const meeting = await createMeetingService(user, body);

        return NextResponse.json(
            { success: true, message: "Meeting created successfully.", data: meeting, },
            { status: 201 }
        );
    } catch (error) {
        return NextResponse.json(
            { success: false, message: error.message, },
            { status: error.message === "Not authenticated" ? 401 : 400, }
        );
    }
}

export async function GET(request) {
    try {
        await connectDB();
        const user = await getCurrentUser(request);
        const { searchParams } = new URL(request.url);
        const leadId = searchParams.get("leadId");
        if (!leadId) {
            return NextResponse.json({ success: false, message: "leadId is required.", }, { status: 400 });
        }

        const meetings = await getMeetingsByLeadService(user, leadId);
        return NextResponse.json({ success: true, data: meetings, });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message, }, { status: 400 });
    }
}