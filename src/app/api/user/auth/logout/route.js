import { ENV } from "@/config/env";
import { NextResponse } from "next/server";

export async function POST() {
    try {
        const response = NextResponse.json({ success: true, message: "Logout successfully" });

        response.cookies.delete(ENV.CLIENT_COOKIE_NAME);
        return response;
    } catch (error) {
        return NextResponse.json(
            { success: false, message: error.message }, { status: 500 }
        );
    }
}