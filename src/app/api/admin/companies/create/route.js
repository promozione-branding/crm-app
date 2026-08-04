import { connectDB } from "@/config/db";
import { createCompanyUser } from "@/controllers/admin/companyController";

export async function POST(request) {
    try {
        await connectDB();
        return await createCompanyUser(request);
    } catch (error) {
        console.log(error);
        return Response.json(
            { success: false, message: "Internal Server Error" },
            { status: 500 }
        );
    }
}