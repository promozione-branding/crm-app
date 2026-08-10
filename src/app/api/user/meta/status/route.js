import { NextResponse } from "next/server";
import { connectDB } from "@/config/db";
import Integration from "@/models/integration.model.js";
import { getCurrentUser } from "@/utils/auth";

export async function GET(request) {
    try {
        await connectDB();
        const user = await getCurrentUser(request);
        const companyId = user.companyId;

        if (!companyId) {
            return NextResponse.json({ success: false, message: "Company not found", }, { status: 400 });
        }

        const integration = await Integration.findOne({ companyId, provider: "meta", }).lean();

        return NextResponse.json({
            success: true,
            connected: integration?.status === "connected",
            integration: integration
                ? {
                    status: integration.status,
                    account: integration.account,
                    connectedAt: integration.connectedAt,
                    metadata: integration.metadata,
                }
                : null,
        });
    } catch (error) {
        console.error("META STATUS ERROR:", error);
        return NextResponse.json({ success: false, message: "Failed to get Meta status", }, { status: 500 });
    }
}