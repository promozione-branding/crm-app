// src/components/user/leads/form/DealInfo.jsx

'use client';

import React from 'react';

import SelectInput from '../../ui/SelectInput';
import Input from '../../ui/Input';

export default function DealInfo({ form, handleChange, users = [], usersLoading = false }) {
    // ============================================================
    // USERS NOW COME FROM PARENT
    // ============================================================
    //
    // No:
    //
    // GET /api/user?limit=100
    //
    // here anymore.
    // ============================================================

    return (
        <div className="bg-card border-app text-app rounded-2xl border p-5">
            {/* =====================================================
                HEADER
            ===================================================== */}

            <div className="mb-4 flex items-center justify-between">
                <h3 className="text-muted text-xs font-semibold tracking-widest uppercase">Deal Information</h3>
            </div>

            {/* =====================================================
                FORM
            ===================================================== */}

            <div className="grid gap-3 md:grid-cols-2">
                {/* ASSIGNED TO */}

                <SelectInput
                    label="Assigned To"
                    name="assignedTo"
                    value={form.assignedTo}
                    onChange={handleChange}
                    disabled={usersLoading}
                    options={[
                        ...users.map((user) => ({
                            label: `${user.name} (${user.roleId?.name})`,
                            value: user._id,
                        })),
                    ]}
                />

                {/* STAGE */}

                <SelectInput
                    label="Stage"
                    name="stage"
                    value={form.stage}
                    onChange={handleChange}
                    options={[
                        {
                            label: 'New',
                            value: 'new',
                        },
                        {
                            label: 'Contacted',
                            value: 'contacted',
                        },
                        {
                            label: 'Qualified',
                            value: 'qualified',
                        },
                        {
                            label: 'Proposal',
                            value: 'proposal',
                        },
                        {
                            label: 'Negotiation',
                            value: 'negotiation',
                        },
                        {
                            label: 'Won',
                            value: 'won',
                        },
                        {
                            label: 'Lost',
                            value: 'lost',
                        },
                    ]}
                />

                {/* PRICE RANGE */}

                <Input label="Price Range" name="priceRange" value={form.priceRange} onChange={handleChange} placeholder="Enter price range" />

                {/* DEAL VALUE */}

                <Input label="Deal Value" name="dealValue" value={form.dealValue} onChange={handleChange} placeholder="Enter deal value" type="number" />

                {/* EXPECTED CLOSURE DATE */}

                <Input label="Expected Closure Date" name="expectedClosureDate" value={form.expectedClosureDate} onChange={handleChange} type="date" />
            </div>
        </div>
    );
}
