import jwt from "jsonwebtoken";
import { ENV } from "@/config/env";
import User from "@/models/user.model.js";

export async function getCurrentUser(request) {
    const token = request.cookies.get(ENV.CLIENT_COOKIE_NAME)?.value;

    if (!token) {
        throw new Error("Not authenticated");
    }

    let decoded;

    try {
        decoded = jwt.verify(token, ENV.JWT_CLIENT_SECRET);
    } catch (error) {
        throw new Error("Invalid or expired session");
    }

    if (!decoded?.id) {
        throw new Error("Invalid token");
    }

    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
        throw new Error("User not found");
    }

    if (user.status !== "active") {
        throw new Error("User account is inactive");
    }

    return user;
}