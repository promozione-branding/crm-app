import { NextResponse } from "next/server";
import { connectDB } from "@/config/db";
import Company from "@/models/company.model.js";
import Lead from "@/models/leads.model.js";
import { hashWebhookApiKey } from "@/lib/webhook/webhookApi.js";

export async function POST(req) {
    try {
        await connectDB();
        // 1. Read Authorization Header
        const authorization = req.headers.get("authorization");
        if (!authorization) {
            return NextResponse.json({ success: false, message: "Authorization header is required", }, { status: 401 });
        }

        if (!authorization.startsWith("Bearer ")) {
            return NextResponse.json({ success: false, message: "Invalid authorization format", }, { status: 401 });
        }

        const apiKey = authorization.replace("Bearer ", "").trim();
        if (!apiKey) {
            return NextResponse.json({ success: false, message: "API key is required", }, { status: 401 });
        }

        // 2. Hash API Key
        const apiKeyHash = hashWebhookApiKey(apiKey);

        // 3. Find Company
        const company = await Company.findOne({
            webhookApiKeyHash: apiKeyHash,
            webhookApiStatus: "active",
            status: "active",
        });

        if (!company) {
            return NextResponse.json({ success: false, message: "Invalid or inactive API key", }, { status: 401 });
        }

        // 4. Parse Body
        const body = await req.json();
        const { name, email, phone, } = body;

        // 5. Validate Lead
        if (!name && !email && !phone) {
            return NextResponse.json(
                { success: false, message: "At least one of name, email or phone is required", },
                { status: 400 }
            );
        }

        // 6. Duplicate Check
        // let existingLead = null;
        // if (email || phone) {
        //     const conditions = [];
        //     if (email) {
        //         conditions.push({ email: email.toLowerCase().trim(), companyId: company._id, });
        //     }

        //     if (phone) {
        //         conditions.push({ phone: phone.trim(), companyId: company._id, });
        //     }

        //     existingLead = await Lead.findOne({ $or: conditions, });
        // }

        // 7. Create Lead
        // if (existingLead) {
        //     await Company.findByIdAndUpdate(company._id, { webhookLastUsedAt: new Date(), });

        //     return NextResponse.json(
        //         {
        //             success: true,
        //             duplicate: true,
        //             message: "Lead already exists",
        //             leadId: existingLead._id,
        //         },
        //         { status: 200 }
        //     );
        // }

        const lead = await Lead.create({
            companyId: company._id,
            source: "website",
            name: body.name,
            phone: body.phone,
            email: body.email,
            companyName: body.companyName,
            place: body.place,
            product: body.product,
            message: body.message,
            priceRange: body.priceRange,
            stage: "new",
            status: "open",
            activities: [
                { type: "lead_created", description: "Lead created from website webhook.", },
            ],
            stageHistory: [
                { stage: "new", description: "Lead created from website webhook.", },
            ],
        });

        // 8. Update Webhook Statistics
        await Company.findByIdAndUpdate(company._id, { webhookLastUsedAt: new Date(), });

        // 9. Response
        return NextResponse.json({
            success: true,
            message: "Lead received successfully",
            leadId: lead._id,
        }, { status: 201 });

    } catch (error) {
        console.error("Lead webhook error:", error);
        return NextResponse.json(
            { success: false, message: "Failed to process webhook", },
            { status: 500 }
        );
    }
}