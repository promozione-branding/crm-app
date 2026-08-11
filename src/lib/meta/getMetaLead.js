const META_API_VERSION = "v23.0";

export async function getMetaLead(leadgenId, accessToken) {
    if (!leadgenId) {
        throw new Error("leadgenId is required");
    }

    if (!accessToken) {
        throw new Error("Meta access token is required");
    }

    const url = new URL(`https://graph.facebook.com/${META_API_VERSION}/${leadgenId}`);
    url.searchParams.set("fields", "id,created_time,field_data,form_id,ad_id,adset_id,campaign_id");
    url.searchParams.set("access_token", accessToken);
    const response = await fetch(url.toString());
    const data = await response.json();

    if (!response.ok || data.error) {
        console.error("META LEAD FETCH ERROR:", data);
        throw new Error(data?.error?.message || "Failed to fetch Meta lead");
    }
    return data;
}