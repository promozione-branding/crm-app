import { NextResponse } from "next/server";
import * as XLSX from "xlsx";

import { connectDB } from "@/config/db.js";
import Lead from "@/models/leads.model.js";
import { getCurrentUser } from "@/utils/auth.js";

export async function GET(request) {
    try {
        await connectDB();

        // Get authenticated user
        const user = await getCurrentUser(request);

        if (!user) {
            return NextResponse.json(
                {
                    message: "Unauthorized",
                },
                {
                    status: 401,
                }
            );
        }

        // Make sure user belongs to a company
        if (!user.companyId) {
            return NextResponse.json(
                {
                    message: "User is not associated with a company",
                },
                {
                    status: 400,
                }
            );
        }

        /*
         * Get ALL leads for the user's company.
         *
         * IMPORTANT:
         * LeadSchema does not have a `user` field.
         * It has `companyId`.
         */
        const leads = await Lead.find({
            companyId: user.companyId,
        })
            .populate("assignedTo", "name")
            .lean();

        // Convert leads into Excel-friendly data
        const excelData = leads.map((lead) => ({
            "Contact Name": lead.name || "",
            "Phone": lead.phone || "",
            "Email": lead.email || "",
            "Company Name": lead.companyName || "",
            "GST Number": lead.gstNumber || "",
            "Place": lead.place || "",
            "Product": lead.product || "",
            "Message": lead.message || "",

            "Lead Source": lead.source || "",
            "Stage": lead.stage || "",
            "Status": lead.status || "",

            "Assigned To": lead.assignedTo?.name || "",

            "Deal Value": lead.dealValue ?? 0,
            "Price Range": lead.priceRange ?? "",

            "Expected Closure Date": lead.expectedClosureDate
                ? new Date(lead.expectedClosureDate).toLocaleDateString()
                : "",

            "Campaign Name": lead.campaignName || "",
            "Campaign ID": lead.campaignId || "",
            "Meta Lead ID": lead.metaLeadId || "",

            "Assigned At": lead.assignedAt
                ? new Date(lead.assignedAt).toLocaleString()
                : "",

            "Created At": lead.createdAt
                ? new Date(lead.createdAt).toLocaleString()
                : "",

            "Updated At": lead.updatedAt
                ? new Date(lead.updatedAt).toLocaleString()
                : "",
        }));

        // Create workbook
        const workbook = XLSX.utils.book_new();

        // Create worksheet
        const worksheet = XLSX.utils.json_to_sheet(excelData);

        // Set column widths
        worksheet["!cols"] = [
            { wch: 25 }, // Contact Name
            { wch: 18 }, // Phone
            { wch: 30 }, // Email
            { wch: 25 }, // Company Name
            { wch: 18 }, // GST Number
            { wch: 20 }, // Place
            { wch: 25 }, // Product
            { wch: 40 }, // Message
            { wch: 18 }, // Lead Source
            { wch: 20 }, // Stage
            { wch: 15 }, // Status
            { wch: 22 }, // Assigned To
            { wch: 15 }, // Deal Value
            { wch: 15 }, // Price Range
            { wch: 22 }, // Expected Closure Date
            { wch: 25 }, // Campaign Name
            { wch: 25 }, // Campaign ID
            { wch: 25 }, // Meta Lead ID
            { wch: 22 }, // Assigned At
            { wch: 22 }, // Created At
            { wch: 22 }, // Updated At
        ];

        // Add worksheet to workbook
        XLSX.utils.book_append_sheet(
            workbook,
            worksheet,
            "Leads"
        );

        // Generate Excel file
        const buffer = XLSX.write(workbook, {
            bookType: "xlsx",
            type: "buffer",
        });

        // Generate filename
        const date = new Date()
            .toISOString()
            .slice(0, 10);

        const filename = `leads-${date}.xlsx`;

        // Return Excel file
        return new NextResponse(buffer, {
            status: 200,
            headers: {
                "Content-Type":
                    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",

                "Content-Disposition":
                    `attachment; filename="${filename}"`,

                "Content-Length":
                    buffer.length.toString(),
            },
        });
    } catch (error) {
        console.error("Lead export error:", error);

        return NextResponse.json(
            {
                message: "Failed to export leads",
            },
            {
                status: 500,
            }
        );
    }
}