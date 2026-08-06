import React from 'react'
import Input from '../../ui/Input'

export default function CompanyInfo({ form, handleChange }) {
    return (
        <div className="bg-card border border-app rounded-2xl p-5 mt-6">
            <h3 className="uppercase tracking-widest text-xs font-semibold text-muted">
                Company Information
            </h3>

            <div className="border-b border-app my-4" />

            <div className="grid md:grid-cols-2 gap-3">

                <Input
                    label="Company Name"
                    name="companyName"
                    value={form.companyName}
                    onChange={handleChange}
                    placeholder="Enter company name"
                />

                <Input
                    label="GST Number"
                    name="gstNumber"
                    value={form.gstNumber}
                    onChange={handleChange}
                    placeholder="Enter GST Number"
                />

            </div>
        </div>
    )
}
