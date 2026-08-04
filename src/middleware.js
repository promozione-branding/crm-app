import { NextResponse } from "next/server";
import { ENV } from "./config/env";

export function middleware(request) {
    const { pathname } = request.nextUrl;
    const host = request.headers.get("host") || "";
    const hostname = host.split(":")[0];

    const adminToken = request.cookies.get(ENV.ADMIN_COOKIE_NAME)?.value;
    const clientToken = request.cookies.get(ENV.CLIENT_COOKIE_NAME)?.value;

    const clientRoutes = [
        "/dashboard",
        "/leads",
        "/clients",
        "/employees",
        "/calls",
        "/tasks",
        "/reports",
        "/settings",
    ];

    const isClientRoute = clientRoutes.some(route =>
        pathname.startsWith(route)
    );

    const isLocalhost = hostname === "localhost";
    const isMainCRM = hostname === "crm.inquirybazaar.com";
    const isClientCRM =
        hostname.startsWith("crm.") &&
        hostname !== "crm.inquirybazaar.com";

    // ==================================================
    // LOCALHOST (Development)
    // ==================================================

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

        // Home page allowed
        if (pathname === "/") {
            return NextResponse.next();
        }

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

        return NextResponse.next();
    }

    // ==================================================
    // MAIN CRM
    // crm.inquirybazaar.com
    // ==================================================

    if (isMainCRM) {

        // Never allow admin pages
        if (pathname.startsWith("/admin")) {
            return NextResponse.redirect(
                new URL("/login", request.url)
            );
        }

        // Home page allowed
        if (pathname === "/") {
            return NextResponse.next();
        }

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

        return NextResponse.next();
    }

    // ==================================================
    // CLIENT CRM
    // crm.company.com
    // ==================================================

    if (isClientCRM) {

        // Never allow admin pages
        if (pathname.startsWith("/admin")) {
            return NextResponse.redirect(
                new URL("/login", request.url)
            );
        }

        // Home page NOT allowed
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