// src/app/api/user/dashboard/ai-insights/route.js

import { NextResponse } from 'next/server';
import OpenAI from 'openai';

import { connectDB } from '@/config/db';
import { getCurrentUser } from '@/utils/auth';

import Lead from '@/models/leads.model';
import LeadTask from '@/models/task.model';
import Call from '@/models/call.model';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

// ============================================================
// SYSTEM PROMPT
// ============================================================

const SYSTEM_PROMPT = `
You are a senior CRM sales coach. You receive structured JSON data
about a sales rep's pipeline, tasks, and calls.

Your job: produce concise, actionable insights for TODAY.

Rules:
- Be specific. Mention names, numbers, days.
- No fluff. No generic advice like "follow up with leads".
- Prioritize by revenue impact and urgency.
- If data is empty, say so briefly and suggest next steps.

Return ONLY valid JSON in this exact shape:

{
  "summary": "one short paragraph (max 3 sentences)",
  "priority_actions": [
    { "title": "...", "why": "...", "urgency": "high|medium|low" }
  ],
  "hot_leads": [
    { "name": "...", "reason": "..." }
  ],
  "risky_leads": [
    { "name": "...", "reason": "..." }
  ],
  "call_insights": "one short paragraph about call activity"
}

Max 5 items in priority_actions, 3 in hot_leads, 3 in risky_leads.
`.trim();

// ============================================================
// ROUTE
// ============================================================

export async function GET(request) {
    try {
        await connectDB();

        const user = await getCurrentUser(request);

        if (!user) {
            return NextResponse.json({ success: false, message: 'User not found.' }, { status: 401 });
        }

        const companyId = user.companyId;
        const userId = user._id;

        await user.populate({
            path: 'roleId',
            select: 'name isSystemRole',
        });

        const isAdmin = user.roleId?.isSystemRole === true && user.roleId?.name?.toLowerCase() === 'admin';

        // ========================================================
        // VISIBILITY FILTERS (same rules as your other routes)
        // ========================================================

        const leadFilter = isAdmin ? { companyId } : { companyId, assignedTo: userId };

        const taskFilter = isAdmin
            ? { companyId }
            : {
                  companyId,
                  $or: [{ createdBy: userId }, { assignedTo: userId }],
              };

        const callFilter = isAdmin ? { companyId } : { companyId, callerId: userId };

        // ========================================================
        // GATHER MINIMAL, RELEVANT DATA
        // ========================================================

        const now = new Date();

        const [pipelineAgg, totalLeads, wonLeads, openTasks, overdueTasks, dueTodayTasks, recentCalls, staleLeads, hotLeads] = await Promise.all([
            // Pipeline counts per stage
            Lead.aggregate([{ $match: leadFilter }, { $group: { _id: '$stage', count: { $sum: 1 } } }]),

            Lead.countDocuments(leadFilter),

            Lead.countDocuments({ ...leadFilter, stage: 'won' }),

            LeadTask.countDocuments({ ...taskFilter, status: 'pending' }),

            LeadTask.countDocuments({
                ...taskFilter,
                status: { $nin: ['completed', 'cancelled'] },
                dueDate: { $lt: now },
            }),

            LeadTask.countDocuments({
                ...taskFilter,
                status: { $nin: ['completed', 'cancelled'] },
                dueDate: {
                    $gte: new Date(now.getFullYear(), now.getMonth(), now.getDate()),
                    $lt: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1),
                },
            }),

            // Last 10 calls
            Call.find(callFilter).sort({ calledAt: -1 }).limit(10).select('status calledAt phoneNumber refId').populate('refId', 'name').lean(),

            // Leads not touched in 7+ days, still open
            Lead.find({
                ...leadFilter,
                stage: { $nin: ['won', 'lost'] },
                updatedAt: { $lt: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000) },
            })
                .sort({ updatedAt: 1 })
                .limit(5)
                .select('name stage dealValue updatedAt')
                .lean(),

            // High-value leads still open (deal value > 0, not won/lost)
            Lead.find({
                ...leadFilter,
                stage: { $nin: ['won', 'lost'] },
                dealValue: { $gt: 0 },
            })
                .sort({ dealValue: -1 })
                .limit(5)
                .select('name stage dealValue updatedAt')
                .lean(),
        ]);

        // ========================================================
        // COMPACT PAYLOAD FOR LLM
        // ========================================================

        const pipeline = pipelineAgg.reduce((acc, row) => {
            if (row._id) acc[row._id] = row.count;
            return acc;
        }, {});

        const payload = {
            scope: isAdmin ? 'admin (whole company)' : 'personal',
            totals: {
                leads: totalLeads,
                won: wonLeads,
                conversion_rate_pct: totalLeads > 0 ? Number(((wonLeads / totalLeads) * 100).toFixed(1)) : 0,
            },
            pipeline,
            tasks: {
                pending: openTasks,
                overdue: overdueTasks,
                due_today: dueTodayTasks,
            },
            calls_last_10: recentCalls.map((c) => ({
                status: c.status,
                to: c.refId?.name || c.phoneNumber || 'unknown',
                at: c.calledAt,
            })),
            stale_open_leads: staleLeads.map((l) => ({
                name: l.name,
                stage: l.stage,
                value: l.dealValue || 0,
                days_since_update: Math.floor((now - new Date(l.updatedAt)) / (1000 * 60 * 60 * 24)),
            })),
            high_value_open_leads: hotLeads.map((l) => ({
                name: l.name,
                stage: l.stage,
                value: l.dealValue || 0,
            })),
        };

        // ========================================================
        // CALL OPENAI
        // ========================================================

        const completion = await openai.responses.create({
            model: process.env.OPENAI_MODEL || 'gpt-6-luna',
            input: [
                { role: 'system', content: SYSTEM_PROMPT },
                {
                    role: 'user',
                    content: `Here is the CRM data:\n${JSON.stringify(payload, null, 2)}\n\nReturn JSON only.`,
                },
            ],
            store: false,
        });

        // ========================================================
        // PARSE JSON (defensive)
        // ========================================================

        let insights;
        try {
            const raw = completion.output_text
                .replace(/^```json\s*/i, '')
                .replace(/```$/i, '')
                .trim();
            insights = JSON.parse(raw);
        } catch (parseErr) {
            console.error('AI JSON parse failed:', parseErr, completion.output_text);
            return NextResponse.json({ success: false, message: 'AI returned invalid JSON.' }, { status: 502 });
        }

        // ========================================================
        // RESPONSE
        // ========================================================

        return NextResponse.json({
            success: true,
            data: {
                insights,
                generatedAt: new Date().toISOString(),
                scope: payload.scope,
            },
        });
    } catch (error) {
        console.error('GET AI INSIGHTS ERROR:', error);

        return NextResponse.json(
            {
                success: false,
                message: error.message || 'Failed to generate AI insights.',
            },
            { status: 500 }
        );
    }
}
