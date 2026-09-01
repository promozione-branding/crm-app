import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

import { connectDB } from "@/config/db";
import Integration from "@/models/integration.model.js";
import { ENV } from "@/config/env";

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);

        const code = searchParams.get("code");
        const state = searchParams.get("state");
        const error = searchParams.get("error");

        // -----------------------------------------
        // 1. Google rejected authorization
        // -----------------------------------------
        if (error) {
            console.error("Google OAuth Error:", error);

            return NextResponse.redirect(
                new URL(
                    "/integration?google=error",
                    request.url
                )
            );
        }

        // -----------------------------------------
        // 2. Validate code + state
        // -----------------------------------------
        if (!code || !state) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Missing Google OAuth code or state",
                },
                { status: 400 }
            );
        }

        // -----------------------------------------
        // 3. Validate state cookie
        // -----------------------------------------
        const savedState =
            request.cookies.get("google_oauth_state")?.value;

        if (!savedState || savedState !== state) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Invalid OAuth state",
                },
                { status: 400 }
            );
        }

        // -----------------------------------------
        // 4. Verify signed OAuth state
        // -----------------------------------------
        let decodedState;

        try {
            decodedState = jwt.verify(
                state,
                ENV.JWT_CLIENT_SECRET
            );
        } catch (error) {
            console.error(
                "Google OAuth state verification failed:",
                error.message
            );

            return NextResponse.json(
                {
                    success: false,
                    message: "Invalid or expired OAuth state",
                },
                { status: 400 }
            );
        }

        const { userId, companyId } = decodedState;

        if (!userId || !companyId) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Invalid OAuth state data",
                },
                { status: 400 }
            );
        }

        // -----------------------------------------
        // 5. Google OAuth configuration
        // -----------------------------------------
        const clientId =
            process.env.GOOGLE_CLIENT_ID;

        const clientSecret =
            process.env.GOOGLE_CLIENT_SECRET;

        const redirectUri =
            process.env.GOOGLE_ADS_REDIRECT_URI;

        if (
            !clientId ||
            !clientSecret ||
            !redirectUri
        ) {
            return NextResponse.json(
                {
                    success: false,
                    message:
                        "Google OAuth environment variables are missing",
                },
                { status: 500 }
            );
        }

        // -----------------------------------------
        // 6. Exchange code for Google tokens
        // -----------------------------------------
        const tokenResponse = await fetch(
            "https://oauth2.googleapis.com/token",
            {
                method: "POST",
                headers: {
                    "Content-Type":
                        "application/x-www-form-urlencoded",
                },
                body: new URLSearchParams({
                    code,
                    client_id: clientId,
                    client_secret: clientSecret,
                    redirect_uri: redirectUri,
                    grant_type: "authorization_code",
                }),
            }
        );

        const tokenData =
            await tokenResponse.json();

        if (!tokenResponse.ok) {
            console.error(
                "Google Token Error:",
                tokenData
            );

            return NextResponse.json(
                {
                    success: false,
                    message:
                        "Failed to exchange Google authorization code",
                },
                { status: 400 }
            );
        }

        const {
            access_token,
            refresh_token,
            expires_in,
            scope,
            token_type,
        } = tokenData;

        if (!access_token) {
            return NextResponse.json(
                {
                    success: false,
                    message:
                        "Google did not return an access token",
                },
                { status: 400 }
            );
        }

        // -----------------------------------------
        // 7. Connect MongoDB
        // -----------------------------------------
        await connectDB();

        // -----------------------------------------
        // 8. Existing integration
        // -----------------------------------------
        const existingIntegration =
            await Integration.findOne({
                companyId,
                provider: "google_ads",
            });

        // Google may not return a refresh token
        // when reconnecting.
        const finalRefreshToken =
            refresh_token ||
            existingIntegration?.credentials
                ?.refreshToken ||
            null;

        // -----------------------------------------
        // 9. Token expiry
        // -----------------------------------------
        const expiresAt = expires_in
            ? new Date(
                  Date.now() +
                      expires_in * 1000
              )
            : null;

        // -----------------------------------------
        // 10. Save Google Ads integration
        // -----------------------------------------
        await Integration.findOneAndUpdate(
            {
                companyId,
                provider: "google_ads",
            },
            {
                $set: {
                    status: "connected",

                    credentials: {
                        accessToken: access_token,
                        refreshToken:
                            finalRefreshToken,
                        expiresAt,
                    },

                    metadata: {
                        scope:
                            scope || null,
                        tokenType:
                            token_type || null,

                        googleUserId:
                            userId,
                    },

                    connectedAt:
                        existingIntegration?.connectedAt ||
                        new Date(),

                    errorMessage: null,
                },
            },
            {
                new: true,
                upsert: true,
                setDefaultsOnInsert: true,
            }
        );

        console.log(
            "Google Ads connected successfully",
            {
                companyId,
                userId,
            }
        );

        // -----------------------------------------
        // 11. Delete OAuth state cookie
        // -----------------------------------------
        const response =
            NextResponse.redirect(
                new URL(
                    "/integration?google=connected",
                    request.url
                )
            );

        response.cookies.delete(
            "google_oauth_state"
        );

        return response;

    } catch (error) {
        console.error(
            "Google Callback Error:",
            error
        );

        return NextResponse.redirect(
            new URL(
                "/integration?google=error",
                request.url
            )
        );
    }
}