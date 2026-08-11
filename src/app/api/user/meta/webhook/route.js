import { NextResponse } from "next/server";
import { connectDB } from "@/config/db";
import Integration from "@/models/integration.model.js";
import LeadTask from "@/models/task.model.js";
import { getMetaLead } from "@/lib/meta/getMetaLead";

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const mode = searchParams.get("hub.mode");
        const token = searchParams.get("hub.verify_token");
        const challenge = searchParams.get("hub.challenge");
        const VERIFY_TOKEN = process.env.META_WEBHOOK_VERIFY_TOKEN;

        if (mode === "subscribe" && token === VERIFY_TOKEN) {
            console.log("META WEBHOOK VERIFIED");

            return new Response(challenge, { status: 200, headers: { "Content-Type": "text/plain", }, });
        }

        return NextResponse.json({ success: false, message: "Webhook verification failed", }, { status: 403 });
    } catch (error) {
        console.error("META WEBHOOK GET ERROR:", error);
        return NextResponse.json({ success: false, message: "Webhook verification error", }, { status: 500 });
    }
}

export async function POST(request) {
    try {
        await connectDB();
        const body = await request.json();
        console.log("META WEBHOOK EVENT:", JSON.stringify(body, null, 2));
        if (body.object !== "page") {
            return NextResponse.json({ success: true, message: "Event ignored", });
        }

        for (const entry of body.entry || []) {
            for (const change of entry.changes || []) {
                if (change.field !== "leadgen") {
                    continue;
                }

                const value = change.value;
                const metaLeadId = value?.leadgen_id;
                const pageId = value?.page_id;
                const formId = value?.form_id;
                const adId = value?.ad_id;
                const adsetId = value?.adgroup_id;
                const campaignId = value?.campaign_id;
                console.log("NEW META LEAD EVENT:", { metaLeadId, pageId, formId, adId, adsetId, campaignId, });
                if (!metaLeadId || !pageId) {
                    console.error("Missing leadgen_id or page_id");
                    continue;
                }

                // 1. Find integration by Page ID
                const integration = await Integration.findOne({ provider: "meta", status: "connected", "metadata.pageId": String(pageId), });
                if (!integration) {
                    console.error("Meta integration not found for Page:", pageId);
                    continue;
                }

                // 2. Get Page Access Token
                const pageAccessToken = integration.metadata?.pageAccessToken;
                if (!pageAccessToken) {
                    console.error("Page access token missing:", pageId);
                    continue;
                }

                // 3. Prevent duplicate leads
                const existingLead = await LeadTask.findOne({ metaLeadId: String(metaLeadId), });
                if (existingLead) {
                    console.log("Meta lead already exists:", metaLeadId);
                    continue;
                }

                // 4. Get actual lead information
                const metaLead = await getMetaLead(metaLeadId, pageAccessToken);
                console.log("META ACTUAL LEAD:", JSON.stringify(metaLead, null, 2));

                // 5. Convert field_data
                const fields = {};
                for (const field of metaLead.field_data || []) {
                    const name = field.name;
                    const value = field.values?.[0] ?? "";
                    fields[name] = value;
                }
                console.log("META LEAD FIELDS:", fields);

                // 6. Create CRM LeadTask
                const lead = await LeadTask.create({
                    companyId: integration.companyId,
                    source: "facebook",
                    metaLeadId: String(metaLeadId),
                    name: fields.full_name || fields.name || "",
                    phone: fields.phone_number || fields.phone || "",
                    email: fields.email || "",
                    companyName: fields.company_name || "",
                    place: fields.city || fields.location || "",
                    product: fields.product || "",
                    message: fields.message || fields.comments || "",
                    campaignId: campaignId || metaLead.campaign_id || undefined,
                    stage: "new",
                    status: "open",
                    activities: [
                        {
                            type: "lead_created",
                            description: "LeadTask received from Facebook LeadTask Ads",
                        },
                    ],
                });

                console.log("CRM LEAD CREATED:", lead._id);
            }
        }

        return NextResponse.json({ success: true, });
    } catch (error) {
        console.error("META WEBHOOK POST ERROR:", error);
        return NextResponse.json({ success: true, }, { status: 200 });
    }
}