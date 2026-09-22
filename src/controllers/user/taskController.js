// src/controllers/user/taskController.js

import mongoose from 'mongoose';
import User from '@/models/user.model.js';
import Lead from '@/models/leads.model.js';
import LeadTask from '@/models/task.model.js';
import Role from '@/models/role.model.js';

// CREATE TASK
export const createTaskService = async (user, body) => {
    if (!user) {
        throw new Error('User not found.');
    }

    if (!mongoose.Types.ObjectId.isValid(body.leadId)) {
        throw new Error('Invalid lead id.');
    }

    if (!mongoose.Types.ObjectId.isValid(body.assignedTo)) {
        throw new Error('Invalid assigned user.');
    }

    if (!body.title?.trim()) {
        throw new Error('Task title is required.');
    }

    if (!body.dueDate) {
        throw new Error('Due date is required.');
    }

    const dueDate = new Date(body.dueDate);
    if (isNaN(dueDate.getTime())) {
        throw new Error('Invalid due date.');
    }

    // Check lead belongs to same company
    const lead = await Lead.findOne({ _id: body.leadId, companyId: user.companyId });
    if (!lead) {
        throw new Error('Lead not found.');
    }

    // Check assigned user belongs to same company
    const assignedUser = await User.findOne({ _id: body.assignedTo, companyId: user.companyId, status: 'active' });
    if (!assignedUser) {
        throw new Error('Assigned user not found.');
    }

    const reminderMinutes = Number(body.reminderMinutes || 0);
    if (![0, 5, 10, 15].includes(reminderMinutes)) {
        throw new Error('Invalid reminder option.');
    }

    let reminderAt = null;
    if (reminderMinutes > 0) {
        reminderAt = new Date(dueDate.getTime() - reminderMinutes * 60 * 1000);
    }

    const task = await LeadTask.create({
        companyId: user.companyId,
        leadId: body.leadId,
        title: body.title.trim(),
        description: body.description?.trim() || '',
        priority: body.priority || 'medium',
        assignedTo: body.assignedTo,
        dueDate,
        reminderMinutes,
        reminderAt,
        createdBy: user?._id,
    });

    lead.activities.push({
        type: 'task_created',
        title: 'Task Created',
        description: `Task "${task.title}" was created and assigned to ${assignedUser.name}.`,
        createdBy: user._id,
    });

    await lead.save();

    return await LeadTask.findById(task._id)
        .populate('assignedTo', 'name email phone role')
        .populate('createdBy', 'name email')
        .populate('leadId', 'name phone email');
};

