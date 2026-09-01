import crypto from "crypto";

export function generateWebhookApiKey() {
    const randomPart = crypto.randomBytes(32).toString("hex");

    return `sk_live_${randomPart}`;
}

export function hashWebhookApiKey(apiKey) {
    return crypto
        .createHash("sha256")
        .update(apiKey)
        .digest("hex");
}

export function getWebhookApiPrefix(apiKey) {
    return apiKey.substring(0, 15);
}