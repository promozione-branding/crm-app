import { NextResponse } from "next/server";
import { connectDB } from "@/config/db";
import { createTaskService, getAllTasksService, } from "@/controllers/user/taskController";
import { getCurrentUser } from "@/utils/auth";

// POST /api/user/task
export async function POST(request) {
    try {
        await connectDB();
        const user = await getCurrentUser(request);
        const body = await request.json();
        const task = await createTaskService(user, body);

        return NextResponse.json(
            { success: true, message: "Task created successfully.", data: task, },
            { status: 201 }
        );
    } catch (error) {
        console.error("CREATE TASK ERROR:", error);
        return NextResponse.json(
            { success: false, message: error.message || "Failed to create task.", },
            { status: error.message === "Not authenticated" ? 401 : 400, }
        );
    }
}

// GET /api/user/task
export async function GET(request) {
    try {
        await connectDB();
        const user = await getCurrentUser(request);
        if (!user) {
            return NextResponse.json({ success: false, message: "User not found.", }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const query = {
            leadId: searchParams.get("leadId") || undefined,
            status: searchParams.get("status") || undefined,
            assignedTo: searchParams.get("assignedTo") || undefined,
            priority: searchParams.get("priority") || undefined,
            search: searchParams.get("search") || undefined,
            page: searchParams.get("page") || 1,
            limit: searchParams.get("limit") || 25,
        };

        const result = await getAllTasksService(user, query);
        return NextResponse.json({ success: true, data: result, });
    } catch (error) {
        console.error("GET TASKS ERROR:", error);
        return NextResponse.json({ success: false, message: error.message || "Failed to fetch tasks.", }, { status: 400 });
    }
}