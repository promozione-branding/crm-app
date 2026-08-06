import React from 'react'
import Input from '../../ui/Input'

export default function CampaignInfo({ form, handleChange }) {
    return (
        <div className="bg-card border border-app rounded-2xl p-5 mt-6">
            <h3 className="uppercase tracking-widest text-xs font-semibold text-muted">
                Campaign Information
            </h3>

            <div className="border-b border-app my-4" />

            <div className="grid md:grid-cols-2 gap-3">

                <Input
                    label="Campaign ID"
                    name="campaignId"
                    value={form.campaignId}
                    onChange={handleChange}
                    placeholder="Campaign ID"
                />

                <Input
                    label="Campaign Name"
                    name="campaignName"
                    value={form.campaignName}
                    onChange={handleChange}
                    placeholder="Campaign Name"
                />

            </div>
        </div>
    )
}
