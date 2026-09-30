// src/app/api/user/tasks/stats/route.js

import { NextResponse } from 'next/server';

import { connectDB } from '@/config/db';
import { getCurrentUser } from '@/utils/auth';

import LeadTask from '@/models/task.model';

export async function GET(request) {
    try {
        await connectDB();

        const user = await getCurrentUser(request);

        if (!user) {
            return NextResponse.json({ success: false, message: 'User not found.' }, { status: 401 });
        }

        const companyId = user.companyId;
        const userId = user._id;

        await user.populate({ path: 'roleId', select: 'name isSystemRole' });

        const isAdmin = user.roleId?.isSystemRole === true && user.roleId?.name?.toLowerCase() === 'admin';

        const taskFilter = isAdmin
            ? { companyId }
            : { companyId, $or: [{ createdBy: userId }, { assignedTo: userId }] };

        const now = new Date();
        const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const endOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
        const dayOfWeek = now.getDay();
        const daysFromMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
        const startOfWeek = new Date(now.getFullYear(), now.getMonth(), now.getDate() - daysFromMonday);
        const endOfWeek = new Date(startOfWeek.getFullYear(), startOfWeek.getMonth(), startOfWeek.getDate() + 7);

        const openStatuses = { $nin: ['completed', 'cancelled'] };

        const [total, pending, completed, cancelled, overdue, dueToday, dueThisWeek] = await Promise.all([
            LeadTask.countDocuments(taskFilter),
            LeadTask.countDocuments({ ...taskFilter, status: 'pending' }),
            LeadTask.countDocuments({ ...taskFilter, status: 'completed' }),
            LeadTask.countDocuments({ ...taskFilter, status: 'cancelled' }),
            LeadTask.countDocuments({ ...taskFilter, status: openStatuses, dueDate: { $lt: now } }),
            LeadTask.countDocuments({ ...taskFilter, status: openStatuses, dueDate: { $gte: startOfToday, $lt: endOfToday } }),
            LeadTask.countDocuments({ ...taskFilter, status: openStatuses, dueDate: { $gte: startOfWeek, $lt: endOfWeek } }),
        ]);

        return NextResponse.json({
            success: true,
            data: {
                isAdmin,
                total,
                pending,
                completed,
                cancelled,
                overdue,
                dueToday,
                dueThisWeek,
            },
        });
    } catch (error) {
        console.error('GET TASKS STATS ERROR:', error);
        return NextResponse.json(
            { success: false, message: error.message || 'Failed to fetch task stats.' },
            { status: 500 }
        );
    }
}