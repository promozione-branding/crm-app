import { NextResponse } from "next/server";
import { connectDB } from "@/config/db";
import Company from "@/models/company.model.js";
import { getCurrentUser } from "@/utils/auth";

export async function GET(req) {
    try {
        await connectDB();
        const user = await getCurrentUser(req);
        if (!user) {
            return NextResponse.json({ success: false, message: "Unauthorized", }, { status: 401 });
        }

        const company = await Company.findById(user.companyId)
            .select("webhookApiKeyPrefix webhookApiStatus webhookLastUsedAt")
            .lean();

        if (!company) {
            return NextResponse.json({ success: false, message: "Company not found", }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            webhook: {
                url: `${process.env.NEXT_PUBLIC_APP_URL}/api/user/webhook/leads`,
                apiKeyPrefix: company.webhookApiKeyPrefix || null,
                status: company.webhookApiStatus || "inactive",
                lastUsedAt: company.webhookLastUsedAt || null,
            },
        });

    } catch (error) {
        console.error("Get webhook configuration error:", error);

        return NextResponse.json(
            { success: false, message: "Failed to load webhook configuration", },
            { status: 500 }
        );
    }
}