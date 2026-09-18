// src/components/user/leads/form/CampaignInfo.jsx

import React from 'react';
import Input from '../../ui/Input';

export default function CampaignInfo({ form, handleChange }) {
    return (
        <div className="bg-card border-app mt-6 rounded-2xl border p-5">
            <h3 className="text-muted text-xs font-semibold tracking-widest uppercase">Campaign Information</h3>

            <div className="border-app my-4 border-b" />

            <div className="grid gap-3 md:grid-cols-2">
                <Input label="Campaign ID" name="campaignId" value={form.campaignId} onChange={handleChange} placeholder="Campaign ID" />

                <Input label="Campaign Name" name="campaignName" value={form.campaignName} onChange={handleChange} placeholder="Campaign Name" />
            </div>
        </div>
    );
}
