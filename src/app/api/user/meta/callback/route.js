import { NextResponse } from "next/server";
import crypto from "crypto";

import Integration from "@/models/integration.model.js";
import Company from "@/models/company.model.js";
import { connectDB } from "@/config/db";

const META_API_VERSION = "v23.0";

function verifyOAuthState(state) {
    const secret = process.env.META_OAUTH_STATE_SECRET;

    if (!secret) {
        throw new Error("META_OAUTH_STATE_SECRET is missing");
    }

    const parts = state.split(".");

    if (parts.length !== 2) {
        throw new Error("Invalid OAuth state format");
    }

    const [data, signature] = parts;

    const expectedSignature = crypto
        .createHmac("sha256", secret)
        .update(data)
        .digest("base64url");

    const signatureBuffer = Buffer.from(signature);
    const expectedBuffer = Buffer.from(expectedSignature);

    if (
        signatureBuffer.length !== expectedBuffer.length ||
        !crypto.timingSafeEqual(
            signatureBuffer,
            expectedBuffer
        )
    ) {
        throw new Error("Invalid OAuth state signature");
    }

    let payload;

    try {
        payload = JSON.parse(
            Buffer
                .from(data, "base64url")
                .toString("utf8")
        );
    } catch {
        throw new Error("Invalid OAuth state payload");
    }

    if (!payload.expiresAt) {
        throw new Error("OAuth state expiration missing");
    }

    if (Date.now() > payload.expiresAt) {
        throw new Error("OAuth state expired");
    }

    if (!payload.userId || !payload.companyId) {
        throw new Error("OAuth state user/company missing");
    }

    return payload;
}

export async function GET(request) {
    try {
        await connectDB();

        const { searchParams } = new URL(request.url);

        const code = searchParams.get("code");
        const state = searchParams.get("state");

        const error = searchParams.get("error");
        const errorDescription =
            searchParams.get("error_description");

        // Meta OAuth error
        if (error) {
            console.error("META OAUTH ERROR:", {
                error,
                errorDescription,
            });

            return NextResponse.json(
                {
                    success: false,
                    error,
                    errorDescription,
                },
                { status: 400 }
            );
        }

        // Code
        if (!code) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Authorization code not received",
                },
                { status: 400 }
            );
        }

        // State
        if (!state) {
            return NextResponse.json(
                {
                    success: false,
                    message: "OAuth state not received",
                },
                { status: 400 }
            );
        }

        // Verify state
        let oauthData;

        try {
            oauthData = verifyOAuthState(state);
        } catch (error) {
            console.error(
                "META OAUTH STATE ERROR:",
                error.message
            );

            return NextResponse.json(
                {
                    success: false,
                    message: "Invalid OAuth state",
                },
                { status: 400 }
            );
        }

        const {
            userId,
            companyId,
        } = oauthData;

        console.log("META OAUTH STATE VERIFIED:", {
            userId,
            companyId,
        });

        // Find company
        const company = await Company
            .findById(companyId)
            .select("crmDomain name")
            .lean();

        if (!company) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Company not found",
                },
                { status: 404 }
            );
        }

        if (!company.crmDomain) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Company CRM domain not configured",
                },
                { status: 400 }
            );
        }

        // Normalize CRM domain
        const crmDomain = company.crmDomain
            .replace(/^https?:\/\//, "")
            .replace(/\/+$/, "");

        // Meta config
        const appId = process.env.META_APP_ID;
        const appSecret = process.env.META_APP_SECRET;
        const redirectUri = process.env.META_REDIRECT_URI;

        if (!appId || !appSecret || !redirectUri) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Meta environment configuration missing",
                },
                { status: 500 }
            );
        }

        // Exchange code
        const tokenParams = new URLSearchParams({
            client_id: appId,
            client_secret: appSecret,
            redirect_uri: redirectUri,
            code,
        });

        const tokenResponse = await fetch(
            `https://graph.facebook.com/${META_API_VERSION}/oauth/access_token?${tokenParams.toString()}`,
            {
                method: "GET",
            }
        );

        const tokenData = await tokenResponse.json();

        console.log(
            "META TOKEN RESPONSE:",
            tokenResponse.ok
                ? { success: true }
                : tokenData
        );

        if (!tokenResponse.ok || tokenData.error) {
            console.error(
                "META TOKEN ERROR:",
                tokenData
            );

            return NextResponse.json(
                {
                    success: false,
                    message: "Failed to get Meta access token",
                    error: tokenData.error || null,
                },
                { status: 400 }
            );
        }

        const accessToken = tokenData.access_token;

        if (!accessToken) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Meta access token not received",
                },
                { status: 400 }
            );
        }

        // Save integration
        await Integration.findOneAndUpdate(
            {
                companyId,
                provider: "meta",
            },
            {
                companyId,
                provider: "meta",
                status: "connected",

                credentials: {
                    accessToken,
                },

                connectedAt: new Date(),
                lastSyncAt: null,
                errorMessage: null,
            },
            {
                upsert: true,
                new: true,
                setDefaultsOnInsert: true,
            }
        );

        console.log(
            "META CONNECTED SUCCESSFULLY",
            {
                userId,
                companyId,
                crmDomain,
            }
        );

        // Redirect to client's CRM
        const redirectUrl =
            `https://${crmDomain}/integration`;

        return NextResponse.redirect(redirectUrl);

    } catch (error) {
        console.error(
            "META CALLBACK ERROR:",
            error
        );

        return NextResponse.json(
            {
                success: false,
                message: "Meta connection failed",
                error:
                    process.env.NODE_ENV === "development"
                        ? error.message
                        : undefined,
            },
            { status: 500 }
        );
    }
}