// GET ALL TASKS
export const getAllTasksService = async (user, query = {}) => {
    if (!user) {
        throw new Error('User not found.');
    }

    const { leadId, status, assignedTo, priority, search, relatedTo, assignedToSearch, page = 1, limit = 25 } = query;

    const filter = {
        companyId: user.companyId,
    };

    // ============================================================
    // SCOPE FILTER (based on user's role permission for "tasks")
    // ============================================================

    // User model stores role in `roleId` (string) not `role`.
    const roleId = user.roleId || user.role;
    const role = roleId ? await Role.findById(roleId).lean() : null;

    const taskPermission = role?.permissions?.find((p) => p.module === 'tasks');

    const taskScope = taskPermission?.scope || 'own';

    if (taskScope === 'own') {
        filter.assignedTo = user._id;
    } else if (taskScope === 'team') {
        // ⚠️ Adjust `teamId` to whatever field your User model uses
        // to define a team (e.g. teamId, departmentId, managerId).
        const teamUserIds = await User.find({
            companyId: user.companyId,
            teamId: user.teamId,
        }).distinct('_id');

        filter.assignedTo = { $in: teamUserIds };
    }
    // scope === 'all' → no restriction

    // ============================================================
    // EXISTING LEAD ID FILTER
    // ============================================================

    if (leadId) {
        if (!mongoose.Types.ObjectId.isValid(leadId)) {
            throw new Error('Invalid lead id.');
        }

        filter.leadId = leadId;
    }

    // ============================================================
    // EXISTING STATUS FILTER
    // ============================================================

    if (status) {
        filter.status = status;
    }

    // ============================================================
    // EXISTING ASSIGNED USER ID FILTER
    // ============================================================

    // IMPORTANT:
    // assignedTo remains ObjectId.
    // Do NOT change this to a name search.
    // Must intersect with scope filter above so a user cannot
    // bypass scope by passing an arbitrary assignedTo id.

    if (assignedTo) {
        if (!mongoose.Types.ObjectId.isValid(assignedTo)) {
            throw new Error('Invalid assigned user.');
        }

        if (filter.assignedTo) {
            const scopeIds = filter.assignedTo.$in ? filter.assignedTo.$in.map((id) => id.toString()) : [filter.assignedTo.toString()];

            if (scopeIds.includes(assignedTo.toString())) {
                filter.assignedTo = assignedTo;
            } else {
                filter.assignedTo = { $in: [] };
            }
        } else {
            filter.assignedTo = assignedTo;
        }
    }

    // ============================================================
    // PRIORITY FILTER
    // ============================================================

    if (priority) {
        if (!['low', 'medium', 'high', 'urgent'].includes(priority)) {
            throw new Error('Invalid priority.');
        }

        filter.priority = priority;
    }

    // ============================================================
    // EXISTING TASK SEARCH
    // ============================================================

    if (search?.trim()) {
        const taskSearch = search.trim();

        filter.$or = [
            {
                title: {
                    $regex: taskSearch,
                    $options: 'i',
                },
            },
            {
                description: {
                    $regex: taskSearch,
                    $options: 'i',
                },
            },
        ];
    }

    // ============================================================
    // RELATED TO SEARCH
    // Searches Lead name
    // ============================================================

    if (relatedTo?.trim()) {
        const relatedSearch = relatedTo.trim();

        const matchingLeads = await Lead.find(
            {
                companyId: user.companyId,
                name: {
                    $regex: relatedSearch,
                    $options: 'i',
                },
            },
            {
                _id: 1,
            }
        ).lean();

        const matchingLeadIds = matchingLeads.map((lead) => lead._id);

        // If no leads match the search,
        // return zero tasks instead of ignoring the filter.

        filter.leadId = {
            $in: matchingLeadIds,
        };
    }

    // ============================================================
    // ASSIGNED TO SEARCH
    // Searches User name
    // Must intersect with scope filter so a user cannot bypass
    // scope by searching another user's name.
    // ============================================================

    if (assignedToSearch?.trim()) {
        const assignedSearch = assignedToSearch.trim();

        const matchingUsers = await User.find(
            {
                companyId: user.companyId,
                name: {
                    $regex: assignedSearch,
                    $options: 'i',
                },
            },
            {
                _id: 1,
            }
        ).lean();

        const matchingUserIds = matchingUsers.map((item) => item._id);

        if (filter.assignedTo) {
            const scopeIds = filter.assignedTo.$in ? filter.assignedTo.$in.map((id) => id.toString()) : [filter.assignedTo.toString()];

            const intersection = matchingUserIds.filter((id) => scopeIds.includes(id.toString()));

            filter.assignedTo = { $in: intersection };
        } else {
            filter.assignedTo = { $in: matchingUserIds };
        }
    }

    // ============================================================
    // PAGINATION
    // ============================================================

    const currentPage = Math.max(Number(page) || 1, 1);

    const perPage = Math.min(Math.max(Number(limit) || 25, 1), 100);

    const skip = (currentPage - 1) * perPage;

    // ============================================================
    // GET TASKS
    // ============================================================

    const [tasks, total] = await Promise.all([
        LeadTask.find(filter)
            .populate('assignedTo', 'name email phone role')
            .populate('createdBy', 'name email')
            .populate('leadId', 'name phone email')
            .sort({
                dueDate: 1,
                createdAt: -1,
            })
            .skip(skip)
            .limit(perPage)
            .lean(),

        LeadTask.countDocuments(filter),
    ]);

    // ============================================================
    // PAGINATION RESPONSE
    // ============================================================

    const totalPages = Math.ceil(total / perPage);

    return {
        tasks,

        pagination: {
            page: currentPage,
            limit: perPage,
            total,
            totalPages,
            hasNextPage: currentPage < totalPages,
            hasPrevPage: currentPage > 1,
        },
    };
};

// GET SINGLE TASK
export const getTaskByIdService = async (user, taskId) => {
    if (!user) {
        throw new Error('User not found.');
    }

    if (!mongoose.Types.ObjectId.isValid(taskId)) {
        throw new Error('Invalid task id.');
    }

    const task = await LeadTask.findOne({ _id: taskId, companyId: user.companyId })
        .populate('assignedTo', 'name email phone role')
        .populate('createdBy', 'name email')
        .populate('completedBy', 'name email')
        .populate('leadId', 'name phone email');

    if (!task) {
        throw new Error('Task not found.');
    }
    return task;
};

