// src/app/api/leads/ingest/route.js

import { NextResponse } from "next/server";
import { connectDB } from "@/config/db";

import Company from "@/models/company.model";
import Lead from "@/models/leads.model";

export const runtime = "nodejs";

export async function POST(request) {
    try {
        await connectDB();

        const body = await request.json().catch(() => ({}));

        const {
            userId, // = our companyId
            name,
            phone,
            email,
            product,
            place,
            message,
            platform,
            source,
        } = body;

        // -------- VALIDATION --------
        if (!userId) {
            return NextResponse.json(
                { success: false, message: "userId is required" },
                { status: 400 }
            );
        }

        if (!name || !phone) {
            return NextResponse.json(
                { success: false, message: "name and phone are required" },
                { status: 400 }
            );
        }

        // -------- RESOLVE COMPANY --------
        const company = await Company.findById(userId).select("_id").lean();
        if (!company) {
            return NextResponse.json(
                { success: false, message: "Invalid userId" },
                { status: 404 }
            );
        }

        // -------- NORMALISE SOURCE --------
        const ALLOWED_SOURCES = [
            "facebook",
            "google",
            "website",
            "whatsapp",
            "manual",
            "indiamart",
            "tradeindia",
            "other",
        ];
        const finalSource = ALLOWED_SOURCES.includes(source)
            ? source
            : "website";

        // -------- CREATE LEAD --------
        const lead = await Lead.create({
            companyId: company._id,
            source: finalSource,

            name: String(name).trim(),
            phone: String(phone).trim(),
            email: email ? String(email).toLowerCase().trim() : undefined,

            companyName: platform || undefined,
            place: place || undefined,
            product: product || undefined,
            message: message || undefined,

            stage: "new",
            status: "open",

            activities: [
                {
                    type: "lead_created",
                    description: `Lead received from ${platform || finalSource}`,
                },
            ],
        });

        return NextResponse.json({
            success: true,
            message: "Lead created",
            leadId: lead._id,
        });
    } catch (error) {
        console.error("Lead ingest error:", error);
        return NextResponse.json(
            {
                success: false,
                message: error?.message || "Failed to ingest lead",
            },
            { status: 500 }
        );
    }
}