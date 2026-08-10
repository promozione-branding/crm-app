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

        const user = await getCurrentUser(request);
        const userId = user._id;
        const companyId = user.companyId;

        if (!userId || !companyId) {
            return NextResponse.json({ success: false, message: "User or company information missing from token", }, { status: 401 });
        }

        // Generate OAuth state
        const state = crypto.randomBytes(32).toString("hex");

        // Save temporary state in secure HTTP-only cookie
        const response = NextResponse.redirect(`https://www.facebook.com/v23.0/dialog/oauth?${new URLSearchParams({
            client_id: appId,
            redirect_uri: redirectUri,
            config_id: configId,
            response_type: "code",
            state,
        }).toString()}`);

        response.cookies.set("meta_oauth_state", state, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
            maxAge: 10 * 60,
        });

        response.cookies.set("meta_oauth_company", JSON.stringify({ userId, companyId, }), {
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