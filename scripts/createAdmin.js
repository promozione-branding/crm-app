import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import AdminUser from "../src/models/adminUser.model.js";
dotenv.config();

const createAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("MongoDB Connected");
        const existingAdmin = await AdminUser.findOne({ email: "admin@inquirybazaar.com" });

        if (existingAdmin) {
            console.log("Admin already exists");
            process.exit();
        }

        const password = await bcrypt.hash("inquirybazaar1234", 12);

        const admin = await AdminUser.create({
            name: "InquiryBazaar Owner",
            email: "admin@inquirybazaar.com",
            phone: "7303486777",
            password,
            role: "owner",
            permissions: [
                "company.create",
                "company.update",
                "employee.create",
                "employee.update",
                "billing.view"
            ],
            status: "active"
        });

        console.log("Admin Created:", admin.email);
        process.exit();
    }
    catch (error) {
        console.log(error);
        process.exit(1);
    }
};

createAdmin();