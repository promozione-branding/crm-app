import User from "@/models/user.model.js";
import { hashPassword } from "@/utils/hashPassword";

export const getAllUsersService = async (userId, query = {}) => {
    const currentUser = await User.findById(userId).select("companyId");

    if (!currentUser) {
        throw new Error("User not found.");
    }

    const { search = "", role = "", status = "", page = 1, limit = 25, } = query;
    const filter = { companyId: currentUser.companyId, };

    // Search
    if (search.trim()) {
        filter.$or = [
            { name: { $regex: search.trim(), $options: "i", }, },
            { email: { $regex: search.trim(), $options: "i", }, },
            { phone: { $regex: search.trim(), $options: "i", }, },
        ];
    }

    // Role filter
    if (role) {
        filter.role = role;
    }

    // Status filter
    if (status) {
        filter.status = status;
    }

    const currentPage = Math.max(Number(page) || 1, 1);
    const perPage = Math.min(Math.max(Number(limit) || 25, 1), 100);
    const skip = (currentPage - 1) * perPage;
    const [users, total] = await Promise.all([
        User.find(filter).select("-password").sort({ createdAt: -1, })
            .skip(skip).limit(perPage).lean(),

        User.countDocuments(filter),
    ]);

    return {
        users,
        pagination: {
            page: currentPage,
            limit: perPage,
            total,
            totalPages: Math.ceil(total / perPage),
            hasNextPage: currentPage < Math.ceil(total / perPage),
            hasPreviousPage: currentPage > 1,
        },
    };
};

export const createUserService = async (userId, body) => {
    const currentUser = await User.findById(userId).select("companyId role");
    if (!currentUser) {
        throw new Error("User not found.");
    }

    // Only admin can create users
    if (currentUser.role !== "admin") {
        throw new Error("You are not authorized to create users.");
    }

    const {
        name,
        email,
        phone,
        password,
        role = "employee",
        permissions = [],
        status = "active",
    } = body;

    // Required fields
    if (!name?.trim()) {
        throw new Error("Name is required.");
    }

    if (!email?.trim()) {
        throw new Error("Email is required.");
    }

    if (!password) {
        throw new Error("Password is required.");
    }

    // Allowed roles
    const allowedRoles = [
        "admin",
        "sub-admin",
        "manager",
        "employee",
    ];

    if (!allowedRoles.includes(role)) {
        throw new Error("Invalid role.");
    }

    // Don't allow another admin
    // Remove this if you want multiple admins
    if (role === "admin") {
        throw new Error("Admin user cannot be created from this panel.");
    }

    const normalizedEmail = email.trim().toLowerCase();

    // Check duplicate email
    const existingUser = await User.findOne({ email: normalizedEmail, });
    if (existingUser) {
        throw new Error("A user with this email already exists.");
    }

    // Password validation
    if (password.length < 6) {
        throw new Error("Password must be at least 6 characters.");
    }

    const hashedPassword = await hashPassword(password);
    const user = await User.create({
        companyId: currentUser.companyId,
        name: name.trim(),
        email: normalizedEmail,
        phone: phone?.trim() || "",
        password: hashedPassword,
        role,
        permissions: Array.isArray(permissions) ? permissions : [],
        status,
    });

    const responseUser = await User.findById(user._id).select("-password").lean();
    return responseUser;
};