import { NextResponse } from "next/server";
import mongoose from "mongoose";
import Company from "@/models/company.model.js";
import User from "@/models/user.model.js";
import { hashPassword } from "@/utils/hashPassword";
import jwt from "jsonwebtoken";
import { ENV } from "@/config/env";
import AdminUser from "@/models/adminUser.model";

const generateCrmDomain = (website) => {
    if (!website) {
        throw new Error("Website is required");
    }

    let formattedWebsite = website.trim();
    if (!formattedWebsite.startsWith("http")) {
        formattedWebsite = `https://${formattedWebsite}`;
    }

    const url = new URL(formattedWebsite);
    const hostname = url.hostname.replace("www.", "");

    return `crm.${hostname}`;
};

export const createCompanyUser = async (request) => {
    try {
        const body = await request.json();

        const {
            userName,
            userEmail,
            userPhone,
            password,
            role,

            companyName,
            website,
            crmDomain,
            plan
        } = body;

        const token = request.cookies.get(ENV.ADMIN_COOKIE_NAME)?.value;

        if (!token) {
            return NextResponse.json(
                { success: false, message: "Unauthorized" },
                { status: 401 }
            );
        }

        const decoded = jwt.verify(token, ENV.JWT_ADMIN_SECRET);
        const adminId = decoded.id;
        const finalDomain = generateCrmDomain(website);

        if (!userName || !userEmail || !password || !companyName || !website || !finalDomain) {
            return NextResponse.json(
                { success: false, message: "Required fields missing" },
                { status: 400 }
            );
        }

        // Check existing user
        const existingUser = await User.findOne({ email: userEmail.toLowerCase() });
        if (existingUser) {
            return NextResponse.json(
                { success: false, message: "User email already exists" },
                { status: 409 }
            );
        }

        // Check company
        const existingCompany = await Company.findOne({
            $or: [
                { email: userEmail.toLowerCase() },
                { website },
                { crmDomain }
            ]
        });
        if (existingCompany) {
            return NextResponse.json(
                { success: false, message: "Company already exists" },
                { status: 409 }
            );
        }

        // Create Company
        const company = await Company.create({
            name: companyName,
            email: userEmail.toLowerCase(),
            phone: userPhone,
            website,
            crmDomain: finalDomain,
            plan,
            createdBy: adminId,
        });

        const companyId = company?._id;
        const hashedPassword = await hashPassword(password);

        // Create Company Admin
        await User.create({
            name: userName,
            email: userEmail.toLowerCase(),
            phone: userPhone,
            password: hashedPassword,
            role: role || "admin",
            companyId
        });

        return NextResponse.json({
            success: true,
            message: "Company and user created successfully",
            data: { companyId }
        }, { status: 201 });
    } catch (error) {
        console.log(error);
        return NextResponse.json(
            { success: false, message: error.message },
            { status: 500 }
        );
    }
}

export const getAllCompanies = async (request) => {
    try {
        const { searchParams } = new URL(request.url);

        // Pagination
        const page = Number(searchParams.get("page")) || 1;
        const limit = Number(searchParams.get("limit")) || 10;
        const skip = (page - 1) * limit;

        // Search
        const search = searchParams.get("search") || "";

        // Filters
        const status = searchParams.get("status");
        const plan = searchParams.get("plan");

        let query = {};
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: "i" } },
                { email: { $regex: search, $options: "i" } },
                { website: { $regex: search, $options: "i" } },
                { crmDomain: { $regex: search, $options: "i" } }
            ];
        }

        // Status Filter
        if (status) {
            query.status = status;
        }

        // Plan Filter
        if (plan) {
            query.plan = plan;
        }

        // Total Count
        const total = await Company.countDocuments(query);

        // Data
        const companies = await Company.find(query).select("name email website logoUrl plan status createdBy createdAt")
            .populate("createdBy", "name email").sort({ createdAt: -1 }).skip(skip).limit(limit).lean();

        return NextResponse.json({
            success: true,
            data: companies,

            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit)
            }
        }, { status: 200 });

    } catch (error) {
        console.log(error);

        return NextResponse.json(
            { success: false, message: error.message },
            { status: 500 }
        );
    }
}