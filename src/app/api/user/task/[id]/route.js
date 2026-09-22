// src/app/api/user/task/[id]/route.js

import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { ENV } from '@/config/env';
import { connectDB } from '@/config/db';
import { getTaskByIdService, updateTaskService } from '@/controllers/user/taskController';
import { getCurrentUser } from '@/utils/auth';
import LeadTask from '@/models/task.model';
import Notification from '@/models/notification.model';

// GET SINGLE TASK
export async function GET(request, { params }) {
    try {
        await connectDB();
        const user = await getCurrentUser(request);
        const { id } = await params;

        const task = await getTaskByIdService(user, id);
        return NextResponse.json({ success: true, data: task });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: error.message === 'Not authenticated' ? 401 : 400 });
    }
}

// PUT /api/user/task/:id
export async function PUT(request, { params }) {
    try { 
        await connectDB();
        const user = await getCurrentUser(request);
        const { id } = await params;
        const body = await request.json();

        // 👇 Capture previous assignee BEFORE update
        const existingTask = await LeadTask.findById(id).select('assignedTo');
        const previousAssignedTo = existingTask?.assignedTo?.toString() || null;

        const task = await updateTaskService(user, id, body);

        // 👇 Notify new assignee if changed
        const newAssignedTo =
            task?.assignedTo?._id?.toString() ||
            task?.assignedTo?.toString() ||
            null;

        if (newAssignedTo && previousAssignedTo !== newAssignedTo) {
            await Notification.create({
                companyId: task.companyId,
                recipient: newAssignedTo,
                actor: user._id,
                type: 'task_assigned',
                title: 'New Task Assigned',
                message: `${task.title} — due ${new Date(task.dueDate).toLocaleDateString('en-IN')}`,
                refModel: 'LeadTask',
                refId: task._id,
            });
        }

        return NextResponse.json({ success: true, message: 'Task updated successfully.', data: task });
    } catch (error) {
        console.error('UPDATE TASK ERROR:', error);
        return NextResponse.json({ success: false, message: error.message }, { status: error.message === 'Not authenticated' ? 401 : 400 });
    }
}