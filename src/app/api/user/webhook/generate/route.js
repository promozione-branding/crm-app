import { NextResponse } from "next/server";
import { connectDB } from "@/config/db";
import Company from "@/models/company.model.js";
import { generateWebhookApiKey, hashWebhookApiKey, getWebhookApiPrefix, } from "@/lib/webhook/webhookApi.js";
import { getCurrentUser } from "@/utils/auth";

export async function POST(req) {
    try {
        await connectDB();
        const user = await getCurrentUser(req);

        if (!user) {
            return NextResponse.json({ success: false, message: "Unauthorized", }, { status: 401 });
        }

        if (!user.companyId) {
            return NextResponse.json({ success: false, message: "Company not found", }, { status: 400 });
        }

        const apiKey = generateWebhookApiKey();
        const apiKeyHash = hashWebhookApiKey(apiKey);
        const apiKeyPrefix = getWebhookApiPrefix(apiKey);
        const company = await Company.findByIdAndUpdate(
            user.companyId,
            {
                webhookApiKeyHash: apiKeyHash,
                webhookApiKeyPrefix: apiKeyPrefix,
                webhookApiStatus: "active",
                webhookLastUsedAt: null,
            },
            { new: true, }
        );

        if (!company) {
            return NextResponse.json({ success: false, message: "Company not found", }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            message: "Webhook API key generated successfully",
            webhookUrl: `${process.env.NEXT_PUBLIC_APP_URL}/api/webhooks/leads`,
            apiKey,
        }, { status: 200 });

    } catch (error) {
        console.error("Generate webhook API key error:", error);
        return NextResponse.json(
            { success: false, message: "Failed to generate API key", },
            { status: 500 }
        );
    }
}