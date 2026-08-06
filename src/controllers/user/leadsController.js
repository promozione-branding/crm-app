import User from "@/models/user.model.js";
import Lead from "@/models/leads.model.js";
import mongoose from "mongoose";

export const createLeadService = async (userId, companyId, body) => {
    if (!userId || !companyId) {
        throw new Error("User Info not found.");
    }

    const lead = await Lead.create({
        ...body,

        companyId: companyId,
        assignedTo: body.assignedTo || null,
        assignedAt: body.assignedTo ? new Date() : null,

        activities: [
            {
                type: "lead_created",
                description: "Lead created.",
                createdBy: userId,
            },
        ],

        stageHistory: [
            {
                stage: body.stage || "new",
                description: "Lead created",
                updatedBy: userId,
            },
        ],
    });

    return lead;
};

export const getAllLeadsService = async (user, query) => {
    if (!user) {
        throw new Error("User not found");
    }

    const {
        stage,
        source,
        assignedTo,
        search,
        page = 1,
        limit = 10,
    } = query;

    const filter = { companyId: user.companyId, };

    if (stage) {
        filter.stage = stage;
    }

    if (source) {
        filter.source = source;
    }

    if (assignedTo) {
        filter.assignedTo = assignedTo;
    }

    if (search) {
        filter.$or = [
            { name: { $regex: search, $options: "i" } },
            { phone: { $regex: search, $options: "i" } },
            { email: { $regex: search, $options: "i" } },
            { companyName: { $regex: search, $options: "i" } }
        ];
    }

    const skip = (page - 1) * limit;
    const [leads, total] = await Promise.all([
        Lead.find(filter).populate("assignedTo", "name email phone role")
            .populate("activities.createdBy", "name email").sort({ createdAt: -1 }).skip(skip).limit(limit),

        Lead.countDocuments(filter)
    ]);

    return {
        leads,
        pagination: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit)
        }
    };
};

export const getLeadByIdService = async (user, leadId) => {
    if (!mongoose.Types.ObjectId.isValid(leadId)) {
        throw new Error("Invalid lead id.");
    }

    if (!user) {
        throw new Error("User not found.");
    }

    const lead = await Lead.findOne({ _id: leadId, companyId: user?.companyId, }).populate("assignedTo", "name email phone role")
        .populate("activities.createdBy", "name email").populate("stageHistory.updatedBy", "name email");

    if (!lead) {
        throw new Error("Lead not found.");
    }

    return lead;
};