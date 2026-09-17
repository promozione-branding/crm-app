// src/app/api/user/dashboard/route.js

import { NextResponse } from "next/server";

import { connectDB } from "@/config/db";
import { getCurrentUser } from "@/utils/auth";

import User from "@/models/user.model";
import Lead from "@/models/leads.model";
import LeadTask from "@/models/task.model";

export async function GET(request) {
    try {
        await connectDB();

        const user = await getCurrentUser(request);

        if (!user) {
            return NextResponse.json(
                {
                    success: false,
                    message: "User not found.",
                },
                {
                    status: 401,
                }
            );
        }

        const companyId = user.companyId;

        const [
            usersCount,
            leadsCount,
            tasksCount,
        ] = await Promise.all([
            User.countDocuments({
                companyId,
            }),

            Lead.countDocuments({
                companyId,
            }),

            LeadTask.countDocuments({
                companyId,
            }),
        ]);

        return NextResponse.json({
            success: true,

            data: {
                users: usersCount,
                leads: leadsCount,
                calls: 0,
                tasks: tasksCount,
            },
        });
    } catch (error) {
        console.error(
            "GET DASHBOARD ERROR:",
            error
        );

        return NextResponse.json(
            {
                success: false,
                message:
                    error.message ||
                    "Failed to fetch dashboard data.",
            },
            {
                status: 400,
            }
        );
    }
}