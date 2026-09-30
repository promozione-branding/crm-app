import mongoose from 'mongoose';
import User from '@/models/user.model.js';
import Lead from '@/models/leads.model.js';

/**
 * Assign all existing leads from the selected sources to a user.
 * A lead source can belong to only one user per company.
 */
export const syncLeadSourceAssignments = async ({
    userId,
    companyId,
    leadSources = [],
}) => {
    if (!userId || !companyId) {
        throw new Error('User ID and company ID are required.');
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
        throw new Error('Invalid user ID.');
    }

    const sources = [
        ...new Set(
            leadSources
                .map((source) => String(source).trim().toLowerCase())
                .filter(Boolean)
        ),
    ];

    // Verify that the user belongs to this company.
    const user = await User.findOne({
        _id: userId,
        companyId,
    }).select('_id name status');

    if (!user) {
        throw new Error('User not found in this company.');
    }

    if (user.status !== 'active' && sources.length > 0) {
        throw new Error('Only active users can receive lead assignments.');
    }

    if (sources.length === 0) {
        return { matchedSources: [], modifiedLeads: 0 };
    }

    // Keep each selected source assigned to one user per company.
    // Remove these sources from other users' source configurations.
    await User.updateMany(
        {
            companyId,
            _id: { $ne: userId },
            leadSources: { $in: sources },
        },
        {
            $pull: {
                leadSources: { $in: sources },
            },
        }
    );

    // Assign all existing leads from the selected sources.
    const result = await Lead.updateMany(
        {
            companyId,
            source: { $in: sources },
        },
        {
            $set: {
                assignedTo: userId,
                assignedAt: new Date(),
            },
        }
    );

    return {
        matchedSources: sources,
        matchedLeads: result.matchedCount,
        modifiedLeads: result.modifiedCount,
    };
};