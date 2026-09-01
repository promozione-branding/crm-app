import { NextResponse } from "next/server";
import * as XLSX from "xlsx";

export async function GET() {
    try {
        const headers = [
            "name",
            "phone",
            "email",
            "companyName",
            "gstNumber",
            "place",
            "product",
            "message",
            "priceRange",
            "dealValue",
            "expectedClosureDate",
            "stage",
            "status",
            "source",
            "assignedTo",
            "campaignId",
            "campaignName",
        ];

        const sampleRows = [
            [
                "Rahul Sharma",
                "9876543210",
                "rahul@example.com",
                "ABC Pvt Ltd",
                "06ABCDE1234F1Z5",
                "Delhi",
                "Software",
                "Interested in your product",
                50000,
                45000,
                "2026-09-15",
                "new",
                "open",
                "manual",
                "",
                "",
                "",
            ],
            [
                "Amit Kumar",
                "9876543211",
                "amit@example.com",
                "XYZ Industries",
                "06ABCDE1234F1Z6",
                "Gurgaon",
                "Website Development",
                "Need quotation",
                100000,
                90000,
                "2026-09-20",
                "contacted",
                "open",
                "website",
                "",
                "",
                "",
            ],
        ];

        const worksheet = XLSX.utils.aoa_to_sheet([
            headers,
            ...sampleRows,
        ]);

        worksheet["!cols"] = [
            { wch: 22 },
            { wch: 15 },
            { wch: 28 },
            { wch: 22 },
            { wch: 20 },
            { wch: 18 },
            { wch: 25 },
            { wch: 35 },
            { wch: 15 },
            { wch: 15 },
            { wch: 22 },
            { wch: 18 },
            { wch: 12 },
            { wch: 15 },
            { wch: 25 },
            { wch: 18 },
            { wch: 25 },
        ];

        const workbook = XLSX.utils.book_new();

        XLSX.utils.book_append_sheet(
            workbook,
            worksheet,
            "Leads"
        );

        const buffer = XLSX.write(workbook, {
            type: "buffer",
            bookType: "xlsx",
        });

        return new NextResponse(buffer, {
            status: 200,
            headers: {
                "Content-Type":
                    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                "Content-Disposition":
                    'attachment; filename="lead-import-template.xlsx"',
            },
        });
    } catch (error) {
        console.error(
            "Sample Excel generation error:",
            error
        );

        return NextResponse.json(
            {
                success: false,
                message:
                    error.message ||
                    "Failed to generate sample Excel file.",
            },
            { status: 500 }
        );
    }
}