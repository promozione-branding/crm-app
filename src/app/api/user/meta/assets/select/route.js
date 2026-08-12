import { NextResponse } from "next/server";
import { connectDB } from "@/config/db";
import Integration from "@/models/integration.model.js";
import { getCurrentUser } from "@/utils/auth";

const META_API_VERSION = "v23.0";

export async function POST(request) {
    try {
        await connectDB();

        const user = await getCurrentUser(request);

        if (!user) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Not authenticated",
                },
                { status: 401 }
            );
        }

        const companyId = user.companyId;

        if (!companyId) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Company not found",
                },
                { status: 400 }
            );
        }

        const body = await request.json();

        const {
            pageId,
            adAccountId,
        } = body;

        if (!pageId) {
            return NextResponse.json(
                {
                    success: false,
                    message: "pageId is required",
                },
                { status: 400 }
            );
        }

        // --------------------------------------------------
        // 1. Get Integration
        // --------------------------------------------------

        const integration = await Integration.findOne({
            companyId,
            provider: "meta",
            status: "connected",
        });

        if (!integration) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Meta is not connected",
                },
                { status: 400 }
            );
        }

        const userAccessToken =
            integration.credentials?.accessToken;

        if (!userAccessToken) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Meta access token not found",
                },
                { status: 400 }
            );
        }

        // --------------------------------------------------
        // 2. Get Pages
        // --------------------------------------------------

        const pagesUrl = new URL(
            `https://graph.facebook.com/${META_API_VERSION}/me/accounts`
        );

        pagesUrl.searchParams.set(
            "fields",
            "id,name,access_token,category,tasks"
        );

        pagesUrl.searchParams.set(
            "access_token",
            userAccessToken
        );

        const pagesResponse = await fetch(
            pagesUrl.toString()
        );

        const pagesData =
            await pagesResponse.json();

        if (
            !pagesResponse.ok ||
            pagesData.error
        ) {
            console.error(
                "META PAGES ERROR:",
                pagesData
            );

            return NextResponse.json(
                {
                    success: false,
                    message: "Failed to fetch Meta Pages",
                    error: pagesData.error || null,
                },
                { status: 400 }
            );
        }

        // --------------------------------------------------
        // 3. Find selected Page
        // --------------------------------------------------

        const selectedPage =
            (pagesData.data || []).find(
                page =>
                    String(page.id) ===
                    String(pageId)
            );

        if (!selectedPage) {
            return NextResponse.json(
                {
                    success: false,
                    message:
                        "Selected Facebook Page was not found",
                },
                { status: 404 }
            );
        }

        console.log(
            "SELECTED META PAGE:",
            {
                id: selectedPage.id,
                name: selectedPage.name,
                tasks: selectedPage.tasks,
            }
        );

        // --------------------------------------------------
        // 4. Check Page Access Token
        // --------------------------------------------------

        const pageAccessToken =
            selectedPage.access_token;

        if (!pageAccessToken) {
            return NextResponse.json(
                {
                    success: false,
                    message:
                        "Page access token was not returned by Meta",
                },
                { status: 400 }
            );
        }

        // --------------------------------------------------
        // 5. Check token permissions
        // --------------------------------------------------

        const permissionsUrl = new URL(
            `https://graph.facebook.com/${META_API_VERSION}/me/permissions`
        );

        permissionsUrl.searchParams.set(
            "access_token",
            userAccessToken
        );

        const permissionsResponse =
            await fetch(
                permissionsUrl.toString()
            );

        const permissionsData =
            await permissionsResponse.json();

        console.log(
            "META PERMISSIONS:",
            JSON.stringify(
                permissionsData,
                null,
                2
            )
        );

        // --------------------------------------------------
        // 6. Subscribe Page to leadgen webhook
        // --------------------------------------------------

        const subscribeUrl =
            `https://graph.facebook.com/${META_API_VERSION}/${pageId}/subscribed_apps`;

        const subscribeResponse =
            await fetch(
                subscribeUrl,
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/x-www-form-urlencoded",
                    },

                    body:
                        new URLSearchParams({
                            subscribed_fields:
                                "leadgen",

                            access_token:
                                pageAccessToken,
                        }).toString(),
                }
            );

        const subscribeData =
            await subscribeResponse.json();

        console.log(
            "META LEADGEN SUBSCRIBE:",
            JSON.stringify(
                subscribeData,
                null,
                2
            )
        );

        if (
            !subscribeResponse.ok ||
            subscribeData.error
        ) {
            return NextResponse.json(
                {
                    success: false,
                    message:
                        "Failed to subscribe Page to leadgen webhook",

                    error:
                        subscribeData.error ||
                        subscribeData,

                    pageId,
                },
                { status: 400 }
            );
        }

        // --------------------------------------------------
        // 7. Verify subscription
        // --------------------------------------------------

        const checkSubscriptionUrl =
            new URL(
                `https://graph.facebook.com/${META_API_VERSION}/${pageId}/subscribed_apps`
            );

        checkSubscriptionUrl.searchParams.set(
            "access_token",
            pageAccessToken
        );

        const checkResponse =
            await fetch(
                checkSubscriptionUrl.toString()
            );

        const checkData =
            await checkResponse.json();

        console.log(
            "META PAGE SUBSCRIPTIONS:",
            JSON.stringify(
                checkData,
                null,
                2
            )
        );

        // --------------------------------------------------
        // 8. Save Page + Ad Account
        // --------------------------------------------------

        integration.metadata = {
            ...(integration.metadata || {}),

            pageId:
                String(selectedPage.id),

            pageName:
                selectedPage.name,

            pageAccessToken:
                pageAccessToken,

            adAccountId:
                adAccountId
                    ? String(adAccountId)
                    : integration.metadata?.adAccountId || null,

            leadgenSubscribed: true,

            leadgenSubscribedAt:
                new Date(),
        };

        await integration.save();

        // --------------------------------------------------
        // 9. Success
        // --------------------------------------------------
        console.log("META PAGE SUBSCRIBE:", {
            pageId,
            subscribeStatus: subscribeResponse.status,
            subscribeData,
        });
        return NextResponse.json({
            success: true,

            message:
                "Facebook Page connected successfully",

            page: {
                id: selectedPage.id,
                name: selectedPage.name,
            },

            adAccountId:
                adAccountId || null,

            leadgenSubscribed: true,

            subscriptions:
                checkData?.data || [],
        });

    } catch (error) {

        console.error(
            "META PAGE SELECT ERROR:",
            error
        );

        return NextResponse.json(
            {
                success: false,
                message:
                    "Failed to connect Facebook Page",

                error:
                    process.env.NODE_ENV ===
                        "development"
                        ? error.message
                        : undefined,
            },
            { status: 500 }
        );
    }
}