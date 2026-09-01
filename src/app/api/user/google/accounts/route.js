import { NextResponse } from "next/server";
import { getCurrentUser } from "@/utils/auth";
import { connectDB } from "@/config/db";
import Integration from "@/models/integration.model.js";
import googleAdsClient from "@/lib/google/googleAds.js";

export async function GET(request) {
    try {
        // -----------------------------------------
        // 1. Check logged-in CRM user
        // -----------------------------------------
        let user;

        try {
            user = await getCurrentUser(request);
        } catch (error) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Not authenticated",
                },
                { status: 401 }
            );
        }

        if (!user?.companyId) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Company not found",
                },
                { status: 400 }
            );
        }

        // -----------------------------------------
        // 2. Connect DB
        // -----------------------------------------
        await connectDB();

        // -----------------------------------------
        // 3. Get Google Ads integration
        // -----------------------------------------
        const integration = await Integration.findOne({
            companyId: user.companyId,
            provider: "google_ads",
            status: "connected",
        });

        if (!integration) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Google Ads is not connected",
                },
                { status: 404 }
            );
        }

        const refreshToken =
            integration.credentials?.refreshToken;

        if (!refreshToken) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Google Ads refresh token not found",
                },
                { status: 400 }
            );
        }

        // -----------------------------------------
        // 4. Create Google Ads customer
        // -----------------------------------------
        const customer = googleAdsClient.Customer({
            customer_id: "customers/-",
            refresh_token: refreshToken,
        });

        // -----------------------------------------
        // 5. Get accessible customers
        // -----------------------------------------
        const accessibleCustomers =
            await googleAdsClient.listAccessibleCustomers(
                refreshToken
            );

        console.log(
            "Accessible Google Ads Customers:",
            accessibleCustomers
        );

        // -----------------------------------------
        // 6. Return accounts
        // -----------------------------------------
        return NextResponse.json({
            success: true,
            data: accessibleCustomers,
        });
    } catch (error) {
        console.error(
            "Google Ads Accounts Error:",
            error
        );

        return NextResponse.json(
            {
                success: false,
                message:
                    error?.message ||
                    "Failed to fetch Google Ads accounts",
            },
            { status: 500 }
        );
    }
}