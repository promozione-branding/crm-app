import { NextResponse } from "next/server";
import { connectDB } from "@/config/db";
import Integration from "@/models/integration.model.js";
import { getCurrentUser } from "@/utils/auth";

const META_API_VERSION = "v23.0";

export async function GET(request) {
    try {
        await connectDB();
        const user = await getCurrentUser(request);
        const companyId = user.companyId;

        if (!companyId) {
            return NextResponse.json({ success: false, message: "Company not found", }, { status: 400 });
        }

        // 2. Get Meta integration
        const integration = await Integration.findOne({ companyId, provider: "meta", status: "connected", }).lean();
        if (!integration?.credentials?.accessToken) {
            return NextResponse.json({ success: false, message: "Meta account is not connected", }, { status: 400 });
        }

        // 3. Get Facebook Pages
        const accessToken = integration.credentials.accessToken;
        const pagesUrl = new URL(`https://graph.facebook.com/${META_API_VERSION}/me/accounts`);

        pagesUrl.searchParams.set("fields", "id,name,access_token,category,tasks");
        pagesUrl.searchParams.set("access_token", accessToken);
        const pagesResponse = await fetch(pagesUrl.toString());
        const pagesData = await pagesResponse.json();
        if (!pagesResponse.ok || pagesData.error) {
            console.error("META PAGES ERROR:", pagesData);

            return NextResponse.json({ success: false, message: "Failed to fetch Facebook Pages", error: pagesData.error || null, },
                { status: 400 });
        }

        // 4. Get Ad Accounts
        const adAccountsUrl = new URL(`https://graph.facebook.com/${META_API_VERSION}/me/adaccounts`);
        adAccountsUrl.searchParams.set("fields", "id,name,account_status,currency,timezone_name");
        adAccountsUrl.searchParams.set("access_token", accessToken);
        const adAccountsResponse = await fetch(adAccountsUrl.toString());
        const adAccountsData = await adAccountsResponse.json();
        if (!adAccountsResponse.ok || adAccountsData.error) {
            console.error("META AD ACCOUNT ERROR:", adAccountsData);

            return NextResponse.json({ success: false, message: "Failed to fetch Meta Ad Accounts", error: adAccountsData.error || null, },
                { status: 400 });
        }

        return NextResponse.json({
            success: true,
            assets: { pages: pagesData.data || [], adAccounts: adAccountsData.data || [], },
        });
    } catch (error) {
        console.error("META ASSETS ERROR:", error);
        return NextResponse.json({ success: false, message: "Failed to fetch Meta assets", }, { status: 500 });
    }
}