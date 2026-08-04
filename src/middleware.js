import { NextResponse } from "next/server";
import { ENV } from "./config/env";

export function middleware(request) {
    const { pathname } = request.nextUrl;
    const host = request.headers.get("host") || "";

    const adminToken =
        request.cookies.get(ENV.ADMIN_COOKIE_NAME)?.value;

    const clientToken =
        request.cookies.get(ENV.CLIENT_COOKIE_NAME)?.value;

    // ==========================
    // ADMIN PANEL
    // localhost OR crm.inquirybazaar.com
    // ==========================

    const isAdminHost =
        host.includes("localhost") ||
        host.includes("crm.inquirybazaar.com");

    if (isAdminHost) {

        // Admin Login
        if (pathname === "/admin/login") {
            if (adminToken) {
                return NextResponse.redirect(
                    new URL("/admin/dashboard", request.url)
                );
            }

            return NextResponse.next();
        }

        // Protected Admin Routes
        if (pathname.startsWith("/admin")) {

            if (!adminToken) {
                return NextResponse.redirect(
                    new URL("/admin/login", request.url)
                );
            }

            return NextResponse.next();
        }

        // Home page
        if (
            pathname === "/" ||
            pathname === "/contact" ||
            pathname === "/about"
        ) {
            return NextResponse.next();
        }

        return NextResponse.next();
    }

    // ==========================
    // CLIENT CRM
    // crm.company.com
    // ==========================

    const isClientDomain = host.startsWith("crm.");

    if (isClientDomain) {

        // Login page
        if (pathname === "/login") {

            if (clientToken) {
                return NextResponse.redirect(
                    new URL("/dashboard", request.url)
                );
            }

            return NextResponse.next();
        }

        // Protected Routes

        const protectedRoutes = [
            "/dashboard",
            "/leads",
            "/clients",
            "/calls",
            "/tasks",
            "/reports",
            "/employees",
            "/settings",
        ];

        const isProtected = protectedRoutes.some(route =>
            pathname.startsWith(route)
        );

        if (isProtected && !clientToken) {
            return NextResponse.redirect(
                new URL("/login", request.url)
            );
        }

        // Unknown route
        if (!isProtected && pathname !== "/") {
            return NextResponse.redirect(
                new URL("/contact", request.url)
            );
        }

        return NextResponse.next();
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/((?!api|_next|.*\\..*).*)"],
};