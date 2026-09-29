// src/controllers/user/reportsController.js

import Lead from '@/models/leads.model.js';
import LeadTask from '@/models/task.model.js';
import Call from '@/models/call.model.js';
import User from '@/models/user.model.js';

function getDateRange(range, from, to) {
    const now = new Date();

    // CUSTOM
    if (range === 'custom') {
        if (!from || !to) {
            throw new Error('Custom date range requires from and to dates.');
        }

        const start = new Date(from);
        const end = new Date(to);

        if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
            throw new Error('Invalid custom date range.');
        }

        start.setHours(0, 0, 0, 0);
        end.setHours(23, 59, 59, 999);

        if (start > end) {
            throw new Error('From date cannot be after To date.');
        }

        return { start, end };
    }

    // TODAY
    if (range === 'today') {
        const start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const end = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);

        return { start, end };
    }

    // LAST 3 DAYS (includes today)
    if (range === 'last_3_days') {
        const start = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 2);
        const end = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);

        return { start, end };
    }

    // THIS MONTH
    if (range === 'this_month') {
        return {
            start: new Date(now.getFullYear(), now.getMonth(), 1),
            end: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1),
        };
    }

    // LAST MONTH
    if (range === 'last_month') {
        return {
            start: new Date(now.getFullYear(), now.getMonth() - 1, 1),
            end: new Date(now.getFullYear(), now.getMonth(), 1),
        };
    }

    // LAST 3 MONTHS
    if (range === 'last_3_months') {
        const start = new Date(now.getFullYear(), now.getMonth() - 2, 1);

        return {
            start,
            end: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1),
        };
    }

    // DEFAULT
    return {
        start: new Date(now.getFullYear(), now.getMonth(), 1),
        end: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1),
    };
}

