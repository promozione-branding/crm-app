// src/app/api/user/dashboard/route.js

import { NextResponse } from 'next/server';

import { connectDB } from '@/config/db';
import { getCurrentUser } from '@/utils/auth';

import User from '@/models/user.model';
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
        // GET USER ROLE
        // ============================================================

        await user.populate({
            path: 'roleId',
            select: 'name isSystemRole permissions',
        });

        // ============================================================
        // ADMIN CHECK
        // ============================================================

        /*
         * Your Admin role is:
         *
         * name: Admin
         * isSystemRole: true
         */

        const isAdmin =
            user.roleId?.isSystemRole === true &&
            user.roleId?.name?.toLowerCase() === 'admin';

        // ============================================================
        // DASHBOARD VISIBILITY
        // ============================================================

        /*
         * ADMIN
         * -----
         * Sees everything belonging to the company.
         *
         * OTHER USERS
         * ------------
         *
         * Leads:
         *     assigned to them
         *
         * Tasks:
         *     created by them OR assigned to them
         *
         * Calls:
         *     made by them
         */

        const leadVisibilityFilter = isAdmin
            ? {
                  companyId,
              }
            : {
                  companyId,
                  assignedTo: userId,
              };

        const taskVisibilityFilter = isAdmin
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

        const callVisibilityFilter = isAdmin
            ? {
                  companyId,
              }
            : {
                  companyId,
                  callerId: userId,
              };

        // ============================================================
        // TIME RANGES
        // ============================================================

        const now = new Date();

        const startOfToday = new Date(
            now.getFullYear(),
            now.getMonth(),
            now.getDate()
        );

        const startOfWeek = new Date(
            now.getTime() - 7 * 24 * 60 * 60 * 1000
        );

        const startOfMonth = new Date(
            now.getTime() - 30 * 24 * 60 * 60 * 1000
        );

        // ============================================================
        // DASHBOARD DATA
        // ============================================================

        const [
            usersCount,
            leadsCount,
            tasksCount,
            callsTotal,
            callsToday,
            callsWeek,
            callsMonth,
            callsByStatus,
            callsByCaller,
            recentCalls,
            recentLeads,
            recentTasks,
        ] = await Promise.all([
            // ========================================================
            // USERS
            // ========================================================

            /*
             * Admin:
             *     All users in company.
             *
             * Other users:
             *     Only themselves.
             */

            isAdmin
                ? User.countDocuments({
                      companyId,
                  })
                : User.countDocuments({
                      companyId,
                      _id: userId,
                  }),

            // ========================================================
            // LEADS
            // ========================================================

            Lead.countDocuments(leadVisibilityFilter),

            // ========================================================
            // TASKS
            // ========================================================

            LeadTask.countDocuments(taskVisibilityFilter),

            // ========================================================
            // TOTAL CALLS
            // ========================================================

            Call.countDocuments(callVisibilityFilter),

            // ========================================================
            // CALLS TODAY
            // ========================================================

            Call.countDocuments({
                ...callVisibilityFilter,
                calledAt: {
                    $gte: startOfToday,
                },
            }),

            // ========================================================
            // CALLS LAST 7 DAYS
            // ========================================================

            Call.countDocuments({
                ...callVisibilityFilter,
                calledAt: {
                    $gte: startOfWeek,
                },
            }),

            // ========================================================
            // CALLS LAST 30 DAYS
            // ========================================================

            Call.countDocuments({
                ...callVisibilityFilter,
                calledAt: {
                    $gte: startOfMonth,
                },
            }),

            // ========================================================
            // CALLS BY STATUS
            // ========================================================

            Call.aggregate([
                {
                    $match: callVisibilityFilter,
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
            // CALLS BY CALLER
            // ========================================================

            Call.aggregate([
                {
                    $match: callVisibilityFilter,
                },

                {
                    $group: {
                        _id: '$callerId',

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

                {
                    $limit: 5,
                },

                {
                    $lookup: {
                        from: 'users',

                        localField: '_id',

                        foreignField: '_id',

                        as: 'user',
                    },
                },

                {
                    $unwind: {
                        path: '$user',

                        preserveNullAndEmptyArrays: true,
                    },
                },

                {
                    $project: {
                        _id: 1,

                        count: 1,

                        name: '$user.name',

                        email: '$user.email',
                    },
                },
            ]),

            // ========================================================
            // RECENT CALLS
            // ========================================================

            Call.find(callVisibilityFilter)
                .sort({
                    calledAt: -1,
                })
                .limit(5)
                .populate('callerId', 'name email')
                .populate('refId', 'name phone')
                .lean(),

            // ========================================================
            // RECENT LEADS
            // ========================================================

            Lead.find(leadVisibilityFilter)
                .sort({
                    updatedAt: -1,
                })
                .limit(5)
                .populate('assignedTo', 'name')
                .select(
                    'name phone companyName stage status assignedTo updatedAt createdAt'
                )
                .lean(),

            // ========================================================
            // RECENT TASKS
            // ========================================================

            LeadTask.find(taskVisibilityFilter)
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
        ]);

        // ============================================================
        // CALL STATUS MAP
        // ============================================================

        const statusMap = callsByStatus.reduce(
            (acc, item) => {
                acc[item._id] = item.count;

                return acc;
            },
            {}
        );

        // ============================================================
        // RESPONSE
        // ============================================================

        return NextResponse.json({
            success: true,

            data: {
                // ====================================================
                // TOP STATS
                // ====================================================

                users: usersCount,

                leads: leadsCount,

                tasks: tasksCount,

                calls: callsTotal,

                // ====================================================
                // RECENT DATA
                // ====================================================

                recentLeads,

                recentTasks,

                // ====================================================
                // CALL DETAILS
                // ====================================================

                callsDetail: {
                    total: callsTotal,

                    today: callsToday,

                    week: callsWeek,

                    month: callsMonth,

                    byStatus: {
                        initiated: statusMap.initiated || 0,

                        completed: statusMap.completed || 0,

                        missed: statusMap.missed || 0,

                        busy: statusMap.busy || 0,

                        no_answer: statusMap.no_answer || 0,

                        failed: statusMap.failed || 0,
                    },

                    byCaller: callsByCaller,

                    recent: recentCalls,
                },
            },
        });
    } catch (error) {
        console.error('GET DASHBOARD ERROR:', error);

        return NextResponse.json(
            {
                success: false,

                message:
                    error.message ||
                    'Failed to fetch dashboard data.',
            },
            {
                status: 400,
            }
        );
    }
}