// UPDATE TASK
export const updateTaskService = async (user, taskId, body) => {
    if (!user) {
        throw new Error('User not found.');
    }

    if (!mongoose.Types.ObjectId.isValid(taskId)) {
        throw new Error('Invalid task id.');
    }

    const task = await LeadTask.findOne({ _id: taskId, companyId: user.companyId });
    if (!task) {
        throw new Error('Task not found.');
    }

    // Get related lead
    const lead = await Lead.findOne({ _id: task.leadId, companyId: user.companyId });
    if (!lead) {
        throw new Error('Related lead not found.');
    }

    const changes = [];
    if (body.title !== undefined) {
        const newTitle = body.title.trim();

        if (!newTitle) {
            throw new Error('Task title is required.');
        }

        if (newTitle !== task.title) {
            changes.push(`title changed from "${task.title}" to "${newTitle}"`);
            task.title = newTitle;
        }
    }

    if (body.description !== undefined) {
        const newDescription = body.description.trim();
        if (newDescription !== task.description) {
            changes.push('description updated');
            task.description = newDescription;
        }
    }

    if (body.priority !== undefined) {
        if (!['low', 'medium', 'high', 'urgent'].includes(body.priority)) {
            throw new Error('Invalid priority.');
        }

        if (body.priority !== task.priority) {
            changes.push(`priority changed from "${task.priority}" to "${body.priority}"`);
            task.priority = body.priority;
        }
    }

    if (body.assignedTo !== undefined) {
        if (!mongoose.Types.ObjectId.isValid(body.assignedTo)) {
            throw new Error('Invalid assigned user.');
        }

        if (body.assignedTo.toString() !== task.assignedTo.toString()) {
            const assignedUser = await User.findOne({ _id: body.assignedTo, companyId: user.companyId, status: 'active' });
            if (!assignedUser) {
                throw new Error('Assigned user not found.');
            }

            task.assignedTo = body.assignedTo;
            changes.push(`task assigned to ${assignedUser.name}`);
        }
    }

    // DUE DATE
    if (body.dueDate !== undefined) {
        const newDueDate = new Date(body.dueDate);
        if (isNaN(newDueDate.getTime())) {
            throw new Error('Invalid due date.');
        }

        const oldTime = task.dueDate ? new Date(task.dueDate).getTime() : null;
        const newTime = newDueDate.getTime();

        if (oldTime !== newTime) {
            changes.push('due date updated');
            task.dueDate = newDueDate;
        }
    }

    // REMINDER
    if (body.reminderMinutes !== undefined) {
        const reminderMinutes = Number(body.reminderMinutes);
        if (![0, 5, 10, 15].includes(reminderMinutes)) {
            throw new Error('Invalid reminder option.');
        }

        if (reminderMinutes !== task.reminderMinutes) {
            changes.push(`reminder changed to ${reminderMinutes} minutes`);
            task.reminderMinutes = reminderMinutes;

            if (reminderMinutes === 0) {
                task.reminderAt = null;
            } else {
                task.reminderAt = new Date(task.dueDate.getTime() - reminderMinutes * 60 * 1000);
            }
        }
    } else if (body.dueDate !== undefined && task.reminderMinutes > 0) {
        task.reminderAt = new Date(task.dueDate.getTime() - task.reminderMinutes * 60 * 1000);
    }

    // STATUS
    if (body.status !== undefined) {
        if (!['pending', 'completed', 'cancelled'].includes(body.status)) {
            throw new Error('Invalid task status.');
        }

        if (body.status !== task.status) {
            changes.push(`status changed from "${task.status}" to "${body.status}"`);
            task.status = body.status;

            if (body.status === 'completed') {
                task.completedAt = new Date();
                task.completedBy = user._id;
            } else {
                task.completedAt = null;
                task.completedBy = null;
            }
        }
    }

    // SAVE + ACTIVITY ONLY IF SOMETHING CHANGED
    if (changes.length === 0) {
        return await LeadTask.findById(task._id)
            .populate('assignedTo', 'name email phone role')
            .populate('createdBy', 'name email')
            .populate('completedBy', 'name email')
            .populate('leadId', 'name phone email');
    }

    await task.save();

    // Lead Activity
    lead.activities.push({
        type: 'task_updated',
        title: 'Task Updated',
        description: changes.join(', ') + '.',
        createdBy: user._id,
    });

    await lead.save();

    return await LeadTask.findById(task._id)
        .populate('assignedTo', 'name email phone role')
        .populate('createdBy', 'name email')
        .populate('completedBy', 'name email')
        .populate('leadId', 'name phone email');
};
