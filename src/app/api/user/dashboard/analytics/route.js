// src/app/api/user/dashboard/analytics/route.js

import { NextResponse } from 'next/server';

import { connectDB } from '@/config/db';
import { getCurrentUser } from '@/utils/auth';

import Role from '@/models/role.model';
import Lead from '@/models/leads.model';
import LeadTask from '@/models/task.model';
import Call from '@/models/call.model';

export async function GET(request) {
    try {
        await connectDB();

        // ============================================================
        // CURRENT USER
        // ============================================================

        const user = await getCurrentUser(request);

        if (!user) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'User not found.',
                },
                {
                    status: 401,
                }
            );
        }

        const companyId = user.companyId;
        const userId = user._id;

        // ============================================================
        // USER ROLE
        // ============================================================

        await user.populate({
            path: 'roleId',
            select: 'name isSystemRole permissions',
        });

        // ============================================================
        // ADMIN
        // ============================================================

        const isAdmin =
            user.roleId?.isSystemRole === true &&
            user.roleId?.name?.toLowerCase() === 'admin';

        // ============================================================
        // VISIBILITY FILTERS
        // ============================================================

        /*
         * ADMIN
         * -----
         * Everything in the company.
         *
         * NORMAL USER
         * -----------
         *
         * Leads:
         *     Assigned to the user.
         *
         * Tasks:
         *     Created by the user OR assigned to the user.
         *
         * Calls:
         *     Made by the user.
         */

        const leadFilter = isAdmin
            ? {
                  companyId,
              }
            : {
                  companyId,
                  assignedTo: userId,
              };

        const taskFilter = isAdmin
            ? {
                  companyId,
              }
            : {
                  companyId,
                  $or: [
                      {
                          createdBy: userId,
                      },
                      {
                          assignedTo: userId,
                      },
                  ],
              };

        const callFilter = isAdmin
            ? {
                  companyId,
              }
            : {
                  companyId,
                  callerId: userId,
              };

        // ============================================================
        // DATE RANGES
        // ============================================================

        const now = new Date();

        const startOfToday = new Date(
            now.getFullYear(),
            now.getMonth(),
            now.getDate()
        );

        const endOfToday = new Date(
            now.getFullYear(),
            now.getMonth(),
            now.getDate() + 1
        );

        const dayOfWeek = now.getDay();

        /*
         * Monday = beginning of week.
         */

        const daysFromMonday =
            dayOfWeek === 0 ? 6 : dayOfWeek - 1;

        const startOfWeek = new Date(
            now.getFullYear(),
            now.getMonth(),
            now.getDate() - daysFromMonday
        );

        const endOfWeek = new Date(
            startOfWeek.getFullYear(),
            startOfWeek.getMonth(),
            startOfWeek.getDate() + 7
        );

        const startOfMonth = new Date(
            now.getFullYear(),
            now.getMonth(),
            1
        );

        // ============================================================
        // TASK STATUS FILTERS
        // ============================================================

        const pendingTaskFilter = {
            ...taskFilter,
            status: 'pending',
        };

        const completedTaskFilter = {
            ...taskFilter,
            status: 'completed',
        };

        const cancelledTaskFilter = {
            ...taskFilter,
            status: 'cancelled',
        };

        // ============================================================
        // DASHBOARD ANALYTICS QUERIES
        // ============================================================

        const [
            totalTasks,
            pendingTasks,
            completedTasks,
            cancelledTasks,
            overdueTasks,
            dueTodayTasks,
            dueThisWeekTasks,
            leadPipeline,
            leadStatus,
            leadSources,
            leadValue,
            callStats,
            callsByStatus,
            recentLeads,
            recentTasks,
            recentCalls,
        ] = await Promise.all([
            // ========================================================
            // TASKS
            // ========================================================

            LeadTask.countDocuments(taskFilter),

            LeadTask.countDocuments(pendingTaskFilter),

            LeadTask.countDocuments(completedTaskFilter),

            LeadTask.countDocuments(cancelledTaskFilter),

            // Overdue = due date in past + not completed/cancelled
            LeadTask.countDocuments({
                ...taskFilter,

                dueDate: {
                    $lt: now,
                },

                status: {
                    $nin: ['completed', 'cancelled'],
                },
            }),

            // Due today
            LeadTask.countDocuments({
                ...taskFilter,

                dueDate: {
                    $gte: startOfToday,
                    $lt: endOfToday,
                },

                status: {
                    $nin: ['completed', 'cancelled'],
                },
            }),

            // Due this week
            LeadTask.countDocuments({
                ...taskFilter,

                dueDate: {
                    $gte: startOfWeek,
                    $lt: endOfWeek,
                },

                status: {
                    $nin: ['completed', 'cancelled'],
                },
            }),

            // ========================================================
            // LEAD PIPELINE
            // ========================================================

            Lead.aggregate([
                {
                    $match: leadFilter,
                },

                {
                    $group: {
                        _id: '$stage',

                        count: {
                            $sum: 1,
                        },
                    },
                },
            ]),

            // ========================================================
            // LEAD STATUS
            // ========================================================

            Lead.aggregate([
                {
                    $match: leadFilter,
                },

                {
                    $group: {
                        _id: '$status',

                        count: {
                            $sum: 1,
                        },
                    },
                },
            ]),

            // ========================================================
            // LEAD SOURCES
            // ========================================================

            Lead.aggregate([
                {
                    $match: leadFilter,
                },

                {
                    $group: {
                        _id: '$source',

                        count: {
                            $sum: 1,
                        },
                    },
                },

                {
                    $sort: {
                        count: -1,
                    },
                },
            ]),

            // ========================================================
            // DEAL VALUE
            // ========================================================

            Lead.aggregate([
                {
                    $match: leadFilter,
                },

                {
                    $group: {
                        _id: null,

                        totalValue: {
                            $sum: {
                                $ifNull: ['$dealValue', 0],
                            },
                        },

                        wonValue: {
                            $sum: {
                                $cond: [
                                    {
                                        $eq: ['$stage', 'won'],
                                    },
                                    {
                                        $ifNull: [
                                            '$dealValue',
                                            0,
                                        ],
                                    },
                                    0,
                                ],
                            },
                        },

                        openPipelineValue: {
                            $sum: {
                                $cond: [
                                    {
                                        $and: [
                                            {
                                                $ne: [
                                                    '$stage',
                                                    'won',
                                                ],
                                            },
                                            {
                                                $ne: [
                                                    '$stage',
                                                    'lost',
                                                ],
                                            },
                                        ],
                                    },
                                    {
                                        $ifNull: [
                                            '$dealValue',
                                            0,
                                        ],
                                    },
                                    0,
                                ],
                            },
                        },
                    },
                },
            ]),

            // ========================================================
            // CALL TOTALS
            // ========================================================

            Call.aggregate([
                {
                    $match: callFilter,
                },

                {
                    $group: {
                        _id: null,

                        total: {
                            $sum: 1,
                        },

                        today: {
                            $sum: {
                                $cond: [
                                    {
                                        $gte: [
                                            '$calledAt',
                                            startOfToday,
                                        ],
                                    },
                                    1,
                                    0,
                                ],
                            },
                        },

                        week: {
                            $sum: {
                                $cond: [
                                    {
                                        $gte: [
                                            '$calledAt',
                                            startOfWeek,
                                        ],
                                    },
                                    1,
                                    0,
                                ],
                            },
                        },

                        month: {
                            $sum: {
                                $cond: [
                                    {
                                        $gte: [
                                            '$calledAt',
                                            startOfMonth,
                                        ],
                                    },
                                    1,
                                    0,
                                ],
                            },
                        },
                    },
                },
            ]),

            // ========================================================
            // CALL STATUS
            // ========================================================

            Call.aggregate([
                {
                    $match: callFilter,
                },

                {
                    $group: {
                        _id: '$status',

                        count: {
                            $sum: 1,
                        },
                    },
                },
            ]),

            // ========================================================
            // RECENT LEADS
            // ========================================================

            Lead.find(leadFilter)
                .sort({
                    updatedAt: -1,
                })
                .limit(5)
                .populate('assignedTo', 'name')
                .select(
                    'name phone companyName stage status assignedTo dealValue source updatedAt createdAt'
                )
                .lean(),

            // ========================================================
            // RECENT TASKS
            // ========================================================

            LeadTask.find(taskFilter)
                .sort({
                    updatedAt: -1,
                })
                .limit(5)
                .populate('assignedTo', 'name')
                .populate('leadId', 'name phone')
                .populate('createdBy', 'name')
                .select(
                    'title status priority assignedTo leadId createdBy dueDate updatedAt createdAt'
                )
                .lean(),

            // ========================================================
            // RECENT CALLS
            // ========================================================

            Call.find(callFilter)
                .sort({
                    calledAt: -1,
                })
                .limit(5)
                .populate('callerId', 'name')
                .populate('refId', 'name phone')
                .lean(),
        ]);

        // ============================================================
        // TASK SUMMARY
        // ============================================================

        const taskSummary = {
            total: totalTasks,

            pending: pendingTasks,

            completed: completedTasks,

            cancelled: cancelledTasks,

            overdue: overdueTasks,

            dueToday: dueTodayTasks,

            dueThisWeek: dueThisWeekTasks,
        };

        // ============================================================
        // LEAD PIPELINE MAP
        // ============================================================

        const pipelineMap = {
            new: 0,
            contacted: 0,
            qualified: 0,
            proposal_sent: 0,
            negotiation: 0,
            won: 0,
            lost: 0,
        };

        leadPipeline.forEach((item) => {
            if (item._id in pipelineMap) {
                pipelineMap[item._id] = item.count;
            }
        });

        // ============================================================
        // LEAD STATUS MAP
        // ============================================================

        const leadStatusMap = {
            open: 0,
            closed: 0,
            junk: 0,
        };

        leadStatus.forEach((item) => {
            if (item._id in leadStatusMap) {
                leadStatusMap[item._id] = item.count;
            }
        });

        // ============================================================
        // LEAD SOURCE MAP
        // ============================================================

        const leadSourceMap = {};

        leadSources.forEach((item) => {
            if (item._id) {
                leadSourceMap[item._id] = item.count;
            }
        });

        // ============================================================
        // CALL STATUS MAP
        // ============================================================

        const callStatusMap = {
            initiated: 0,
            completed: 0,
            missed: 0,
            busy: 0,
            no_answer: 0,
            failed: 0,
        };

        callsByStatus.forEach((item) => {
            if (item._id in callStatusMap) {
                callStatusMap[item._id] = item.count;
            }
        });

        // ============================================================
        // CALL SUMMARY
        // ============================================================

        const callTotals = callStats[0] || {
            total: 0,
            today: 0,
            week: 0,
            month: 0,
        };

        const meaningfulCalls =
            callStatusMap.completed +
            callStatusMap.missed +
            callStatusMap.busy +
            callStatusMap.no_answer +
            callStatusMap.failed;

        const connectionRate =
            meaningfulCalls > 0
                ? Number(
                      (
                          (callStatusMap.completed /
                              meaningfulCalls) *
                          100
                      ).toFixed(1)
                  )
                : 0;

        // ============================================================
        // LEAD SUMMARY
        // ============================================================

        const totalLeads =
            Object.values(pipelineMap).reduce(
                (sum, value) => sum + value,
                0
            );

        const wonLeads = pipelineMap.won || 0;

        const conversionRate =
            totalLeads > 0
                ? Number(
                      (
                          (wonLeads /
                              totalLeads) *
                          100
                      ).toFixed(1)
                  )
                : 0;

        // ============================================================
        // DEAL VALUE
        // ============================================================

        const dealValue = leadValue[0] || {
            totalValue: 0,
            wonValue: 0,
            openPipelineValue: 0,
        };

        // ============================================================
        // RECENT ACTIVITY
        // ============================================================

        /*
         * Build a simple activity timeline from:
         *
         * - Tasks
         * - Calls
         * - Lead updates
         *
         * No schema changes required.
         */

        const recentActivity = [];

        // ------------------------------------------------------------
        // TASK ACTIVITY
        // ------------------------------------------------------------

        recentTasks.forEach((task) => {
            recentActivity.push({
                id: `task-${task._id}`,

                type: 'task',

                action:
                    task.status === 'completed'
                        ? 'Task completed'
                        : 'Task updated',

                title: task.title,

                status: task.status,

                priority: task.priority,

                date: task.updatedAt,

                referenceId: task._id,
            });
        });

        // ------------------------------------------------------------
        // CALL ACTIVITY
        // ------------------------------------------------------------

        recentCalls.forEach((call) => {
            recentActivity.push({
                id: `call-${call._id}`,

                type: 'call',

                action: 'Call made',

                title:
                    call.refId?.name ||
                    call.phoneNumber ||
                    'Call',

                status: call.status,

                date: call.calledAt,

                referenceId: call._id,
            });
        });

        // ------------------------------------------------------------
        // LEAD ACTIVITY
        // ------------------------------------------------------------

        /*
         * Lead schema does not have a top-level createdBy.
         *
         * Therefore we use the lead's updatedAt as a
         * general "Lead updated" activity.
         */

        recentLeads.forEach((lead) => {
            recentActivity.push({
                id: `lead-${lead._id}`,

                type: 'lead',

                action: 'Lead updated',

                title: lead.name,

                status: lead.stage,

                date: lead.updatedAt,

                referenceId: lead._id,
            });
        });

        // ------------------------------------------------------------
        // SORT ACTIVITY
        // ------------------------------------------------------------

        recentActivity.sort(
            (a, b) =>
                new Date(b.date).getTime() -
                new Date(a.date).getTime()
        );

        const limitedRecentActivity =
            recentActivity.slice(0, 8);

        // ============================================================
        // RESPONSE
        // ============================================================

        return NextResponse.json({
            success: true,

            data: {
                // ====================================================
                // ROLE
                // ====================================================

                isAdmin,

                // ====================================================
                // TASK ANALYTICS
                // ====================================================

                tasks: taskSummary,

                // ====================================================
                // LEAD ANALYTICS
                // ====================================================

                leads: {
                    total: totalLeads,

                    pipeline: pipelineMap,

                    status: leadStatusMap,

                    conversionRate,

                    won: wonLeads,

                    dealValue: {
                        total:
                            dealValue.totalValue || 0,

                        won:
                            dealValue.wonValue || 0,

                        openPipeline:
                            dealValue.openPipelineValue ||
                            0,
                    },

                    sources: leadSourceMap,
                },

                // ====================================================
                // CALL ANALYTICS
                // ====================================================

                calls: {
                    total: callTotals.total || 0,

                    today: callTotals.today || 0,

                    week: callTotals.week || 0,

                    month: callTotals.month || 0,

                    byStatus: callStatusMap,

                    connectionRate,
                },

                // ====================================================
                // RECENT ACTIVITY
                // ====================================================

                recentActivity:
                    limitedRecentActivity,

                // ====================================================
                // RECENT DATA
                // ====================================================

                recentLeads,

                recentTasks,
            },
        });
    } catch (error) {
        console.error(
            'GET DASHBOARD ANALYTICS ERROR:',
            error
        );

        return NextResponse.json(
            {
                success: false,

                message:
                    error.message ||
                    'Failed to fetch dashboard analytics.',
            },
            {
                status: 400,
            }
        );
    }
}