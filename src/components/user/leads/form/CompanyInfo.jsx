// src/components/user/leads/form/CompanyInfo.jsx

import React from 'react';
import Input from '../../ui/Input';

export default function CompanyInfo({ form, handleChange }) {
    const handleGSTChange = (e) => {
        const value = e.target.value
            .replace(/[^a-zA-Z0-9]/g, '')
            .toUpperCase()
            .slice(0, 15);

        handleChange({
            target: {
                name: 'gstNumber',
                value,
            },
        });
    };

    return (
        <div className="bg-card border border-app rounded-2xl p-5 mt-6">
            <h3 className="uppercase tracking-widest text-xs font-semibold text-muted">Company Information</h3>

            <div className="border-b border-app my-4" />

            <div className="grid md:grid-cols-2 gap-3">
                {/* Company Name */}
                <Input label="Company Name" name="companyName" value={form.companyName} onChange={handleChange} placeholder="Enter company name" />

                {/* GST Number */}
                <Input
                    label="GST Number"
                    name="gstNumber"
                    value={form.gstNumber}
                    onChange={handleGSTChange}
                    placeholder="Enter 15 digit GST Number"
                    maxLength={15}
                />
            </div>
        </div>
    );
}
