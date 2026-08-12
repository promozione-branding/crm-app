import { NextResponse } from "next/server";
import crypto from "crypto";
import { getCurrentUser } from "@/utils/auth";

export async function GET(request) {
    try {
        const appId = process.env.META_APP_ID;
        const configId = process.env.META_CONFIG_ID;
        const redirectUri = process.env.META_REDIRECT_URI;
        if (!appId || !configId || !redirectUri) {
            return NextResponse.json({ success: false, message: "Meta configuration is missing", }, { status: 500 });
        }

        // Get logged-in CRM user
        const user = await getCurrentUser(request);
        if (!user) {
            return NextResponse.json({ success: false, message: "Not authenticated", }, { status: 401 });
        }

        const userId = user._id;
        const companyId = user.companyId;
        if (!userId || !companyId) {
            return NextResponse.json({ success: false, message: "User or company information missing", }, { status: 401 });
        }

        // Generate secure OAuth state
        const state = crypto.randomBytes(32).toString("hex");
        const requestUrl = new URL(request.url);
        const crmOrigin = requestUrl.origin;
        const params = new URLSearchParams({
            client_id: appId,
            redirect_uri: redirectUri,
            config_id: configId,
            response_type: "code",
            state,
        });

        const metaUrl = `https://www.facebook.com/v23.0/dialog/oauth?${params.toString()}`;
        const response = NextResponse.redirect(metaUrl);

        // OAuth state
        response.cookies.set("meta_oauth_state", state, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
            maxAge: 10 * 60,
        });

        // Store company information
        response.cookies.set("meta_oauth_company",
            JSON.stringify({ userId: String(userId), companyId: String(companyId), }),
            {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "lax",
                path: "/",
                maxAge: 10 * 60,
            });

        // Store the CRM domain that started OAuth
        response.cookies.set("meta_oauth_origin",
            crmOrigin,
            {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "lax",
                path: "/",
                maxAge: 10 * 60,
            });

        return response;
    } catch (error) {
        console.error("META CONNECT ERROR:", error);
        return NextResponse.json({ success: false, message: "Unable to start Meta connection", }, { status: 500 });
    }
}