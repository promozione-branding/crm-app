import { NextResponse } from "next/server";
import { connectDB } from "@/config/db";
import { getMeetingByIdService, updateMeetingService, deleteMeetingService, } from "@/controllers/user/meetingController";
import { getCurrentUser } from "@/utils/auth";

export async function GET(request, { params }) {
    try {
        await connectDB();
        const user = await getCurrentUser(request);
        const { id } = await params;
        const meeting = await getMeetingByIdService(user, id);
        return NextResponse.json({ success: true, data: meeting, });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message, }, { status: 400 });
    }
}

export async function PUT(request, { params }) {
    try {
        await connectDB();
        const user = await getCurrentUser(request);
        const { id } = await params;
        const body = await request.json();
        const meeting = await updateMeetingService(user, id, body);

        return NextResponse.json({
            success: true,
            message: "Meeting updated successfully.",
            data: meeting,
        });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message, }, { status: 400 });
    }
}

export async function DELETE(request, { params }) {
    try {
        await connectDB();
        const user = await getCurrentUser(request);
        const { id } = await params;
        await deleteMeetingService(user, id);
        return NextResponse.json({ success: true, message: "Meeting deleted successfully.", });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message, }, { status: 400 });
    }
}