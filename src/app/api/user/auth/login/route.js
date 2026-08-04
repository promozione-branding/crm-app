import { connectDB } from "@/config/db";
import { loginUser } from "@/controllers/user/userAuthController";

export async function POST(request) {
    try {
        await connectDB();
        return await loginUser(request);
    } catch (error) {
        console.error(error);
        return Response.json(
            { success: false, message: "Internal Server Error", },
            { status: 500, }
        );
    }
}