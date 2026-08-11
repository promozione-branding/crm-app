import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import Integration from "@/models/integration.model.js";
import { connectDB } from "@/config/db";

export async function GET(request) {
    try {
        await connectDB();
        const { searchParams } = new URL(request.url);
        const code = searchParams.get("code");
        const state = searchParams.get("state");
        const error = searchParams.get("error");
        const errorDescription = searchParams.get("error_description");

        // Meta returned an error
        if (error) {
            return NextResponse.json({ success: false, error, errorDescription, }, { status: 400 });
        }

        // Authorization code missing
        if (!code) {
            return NextResponse.json({ success: false, message: "Authorization code not received", }, { status: 400 });
        }

        // State missing
        if (!state) {
            return NextResponse.json({ success: false, message: "OAuth state not received", }, { status: 400 });
        }

        const cookieStore = await cookies();
        const savedState = cookieStore.get("meta_oauth_state")?.value;
        const companyCookie = cookieStore.get("meta_oauth_company")?.value;

        if (!savedState || savedState !== state) {
            return NextResponse.json({ success: false, message: "Invalid OAuth state", }, { status: 400 });
        }

        if (!companyCookie) {
            return NextResponse.json({ success: false, message: "Company information not found", }, { status: 401 });
        }

        const { userId, companyId } = JSON.parse(companyCookie);
        if (!userId || !companyId) {
            return NextResponse.json({ success: false, message: "Invalid company information", }, { status: 401 });
        }

        // Meta credentials
        const appId = process.env.META_APP_ID;
        const appSecret = process.env.META_APP_SECRET;
        const redirectUri = process.env.META_REDIRECT_URI;
        if (!appId || !appSecret || !redirectUri) {
            return NextResponse.json({ success: false, message: "Meta environment configuration missing", }, { status: 500 });
        }

        // Exchange authorization code for access token
        const tokenParams = new URLSearchParams({
            client_id: appId,
            client_secret: appSecret,
            redirect_uri: redirectUri,
            code,
        });

        const tokenResponse = await fetch(`https://graph.facebook.com/v23.0/oauth/access_token?${tokenParams.toString()}`,
            { method: "GET", });

        const tokenData = await tokenResponse.json();
        console.log("META TOKEN RESPONSE:", tokenResponse.ok ? { success: true } : tokenData);
        if (!tokenResponse.ok || tokenData.error) {
            return NextResponse.json({ success: false, message: "Failed to get Meta access token", error: tokenData.error || null, },
                { status: 400 });
        }

        const accessToken = tokenData.access_token;
        if (!accessToken) {
            return NextResponse.json({ success: false, message: "Meta access token not received", }, { status: 400 });
        }

        // Save / update Meta integration
        await Integration.findOneAndUpdate(
            { companyId, provider: "meta", },
            {
                companyId,
                provider: "meta",
                status: "connected",
                credentials: { accessToken, },
                connectedAt: new Date(),
                errorMessage: null,
            },
            { upsert: true, new: true, setDefaultsOnInsert: true, }
        );

        // Remove temporary OAuth cookies
        const response = NextResponse.json({ success: true, message: "Meta connected successfully", });
        response.cookies.set("meta_oauth_state", "", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
            maxAge: 0,
        });

        response.cookies.set("meta_oauth_company", "", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
            maxAge: 0,
        });

        return response;
    } catch (error) {
        console.error("META CALLBACK ERROR:", error);
        return NextResponse.json({ success: false, message: "Meta connection failed", }, { status: 500 });
    }
}