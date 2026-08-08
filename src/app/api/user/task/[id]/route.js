import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { ENV } from "@/config/env";
import { connectDB } from "@/config/db";
import { getTaskByIdService, updateTaskService, } from "@/controllers/user/taskController";
import { getCurrentUser } from "@/utils/auth";

// GET SINGLE TASK
export async function GET(request, { params }) {
    try {
        await connectDB();
        const user = await getCurrentUser(request);
        const { id } = await params;

        const task = await getTaskByIdService(user, id);
        return NextResponse.json({ success: true, data: task, });
    } catch (error) {
        return NextResponse.json(
            { success: false, message: error.message, },
            { status: error.message === "Not authenticated" ? 401 : 400, }
        );
    }
}

// PUT /api/user/task/:id
export async function PUT(request, { params }) {
    try {
        await connectDB();
        const user = await getCurrentUser(request);
        const { id } = await params;
        const body = await request.json();
        const task = await updateTaskService(user, id, body);
        return NextResponse.json({ success: true, message: "Task updated successfully.", data: task, });
    } catch (error) {
        console.error("UPDATE TASK ERROR:", error);
        return NextResponse.json(
            { success: false, message: error.message, },
            { status: error.message === "Not authenticated" ? 401 : 400, }
        );
    }
}