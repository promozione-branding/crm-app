import { NextResponse } from "next/server";
import crypto from "crypto";
import { getCurrentUser } from "@/utils/auth";

function createOAuthState({ userId, companyId }) {
    const secret = process.env.META_OAUTH_STATE_SECRET;
    if (!secret) {
        throw new Error("META_OAUTH_STATE_SECRET is missing");
    }

    const payload = {
        userId: String(userId),
        companyId: String(companyId),
        expiresAt: Date.now() + 10 * 60 * 1000,
    };

    const data = Buffer.from(JSON.stringify(payload)).toString("base64url");
    const signature = crypto.createHmac("sha256", secret).update(data).digest("base64url");
    return `${data}.${signature}`;
}

export async function GET(request) {
    try {
        const appId = process.env.META_APP_ID;
        const configId = process.env.META_CONFIG_ID;
        const redirectUri = process.env.META_REDIRECT_URI;

        if (!appId || !configId || !redirectUri) {
            console.error("META CONFIG MISSING", {
                appId: !!appId,
                configId: !!configId,
                redirectUri: !!redirectUri,
            });

            return NextResponse.json({ success: false, message: "Meta configuration is missing", }, { status: 500 });
        }

        // Logged-in CRM user
        const user = await getCurrentUser(request);
        if (!user) {
            return NextResponse.json({ success: false, message: "Not authenticated", }, { status: 401 });
        }

        const userId = user._id;
        const companyId = user.companyId;
        if (!userId || !companyId) {
            return NextResponse.json({ success: false, message: "User or company information missing", }, { status: 401 });
        }

        // Create signed state
        const state = createOAuthState({ userId, companyId, });
        const params = new URLSearchParams({
            client_id: appId,
            redirect_uri: redirectUri,
            config_id: configId,
            response_type: "code",
            state,
        });

        const metaUrl = `https://www.facebook.com/v23.0/dialog/oauth?${params.toString()}`;

        console.log("META CONNECT STARTED", {
            userId: String(userId),
            companyId: String(companyId),
            redirectUri,
        });

        return NextResponse.redirect(metaUrl);
    } catch (error) {
        console.error("META CONNECT ERROR:", error);

        return NextResponse.json(
            {
                success: false,
                message: "Unable to start Meta connection",
                error: process.env.NODE_ENV === "development" ? error.message : undefined,
            },
            { status: 500 }
        );
    }
}