import { NextResponse } from "next/server";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import { getCurrentUser } from "@/utils/auth";
import { ENV } from "@/config/env";

export async function GET(request) {
    try {
        // 1. Get logged-in CRM user
        const user = await getCurrentUser(request);
        if (!user) {
            return NextResponse.json(
                { success: false, message: "User Not Found", },
                { status: 400 }
            );
        }

        if (!user.companyId) {
            return NextResponse.json(
                { success: false, message: "CompanyId Not Found", },
                { status: 400 }
            );
        }

        // 2. Google OAuth configuration
        const clientId = process.env.GOOGLE_CLIENT_ID;
        const redirectUri = process.env.GOOGLE_ADS_REDIRECT_URI;
        if (!clientId || !redirectUri) {
            return NextResponse.json(
                { success: false, message: "Google OAuth environment variables are missing", },
                { status: 500 }
            );
        }

        // 3. Create secure OAuth state
        const nonce = crypto.randomBytes(32).toString("hex");
        const state = jwt.sign({
            userId: user._id.toString(),
            companyId: user.companyId.toString(),
            nonce,
        }, ENV.JWT_CLIENT_SECRET, { expiresIn: "10m", });

        // 4. Google OAuth parameters
        const params = new URLSearchParams({
            client_id: clientId,
            redirect_uri: redirectUri,
            response_type: "code",
            scope: "https://www.googleapis.com/auth/adwords",
            access_type: "offline",
            prompt: "consent",
            state,
        });

        const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;

        // 5. Redirect to Google
        const response = NextResponse.redirect(googleAuthUrl);

        // Store state in HTTP-only cookie too.
        // This gives us CSRF protection.
        response.cookies.set("google_oauth_state", state, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
            maxAge: 10 * 60,
        });

        return response;
    } catch (error) {
        console.error("Google OAuth Connect Error:", error);

        return NextResponse.json(
            { success: false, message: "Failed to start Google OAuth", },
            { status: 500 }
        );
    }
}