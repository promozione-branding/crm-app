import { NextResponse } from "next/server";
import { getCurrentUser } from "@/utils/auth";
import { connectDB } from "@/config/db";
import Integration from "@/models/integration.model.js";
import googleAdsClient from "@/lib/google/googleAds.js";

export async function GET(req) {
    try {
        // 1. CRM authentication
        const user = await getCurrentUser(req);

        if (!user?.companyId) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Company not found",
                },
                { status: 400 }
            );
        }

        // 2. Database
        await connectDB();

        // 3. Get Google Ads integration
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
                    message:
                        "Google Ads refresh token not found",
                },
                { status: 400 }
            );
        }

        // 4. Get accessible customers
        const accessibleCustomers =
            await googleAdsClient.listAccessibleCustomers(
                refreshToken
            );

        const resourceNames =
            accessibleCustomers.resource_names || [];

        console.log(
            "Google Ads resource names:",
            resourceNames
        );

        const customerIds = resourceNames.map(
            (resourceName) =>
                resourceName.replace("customers/", "")
        );

        console.log(
            "Google Ads customer IDs:",
            customerIds
        );

        // 5. Get account details
        const accounts = [];

        for (const customerId of customerIds) {
            try {
                console.log(
                    `Fetching customer: ${customerId}`
                );

                const customer =
                    googleAdsClient.Customer({
                        customer_id: customerId,
                        refresh_token: refreshToken,
                    });

                const result =
                    await customer.query(`
                        SELECT
                            customer.id,
                            customer.descriptive_name,
                            customer.currency_code,
                            customer.time_zone,
                            customer.manager
                        FROM customer
                        LIMIT 1
                    `);

                console.log(
                    `Customer ${customerId} result:`,
                    result
                );

                if (result?.length) {
                    const row = result[0];

                    accounts.push({
                        customerId:
                            row.customer.id?.toString(),

                        name:
                            row.customer
                                .descriptive_name ||
                            "Unnamed Account",

                        currency:
                            row.customer.currency_code ||
                            null,

                        timezone:
                            row.customer.time_zone ||
                            null,

                        manager:
                            row.customer.manager ||
                            false,
                    });
                }
            } catch (accountError) {
                console.error(
                    `Customer ${customerId} failed:`,
                    accountError?.errors ||
                        accountError?.message ||
                        accountError
                );
            }
        }

        console.log(
            "Final Google Ads accounts:",
            accounts
        );

        return NextResponse.json({
            success: true,
            data: accounts,
        });
    } catch (error) {
        console.error(
            "Google Ads Account Details Error:",
            error
        );

        return NextResponse.json(
            {
                success: false,
                message:
                    error?.errors?.[0]?.message ||
                    error?.message ||
                    "Failed to fetch Google Ads account details",
            },
            { status: 500 }
        );
    }
}