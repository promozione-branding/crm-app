import { NextResponse } from "next/server";
import { connectDB } from "@/config/db";
import { ENV } from "@/config/env";
import User from "@/models/user.model.js";
import Lead from "@/models/leads.model.js";
import jwt from "jsonwebtoken";
import * as XLSX from "xlsx";
import mongoose from "mongoose";

export async function POST(request) {
    try {
        await connectDB();

        const token = request.cookies.get(ENV.CLIENT_COOKIE_NAME)?.value;
        if (!token) {
            return NextResponse.json({ success: false, message: "Not authenticated", }, { status: 401 });
        }

        const decoded = jwt.verify(token, ENV.JWT_CLIENT_SECRET);
        const user = await User.findById(decoded.id).select("-password");
        if (!user) {
            return NextResponse.json({ success: false, message: "User not found.", }, { status: 401 });
        }

        if (!user.companyId) {
            return NextResponse.json({ success: false, message: "Company not found.", }, { status: 400 });
        }

        const formData = await request.formData();
        const file = formData.get("file");
        if (!file || typeof file === "string") {
            return NextResponse.json({ success: false, message: "Excel file is required.", }, { status: 400 });
        }

        // File validation
        const allowedTypes = [
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            "application/vnd.ms-excel",
        ];

        const fileName = file.name?.toLowerCase().trim() || "";

        const isExcel =
            fileName.endsWith(".xlsx") ||
            fileName.endsWith(".xls");

        if (!isExcel) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Only Excel files (.xlsx or .xls) are allowed.",
                },
                { status: 400 }
            );
        }

        // Optional 10 MB limit
        if (file.size > 10 * 1024 * 1024) {
            return NextResponse.json({ success: false, message: "File size cannot exceed 10 MB.", }, { status: 400 });
        }

        // Convert File -> Buffer
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        // Read Excel
        const workbook = XLSX.read(buffer, { type: "buffer", cellDates: true, });
        const sheetName = workbook.SheetNames[0];
        if (!sheetName) {
            return NextResponse.json({ success: false, message: "Excel sheet not found.", }, { status: 400 });
        }

        const worksheet = workbook.Sheets[sheetName];
        const rows = XLSX.utils.sheet_to_json(worksheet, { defval: "", raw: true, });
        if (!rows.length) {
            return NextResponse.json({ success: false, message: "Excel file is empty.", }, { status: 400 });
        }

        // Prepare leads
        const leads = [];
        const errors = [];
        for (let index = 0; index < rows.length; index++) {
            const row = rows[index];
            const rowNumber = index + 2;

            try {
                const name = String(row.name || row.Name || "").trim();

                if (!name) {
                    throw new Error("Name is required.");
                }

                // Validate stage
                const allowedStages = [
                    "new",
                    "contacted",
                    "qualified",
                    "proposal_sent",
                    "negotiation",
                    "won",
                    "lost",
                ];

                const stage = String(row.stage || row.Stage || "new").trim();
                if (!allowedStages.includes(stage)) {
                    throw new Error(`Invalid stage: ${stage}`);
                }

                // Validate status
                const allowedStatuses = ["open", "closed", "junk",];
                const status = String(row.status || row.Status || "open").trim();
                if (!allowedStatuses.includes(status)) {
                    throw new Error(`Invalid status: ${status}`);
                }

                // Validate source
                const allowedSources = [
                    "facebook",
                    "google",
                    "website",
                    "whatsapp",
                    "manual",
                    "indiamart",
                    "tradeindia",
                    "other",
                ];

                const source = String(row.source || row.Source || "manual").trim();
                if (!allowedSources.includes(source)) {
                    throw new Error(`Invalid source: ${source}`);
                }

                // assignedTo
                let assignedTo = null;
                if (row.assignedTo) {
                    const assignedValue = String(row.assignedTo).trim();

                    if (mongoose.Types.ObjectId.isValid(assignedValue)) {
                        assignedTo = assignedValue;
                    } else {
                        const assignedUser = await User.findOne({
                            companyId: user.companyId,
                            name: { $regex: `^${assignedValue}$`, $options: "i", },
                        }).select("_id");

                        if (!assignedUser) {
                            throw new Error(`Assigned user "${assignedValue}" not found.`);
                        }

                        assignedTo = assignedUser._id;
                    }
                }

                // Date
                let expectedClosureDate;
                if (row.expectedClosureDate) {
                    const date = new Date(row.expectedClosureDate);
                    if (isNaN(date.getTime())) {
                        throw new Error("Invalid expected closure date.");
                    }

                    expectedClosureDate = date;
                }

                // Numbers
                let priceRange;
                if (row.priceRange !== "" && row.priceRange !== undefined) {
                    priceRange = Number(row.priceRange);

                    if (Number.isNaN(priceRange)) {
                        throw new Error("Invalid price range.");
                    }
                }

                let dealValue = 0;
                if (row.dealValue !== "" && row.dealValue !== undefined) {
                    dealValue = Number(row.dealValue);

                    if (Number.isNaN(dealValue)) {
                        throw new Error("Invalid deal value.");
                    }
                }

                // Create lead object
                leads.push({
                    companyId: user.companyId,
                    source,
                    name,
                    phone: String(row.phone || row.Phone || "").trim() || undefined,
                    email: String(row.email || row.Email || "").trim().toLowerCase() || undefined,
                    companyName: String(row.companyName || row["Company Name"] || "").trim() || undefined,
                    gstNumber: String(row.gstNumber || row["GST Number"] || "").trim().toUpperCase() || undefined,
                    place: String(row.place || row.Place || "").trim() || undefined,
                    product: String(row.product || row.Product || "").trim() || undefined,
                    message: String(row.message || row.Message || "").trim() || undefined,
                    priceRange,
                    dealValue,
                    expectedClosureDate,
                    stage,
                    status,
                    assignedTo,
                    assignedAt: assignedTo ? new Date() : null,
                    campaignId: String(row.campaignId || "").trim() || undefined,
                    campaignName: String(row.campaignName || row["Campaign Name"] || "").trim() || undefined,

                    activities: [{
                        type: "lead_created",
                        description: "Lead imported from Excel.",
                        createdBy: user._id,
                    },],

                    stageHistory: [{
                        stage,
                        description: "Lead imported from Excel.",
                        updatedBy: user._id,
                    },],
                });

            } catch (error) {
                errors.push({
                    row: rowNumber,
                    name: row.name || row.Name || "",
                    error: error.message,
                });
            }
        }

        // Insert valid leads
        let insertedLeads = [];
        if (leads.length) {
            insertedLeads = await Lead.insertMany(leads, { ordered: false, });
        }

        return NextResponse.json({
            success: true,
            message: "Lead import completed.",
            data: {
                total: rows.length,
                imported: insertedLeads.length,
                failed: errors.length,
                errors,
            },
        }, { status: 201 });

    } catch (error) {
        console.error("Bulk lead import error:", error);
        return NextResponse.json({
            success: false,
            message: error.message || "Failed to import leads.",
        }, { status: 400 });
    }
}