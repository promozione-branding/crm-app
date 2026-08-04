import { connectDB } from "@/config/db";
import { getAllCompanies } from "@/controllers/admin/companyController";

export async function GET(request) {
    try {
        await connectDB();
        return await getAllCompanies(request);
    } catch (error) {
        console.log(error);
        return Response.json(
            { success: false, message: "Internal server error" },
            { status: 500 }
        );
    }
}