export const getReportsService = async ({ user, range = 'this_month', from, to }) => {
    if (!user) {
        throw new Error('User not found.');
    }

    const companyId = user.companyId;
    const userId = user._id;

    const isAdmin =
        user.roleId?.isSystemRole === true &&
        user.roleId?.name?.toLowerCase() === 'admin';

    const { start, end } = getDateRange(range, from, to);

    // ============================================================
    // DATA VISIBILITY
    // ============================================================

    const leadFilter = isAdmin
        ? { companyId }
        : { companyId, assignedTo: userId };

    const taskFilter = isAdmin
        ? { companyId }
        : { companyId, $or: [{ createdBy: userId }, { assignedTo: userId }] };

    const callFilter = isAdmin
        ? { companyId }
        : { companyId, callerId: userId };

    // ============================================================
    // DATE FILTERS
    // ============================================================

    const leadDateFilter = {
        ...leadFilter,
        createdAt: { $gte: start, $lt: end },
    };

    const taskDateFilter = {
        ...taskFilter,
        createdAt: { $gte: start, $lt: end },
    };

    const callDateFilter = {
        ...callFilter,
        calledAt: { $gte: start, $lt: end },
    };

    // ============================================================
    // REPORT QUERIES (existing)
    // ============================================================

    const [
        totalLeads,
        leadsByStage,
        leadValue,
        totalTasks,
        tasksByStatus,
        taskTiming,
        totalCalls,
        callsByStatus,
        callStats,
    ] = await Promise.all([
        Lead.countDocuments(leadDateFilter),

        Lead.aggregate([
            { $match: leadDateFilter },
            {
                $group: {
                    _id: '$stage',
                    count: { $sum: 1 },
                    value: { $sum: { $ifNull: ['$dealValue', 0] } },
                },
            },
        ]),

        Lead.aggregate([
            { $match: leadDateFilter },
            {
                $group: {
                    _id: null,
                    totalValue: { $sum: { $ifNull: ['$dealValue', 0] } },
                    wonValue: {
                        $sum: {
                            $cond: [
                                { $eq: ['$stage', 'won'] },
                                { $ifNull: ['$dealValue', 0] },
                                0,
                            ],
                        },
                    },
                    lostValue: {
                        $sum: {
                            $cond: [
                                { $eq: ['$stage', 'lost'] },
                                { $ifNull: ['$dealValue', 0] },
                                0,
                            ],
                        },
                    },
                    openPipelineValue: {
                        $sum: {
                            $cond: [
                                {
                                    $and: [
                                        { $ne: ['$stage', 'won'] },
                                        { $ne: ['$stage', 'lost'] },
                                    ],
                                },
                                { $ifNull: ['$dealValue', 0] },
                                0,
                            ],
                        },
                    },
                },
            },
        ]),

        LeadTask.countDocuments(taskDateFilter),

        LeadTask.aggregate([
            { $match: taskDateFilter },
            { $group: { _id: '$status', count: { $sum: 1 } } },
        ]),

        LeadTask.aggregate([
            {
                $match: {
                    ...taskFilter,
                    status: 'completed',
                    completedAt: { $gte: start, $lt: end },
                },
            },
            { $project: { onTime: { $lte: ['$completedAt', '$dueDate'] } } },
            { $group: { _id: '$onTime', count: { $sum: 1 } } },
        ]),

        Call.countDocuments(callDateFilter),

        Call.aggregate([
            { $match: callDateFilter },
            { $group: { _id: '$status', count: { $sum: 1 } } },
        ]),

        Call.aggregate([
            { $match: callDateFilter },
            {
                $group: {
                    _id: null,
                    totalDuration: { $sum: { $ifNull: ['$durationSeconds', 0] } },
                    averageDuration: { $avg: { $ifNull: ['$durationSeconds', 0] } },
                },
            },
        ]),
    ]);

    // ============================================================
    // STAGE MAP
    // ============================================================

    const stages = ['new', 'contacted', 'qualified', 'proposal_sent', 'negotiation', 'won', 'lost'];

    const pipeline = {};

    stages.forEach((stage) => {
        pipeline[stage] = { count: 0, value: 0 };
    });

    leadsByStage.forEach((item) => {
        if (pipeline[item._id]) {
            pipeline[item._id] = {
                count: item.count,
                value: item.value || 0,
            };
        }
    });

    // ============================================================
    // TASK MAP
    // ============================================================

    const taskStatus = { pending: 0, completed: 0, cancelled: 0 };

    tasksByStatus.forEach((item) => {
        if (item._id in taskStatus) {
            taskStatus[item._id] = item.count;
        }
    });

    const taskTimingMap = { completedOnTime: 0, completedLate: 0 };

    taskTiming.forEach((item) => {
        if (item._id === true) {
            taskTimingMap.completedOnTime = item.count;
        }
        if (item._id === false) {
            taskTimingMap.completedLate = item.count;
        }
    });

    // ============================================================
    // CALL MAP
    // ============================================================

    const callStatus = {
        initiated: 0,
        completed: 0,
        missed: 0,
        busy: 0,
        no_answer: 0,
        failed: 0,
    };

    callsByStatus.forEach((item) => {
        if (item._id in callStatus) {
            callStatus[item._id] = item.count;
        }
    });

    const meaningfulCalls =
        callStatus.completed +
        callStatus.missed +
        callStatus.busy +
        callStatus.no_answer +
        callStatus.failed;

    const connectionRate =
        meaningfulCalls > 0
            ? Number(((callStatus.completed / meaningfulCalls) * 100).toFixed(1))
            : 0;

    // ============================================================
    // LEAD SUMMARY
    // ============================================================

    const wonLeads = pipeline.won.count;

    const conversionRate =
        totalLeads > 0
            ? Number(((wonLeads / totalLeads) * 100).toFixed(1))
            : 0;

    const deal = leadValue[0] || {
        totalValue: 0,
        wonValue: 0,
        lostValue: 0,
        openPipelineValue: 0,
    };

    const call = callStats[0] || { totalDuration: 0, averageDuration: 0 };

    // ============================================================
    // OVERDUE TASKS
    // ============================================================

    const overdueTasks = await LeadTask.countDocuments({
        ...taskFilter,
        dueDate: { $lt: end },
        status: 'pending',
    });

    // ============================================================
    // PER-USER PERFORMANCE
    // ============================================================

    // Cap the per-user table to 25 users for performance.
// Sorted later by leads desc, so top performers always appear.
const PER_USER_LIMIT = 25;

const usersToReport = isAdmin
    ? await User.find({ companyId, status: 'active' })
          .select('_id name email')
          .limit(PER_USER_LIMIT)
          .lean()
    : await User.find({ _id: userId })
          .select('_id name email')
          .lean();

    const userIds = usersToReport.map((u) => u._id);

    // 2. Aggregate per-user metrics (in parallel)
    const [leadsByUser, tasksByUser, callsByUser] = await Promise.all([
        Lead.aggregate([
            { $match: { ...leadDateFilter, assignedTo: { $in: userIds } } },
            {
                $group: {
                    _id: '$assignedTo',
                    leads: { $sum: 1 },
                    won: {
                        $sum: { $cond: [{ $eq: ['$stage', 'won'] }, 1, 0] },
                    },
                    wonValue: {
                        $sum: {
                            $cond: [
                                { $eq: ['$stage', 'won'] },
                                { $ifNull: ['$dealValue', 0] },
                                0,
                            ],
                        },
                    },
                    pipelineValue: {
                        $sum: {
                            $cond: [
                                {
                                    $and: [
                                        { $ne: ['$stage', 'won'] },
                                        { $ne: ['$stage', 'lost'] },
                                    ],
                                },
                                { $ifNull: ['$dealValue', 0] },
                                0,
                            ],
                        },
                    },
                },
            },
        ]),

        LeadTask.aggregate([
            {
                $match: {
                    ...taskDateFilter,
                    $or: [
                        { assignedTo: { $in: userIds } },
                        { createdBy: { $in: userIds } },
                    ],
                },
            },
            {
                $group: {
                    _id: { $ifNull: ['$assignedTo', '$createdBy'] },
                    tasks: { $sum: 1 },
                    completed: {
                        $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] },
                    },
                    pending: {
                        $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] },
                    },
                },
            },
        ]),

        Call.aggregate([
            { $match: { ...callDateFilter, callerId: { $in: userIds } } },
            {
                $group: {
                    _id: '$callerId',
                    calls: { $sum: 1 },
                    connected: {
                        $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] },
                    },
                    duration: {
                        $sum: { $ifNull: ['$durationSeconds', 0] },
                    },
                },
            },
        ]),
    ]);

    // 3. Build lookup maps
    const leadsMap = leadsByUser.reduce((acc, item) => {
        acc[String(item._id)] = item;
        return acc;
    }, {});

    const tasksMap = tasksByUser.reduce((acc, item) => {
        acc[String(item._id)] = item;
        return acc;
    }, {});

    const callsMap = callsByUser.reduce((acc, item) => {
        acc[String(item._id)] = item;
        return acc;
    }, {});

    // 4. Merge per-user metrics
    const perUser = usersToReport.map((u) => {
        const key = String(u._id);
        const leadData = leadsMap[key] || {};
        const taskData = tasksMap[key] || {};
        const callData = callsMap[key] || {};

        const leads = leadData.leads || 0;
        const won = leadData.won || 0;

        return {
            userId: u._id,
            name: u.name || '—',
            email: u.email || '—',

            leads,
            won,
            conversionRate:
                leads > 0 ? Number(((won / leads) * 100).toFixed(1)) : 0,
            wonValue: leadData.wonValue || 0,
            pipelineValue: leadData.pipelineValue || 0,

            tasks: taskData.tasks || 0,
            tasksCompleted: taskData.completed || 0,
            tasksPending: taskData.pending || 0,

            calls: callData.calls || 0,
            callsConnected: callData.connected || 0,
            callDuration: callData.duration || 0,
        };
    });

    // Sort by leads desc so top performers appear first
    perUser.sort((a, b) => b.leads - a.leads);

    // ============================================================
    // RETURN
    // ============================================================

    return {
        range: {
            type: range,
            from: start,
            to: end,
        },

        isAdmin,

        leads: {
            total: totalLeads,
            pipeline,
            conversionRate,
            won: wonLeads,
        },

        deals: {
            totalValue: deal.totalValue || 0,
            wonValue: deal.wonValue || 0,
            lostValue: deal.lostValue || 0,
            openPipelineValue: deal.openPipelineValue || 0,
        },

        tasks: {
            total: totalTasks,
            pending: taskStatus.pending,
            completed: taskStatus.completed,
            cancelled: taskStatus.cancelled,
            overdue: overdueTasks,
            ...taskTimingMap,
        },

        calls: {
            total: totalCalls,
            ...callStatus,
            connectionRate,
            totalDuration: call.totalDuration || 0,
            averageDuration: Number(call.averageDuration || 0).toFixed(1),
        },

        // ========================================================
        // NEW: per-user performance
        // ========================================================
        perUser,
    };
};