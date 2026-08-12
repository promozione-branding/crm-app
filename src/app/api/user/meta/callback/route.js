import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import Integration from "@/models/integration.model.js";
import { connectDB } from "@/config/db";
const META_API_VERSION = "v23.0";

export async function GET(request) {
    try {
        await connectDB();
        const { searchParams } = new URL(request.url);
        const code = searchParams.get("code");
        const state = searchParams.get("state");
        const error = searchParams.get("error");
        const errorDescription = searchParams.get("error_description");
        if (error) {
            return NextResponse.json({ success: false, error, errorDescription, }, { status: 400 });
        }

        // Validate code
        if (!code) {
            return NextResponse.json({ success: false, message: "Authorization code not received", }, { status: 400 });
        }

        // Validate state
        if (!state) {
            return NextResponse.json({ success: false, message: "OAuth state not received", }, { status: 400 });
        }

        const cookieStore = await cookies();
        const savedState = cookieStore.get("meta_oauth_state")?.value;
        const companyCookie = cookieStore.get("meta_oauth_company")?.value;
        const crmOrigin = cookieStore.get("meta_oauth_origin")?.value;

        // Check OAuth state
        if (!savedState || savedState !== state) {
            return NextResponse.json({ success: false, message: "Invalid OAuth state", }, { status: 400 });
        }

        // Company information
        if (!companyCookie) {
            return NextResponse.json({ success: false, message: "Company information not found", }, { status: 401 });
        }

        let companyData;

        try {
            companyData = JSON.parse(companyCookie);
        } catch {
            return NextResponse.json({ success: false, message: "Invalid company information", }, { status: 400 });
        }

        const { userId, companyId } = companyData;
        if (!userId || !companyId) {
            return NextResponse.json({ success: false, message: "Invalid company information", }, { status: 401 });
        }

        // Meta configuration
        const appId = process.env.META_APP_ID;
        const appSecret = process.env.META_APP_SECRET;
        const redirectUri = process.env.META_REDIRECT_URI;
        if (!appId || !appSecret || !redirectUri) {
            return NextResponse.json({ success: false, message: "Meta environment configuration missing", }, { status: 500 });
        }

        const tokenParams = new URLSearchParams({
            client_id: appId,
            client_secret: appSecret,
            redirect_uri: redirectUri,
            code,
        });

        const tokenResponse = await fetch(`https://graph.facebook.com/${META_API_VERSION}/oauth/access_token?${tokenParams.toString()}`,
            { method: "GET", }
        );

        const tokenData = await tokenResponse.json();
        console.log("META TOKEN RESPONSE:", tokenResponse.ok ? { success: true } : tokenData);
        if (!tokenResponse.ok || tokenData.error) {
            return NextResponse.json(
                { success: false, message: "Failed to get Meta access token", error: tokenData.error || null, },
                { status: 400 }
            );
        }

        const accessToken = tokenData.access_token;
        if (!accessToken) {
            return NextResponse.json({ success: false, message: "Meta access token not received", }, { status: 400 });
        }

        // Save / update Integration
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
            {
                upsert: true,
                new: true,
                setDefaultsOnInsert: true,
            }
        );

        // Clear OAuth cookies
        const redirectBase = crmOrigin || process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
        const redirectUrl = `${redirectBase}/integration`;
        const response = NextResponse.redirect(redirectUrl);

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

        response.cookies.set("meta_oauth_origin", "", {
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