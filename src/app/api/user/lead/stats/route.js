// src/app/api/user/leads/stats/route.js

import { NextResponse } from 'next/server';

import { connectDB } from '@/config/db';
import { getCurrentUser } from '@/utils/auth';

import Lead from '@/models/leads.model';

export async function GET(request) {
    try {
        await connectDB();

        const user = await getCurrentUser(request);

        if (!user) {
            return NextResponse.json({ success: false, message: 'User not found.' }, { status: 401 });
        }

        const companyId = user.companyId;
        const userId = user._id;

        await user.populate({ path: 'roleId', select: 'name isSystemRole' });

        const isAdmin = user.roleId?.isSystemRole === true && user.roleId?.name?.toLowerCase() === 'admin';

        const leadFilter = isAdmin ? { companyId } : { companyId, assignedTo: userId };

        const [pipelineAgg, dealAgg] = await Promise.all([
            Lead.aggregate([{ $match: leadFilter }, { $group: { _id: '$stage', count: { $sum: 1 } } }]),
            Lead.aggregate([
                { $match: leadFilter },
                {
                    $group: {
                        _id: null,
                        totalValue: { $sum: { $ifNull: ['$dealValue', 0] } },
                        wonValue: {
                            $sum: {
                                $cond: [{ $eq: ['$stage', 'won'] }, { $ifNull: ['$dealValue', 0] }, 0],
                            },
                        },
                        openPipelineValue: {
                            $sum: {
                                $cond: [
                                    { $and: [{ $ne: ['$stage', 'won'] }, { $ne: ['$stage', 'lost'] }] },
                                    { $ifNull: ['$dealValue', 0] },
                                    0,
                                ],
                            },
                        },
                    },
                },
            ]),
        ]);

        const pipeline = {
            new: 0,
            contacted: 0,
            qualified: 0,
            proposal_sent: 0,
            negotiation: 0,
            won: 0,
            lost: 0,
        };

        pipelineAgg.forEach((row) => {
            if (row._id in pipeline) pipeline[row._id] = row.count;
        });

        const total = Object.values(pipeline).reduce((sum, v) => sum + v, 0);
        const conversionRate = total > 0 ? Number(((pipeline.won / total) * 100).toFixed(1)) : 0;

        const dealValue = dealAgg[0] || { totalValue: 0, wonValue: 0, openPipelineValue: 0 };

        return NextResponse.json({
            success: true,
            data: {
                isAdmin,
                total,
                pipeline,
                conversionRate,
                dealValue: {
                    total: dealValue.totalValue || 0,
                    won: dealValue.wonValue || 0,
                    openPipeline: dealValue.openPipelineValue || 0,
                },
            },
        });
    } catch (error) {
        console.error('GET LEADS STATS ERROR:', error);
        return NextResponse.json(
            { success: false, message: error.message || 'Failed to fetch lead stats.' },
            { status: 500 }
        );
    }
}