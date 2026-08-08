import User from "@/models/user.model.js";
import Lead from "@/models/leads.model.js";
import mongoose from "mongoose";
import LeadTask from "@/models/task.model.js";

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

    const lead = await Lead.findOne({ _id: leadId, companyId: user?.companyId, })
        .populate("assignedTo", "name email phone role")
        .populate("activities.createdBy", "name email")
        .populate("stageHistory.updatedBy", "name email")
        .populate("notes.createdBy", "name email");;

    if (!lead) {
        throw new Error("Lead not found.");
    }

    const taskCount = await LeadTask.countDocuments({ leadId: lead._id, companyId: user.companyId, });

    return {
        ...lead.toObject(),
        taskCount,
    };
};

export const updateLeadService = async (user, leadId, body) => {
    if (!mongoose.Types.ObjectId.isValid(leadId)) {
        throw new Error("Invalid lead id.");
    }

    if (!user) {
        throw new Error("User not found.");
    }

    const lead = await Lead.findOne({ _id: leadId, companyId: user.companyId, });
    if (!lead) {
        throw new Error("Lead not found.");
    }

    const changedFields = [];

    // Basic Fields 
    const fields = [
        "name",
        "phone",
        "email",
        "companyName",
        "gstNumber",
        "place",
        "product",
        "message",
        "source",
        "dealValue",
        "campaignId",
        "campaignName",
        "status",
    ];

    fields.forEach((field) => {
        if (body[field] !== undefined) {
            const oldValue = lead[field];

            if (String(oldValue) !== String(body[field])) {
                lead[field] = body[field];
                changedFields.push(field);
            }
        }
    });

    // Expected Closure Date
    if (body.expectedClosureDate !== undefined) {
        const oldDate = lead.expectedClosureDate ? new Date(lead.expectedClosureDate).toISOString() : "";
        const newDate = body.expectedClosureDate ? new Date(body.expectedClosureDate).toISOString() : "";

        if (oldDate !== newDate) {
            lead.expectedClosureDate = body.expectedClosureDate || null;
            changedFields.push("expectedClosureDate");
        }
    }

    // Price Range
    if (body.priceRange !== undefined) {
        if (JSON.stringify(body.priceRange) !== JSON.stringify(lead.priceRange)) {
            lead.priceRange = body.priceRange;
            changedFields.push("priceRange");
        }
    }

    // Assigned User
    const oldAssigned = lead.assignedTo?.toString() || "";
    const newAssigned = body.assignedTo || "";
    if (oldAssigned !== newAssigned) {
        lead.assignedTo = newAssigned || null; lead.assignedAt = newAssigned ? new Date() : null;
        changedFields.push("assignedTo");

        lead.activities.push({
            type: "assigned",
            title: "Lead Assigned",
            description: "Lead reassigned.",
            createdBy: user._id,
        });
    }

    // Stage
    if (body.stage && body.stage !== lead.stage) {
        const oldStage = lead.stage;
        lead.stage = body.stage;
        changedFields.push("stage");

        lead.stageHistory.push({
            stage: body.stage,
            updatedBy: user._id,
            reason: body.reason || "",
            description: body.description || "",
        });

        lead.activities.push({
            type: "status_changed",
            title: "Stage Changed",
            description: `${oldStage} → ${body.stage}`,
            createdBy: user._id,
        });
    }

    // Nothing Changed
    if (!changedFields.length) {
        return lead;
    }

    // Update Activity
    lead.activities.push({
        type: "lead_updated",
        title: "Lead Updated",
        description: `Updated: ${changedFields.join(", ")}`,
        createdBy: user._id,
    });

    await lead.save();

    return await Lead.findById(lead._id)
        .populate("assignedTo", "name email phone role")
        .populate("activities.createdBy", "name email")
        .populate("stageHistory.updatedBy", "name email");
};

export const addLeadNoteService = async (userId, leadId, message) => {
    if (!mongoose.Types.ObjectId.isValid(leadId)) {
        throw new Error("Invalid lead id.");
    }

    if (!message || !message.trim()) {
        throw new Error("Note message is required.");
    }

    const user = await User.findById(userId).select("companyId");

    if (!user) {
        throw new Error("User not found.");
    }

    const lead = await Lead.findOne({
        _id: leadId,
        companyId: user.companyId,
    });

    if (!lead) {
        throw new Error("Lead not found.");
    }

    // Add note
    lead.notes.push({
        message: message.trim(),
        createdBy: userId,
    });

    // Add activity
    lead.activities.push({
        type: "note_added",
        title: "Note Added",
        description: `Note Added: ${message.trim()}`,
        createdBy: userId,
    });

    await lead.save();

    // Return updated lead
    return await Lead.findById(lead._id)
        .populate("notes.createdBy", "name email")
        .populate("activities.createdBy", "name email");
};