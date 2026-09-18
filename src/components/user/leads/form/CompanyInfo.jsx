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
        <div className="bg-card border-app mt-6 rounded-2xl border p-5">
            <h3 className="text-muted text-xs font-semibold tracking-widest uppercase">Company Information</h3>

            <div className="border-app my-4 border-b" />

            <div className="grid gap-3 md:grid-cols-2">
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
