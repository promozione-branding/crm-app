import { NextResponse } from "next/server";
import { ENV } from "./config/env";

export function middleware(request) {
    const { pathname } = request.nextUrl;

    const host = request.headers.get("host") || "";
    const hostname = host.split(":")[0];

    const adminToken =
        request.cookies.get(ENV.ADMIN_COOKIE_NAME)?.value;

    const clientToken =
        request.cookies.get(ENV.CLIENT_COOKIE_NAME)?.value;

    const clientRoutes = [
        "/dashboard",
        "/leads",
        "/clients",
        "/profile",
        "/call-logs",
        "/tasks",
        "/reports",
        "/organization-settings",
        "team-management",
        "integration",
        "/settings",
    ];

    const isClientRoute = clientRoutes.some((route) =>
        pathname.startsWith(route)
    );

    const isLocalhost = hostname === "localhost";

    // ADMIN DOMAIN
    const isAdminDomain = hostname === "crm.inquirybazaar.com";

    // CLIENT DOMAIN
    const isClientDomain =
        hostname.startsWith("crm.") &&
        hostname !== "crm.inquirybazaar.com";

    // ======================================================
    // LOCALHOST
    // ======================================================

    if (isLocalhost) {

        // ---------- ADMIN ----------

        if (pathname === "/admin/login") {
            if (adminToken) {
                return NextResponse.redirect(
                    new URL("/admin/dashboard", request.url)
                );
            }

            return NextResponse.next();
        }

        if (pathname.startsWith("/admin")) {

            if (!adminToken) {
                return NextResponse.redirect(
                    new URL("/admin/login", request.url)
                );
            }

            return NextResponse.next();
        }

        // ---------- CLIENT ----------

        if (pathname === "/login") {

            if (clientToken) {
                return NextResponse.redirect(
                    new URL("/dashboard", request.url)
                );
            }

            return NextResponse.next();
        }

        if (isClientRoute) {

            if (!clientToken) {
                return NextResponse.redirect(
                    new URL("/login", request.url)
                );
            }

            return NextResponse.next();
        }

        // localhost home allowed
        return NextResponse.next();
    }

    // ======================================================
    // ADMIN DOMAIN
    // https://crm.inquirybazaar.com
    // ======================================================

    if (isAdminDomain) {

        // Admin Login

        if (pathname === "/admin/login") {

            if (adminToken) {
                return NextResponse.redirect(
                    new URL("/admin/dashboard", request.url)
                );
            }

            return NextResponse.next();
        }

        // Admin Pages

        if (pathname.startsWith("/admin")) {

            if (!adminToken) {
                return NextResponse.redirect(
                    new URL("/admin/login", request.url)
                );
            }

            return NextResponse.next();
        }

        // Client Login

        if (pathname === "/login") {

            if (clientToken) {
                return NextResponse.redirect(
                    new URL("/dashboard", request.url)
                );
            }

            return NextResponse.next();
        }

        // Client Pages

        if (isClientRoute) {

            if (!clientToken) {
                return NextResponse.redirect(
                    new URL("/login", request.url)
                );
            }

            return NextResponse.next();
        }

        // Home page allowed
        return NextResponse.next();
    }

    // ======================================================
    // CLIENT DOMAIN
    // https://crm.company.com
    // ======================================================

    if (isClientDomain) {

        // Never allow admin

        if (pathname.startsWith("/admin")) {
            return NextResponse.redirect(
                new URL("/login", request.url)
            );
        }

        // Root

        if (pathname === "/") {
            return NextResponse.redirect(
                new URL(
                    clientToken
                        ? "/dashboard"
                        : "/login",
                    request.url
                )
            );
        }

        // Login

        if (pathname === "/login") {

            if (clientToken) {
                return NextResponse.redirect(
                    new URL("/dashboard", request.url)
                );
            }

            return NextResponse.next();
        }

        // Protected Pages

        if (isClientRoute) {

            if (!clientToken) {
                return NextResponse.redirect(
                    new URL("/login", request.url)
                );
            }

            return NextResponse.next();
        }

        // Unknown URL

        return NextResponse.redirect(
            new URL(
                clientToken
                    ? "/dashboard"
                    : "/login",
                request.url
            )
        );
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/((?!api|_next|favicon.ico|.*\\..*).*)"],
};