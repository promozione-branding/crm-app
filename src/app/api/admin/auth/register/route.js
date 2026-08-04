import { connectDB } from "@/config/db";
import { registerAdmin } from "@/controllers/admin/adminAuthController";

export async function POST(request) {
    try {
        await connectDB();
        return await registerAdmin(request);
    } catch (error) {
        console.error(error);

        return Response.json(
            { success: false, message: "Internal Server Error", },
            { status: 500, }
        );
    }
}