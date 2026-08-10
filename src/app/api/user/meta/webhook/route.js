import { NextResponse } from "next/server";
const VERIFY_TOKEN = process.env.META_WEBHOOK_VERIFY_TOKEN;

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const mode = searchParams.get("hub.mode");
        const token = searchParams.get("hub.verify_token");
        const challenge = searchParams.get("hub.challenge");

        if (mode === "subscribe" && token === VERIFY_TOKEN) {
            console.log("META WEBHOOK VERIFIED");
            return new Response(challenge, { status: 200, headers: { "Content-Type": "text/plain", }, });
        }

        return NextResponse.json({ success: false, message: "Webhook verification failed", }, { status: 403, });
    } catch (error) {
        console.error("META WEBHOOK GET ERROR:", error);
        return NextResponse.json({ success: false, message: "Webhook verification error", }, { status: 500, });
    }
}

export async function POST(request) {
    try {
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
                console.log("NEW META LEAD:", value);
                const metaLeadId = value?.leadgen_id;
                const pageId = value?.page_id;
                const formId = value?.form_id;
                const adId = value?.ad_id;
                const adGroupId = value?.adgroup_id;
                const campaignId = value?.campaign_id;

                /*
                 * NEXT STEP:
                 *
                 * 1. Find Integration using pageId
                 * 2. Get accessToken
                 * 3. Call Meta Graph API
                 * 4. Get actual lead field_data
                 * 5. Convert it to your Lead model
                 */

                console.log({ metaLeadId, pageId, formId, adId, adGroupId, campaignId, });
            }
        }

        // Meta expects a successful response
        return NextResponse.json({ success: true, });
    } catch (error) {
        console.error("META WEBHOOK POST ERROR:", error);
        return NextResponse.json({ success: false, message: "Webhook received with processing error", }, { status: 200, });
    }
}