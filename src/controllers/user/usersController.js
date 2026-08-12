import User from "@/models/user.model.js";
import { hashPassword } from "@/utils/hashPassword";
import Role from "@/models/role.model.js";

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
        filter.roleId = role;
    }

    // Status filter
    if (status) {
        filter.status = status;
    }

    const currentPage = Math.max(Number(page) || 1, 1);
    const perPage = Math.min(Math.max(Number(limit) || 25, 1), 100);
    const skip = (currentPage - 1) * perPage;
    const [users, total] = await Promise.all([
        User.find(filter).select("-password").populate("roleId", "name description permissions isSystemRole")
            .sort({ createdAt: -1, }).skip(skip).limit(perPage).lean(),

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

export const createUserService = async (currentUser, body) => {
    if (!currentUser) {
        throw new Error("User not found.");
    }

    const currentUserWithRole = await User.findById(currentUser._id)
        .populate("roleId", "name permissions isSystemRole");

    if (!currentUserWithRole) {
        throw new Error("User not found.");
    }

    const isAdmin = currentUserWithRole.roleId?.permissions?.includes("*");
    if (!isAdmin) {
        throw new Error("You are not authorized to create users.");
    }

    const { name, email, phone, password, roleId, status = "active", } = body;

    // VALIDATION
    if (!name?.trim()) {
        throw new Error("Name is required.");
    }

    if (!email?.trim()) {
        throw new Error("Email is required.");
    }

    if (!password) {
        throw new Error("Password is required.");
    }

    if (!roleId) {
        throw new Error("Role is required.");
    }

    if (password.length < 6) {
        throw new Error("Password must be at least 6 characters.");
    }

    // NORMALIZE EMAIL
    const normalizedEmail = email.trim().toLowerCase();
    const existingUser = await User.findOne({ email: normalizedEmail, });
    if (existingUser) {
        throw new Error("A user with this email already exists.");
    }

    // FIND ROLE
    const role = await Role.findOne({ _id: roleId, companyId: currentUser.companyId, });
    if (!role) {
        throw new Error("Invalid role or role does not belong to your company.");
    }

    // PREVENT ASSIGNING SYSTEM ADMIN ROLE
    if (role.isSystemRole && role.permissions.includes("*")) {
        throw new Error("Admin role cannot be assigned from this panel.");
    }

    const hashedPassword = await hashPassword(password);
    const newUser = await User.create({
        companyId: currentUser.companyId,
        name: name.trim(),
        email: normalizedEmail,
        phone: phone?.trim() || "",
        password: hashedPassword,
        roleId: role._id,
        status,
    });

    const responseUser = await User.findById(newUser._id).select("-password")
        .populate("roleId", "name description permissions isSystemRole status").lean();

    return responseUser;
};