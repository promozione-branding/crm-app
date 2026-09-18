// src/components/user/org/BusinessInfo.jsx

import React from 'react';
import Input from '../ui/Input';
import SelectInput from '../ui/SelectInput';

export default function BusinessInfo({ form, handleChange }) {
    const handleGSTChange = (e) => {
        const value = e.target.value
            .replace(/[^a-zA-Z0-9]/g, '')
            .toUpperCase()
            .slice(0, 15);

        handleChange({
            target: {
                name: 'gst',
                value,
            },
        });
    };

    return (
        <div className="bg-card border border-app rounded-2xl p-5">
            <h3 className="uppercase tracking-widest text-xs font-semibold text-muted">Business Info</h3>

            <div className="border-b border-app my-4" />

            <div className="grid md:grid-cols-2 gap-3">
                {/* GST Number */}
                <Input label="GST Number" name="gst" value={form.gst} onChange={handleGSTChange} placeholder="Enter 15 digit GST No." maxLength={15} />

                {/* Address */}
                <Input label="Address" name="address" value={form.address} onChange={handleChange} placeholder="Enter address" />

                {/* State */}
                <SelectInput
                    label="State"
                    name="state"
                    value={form.state}
                    onChange={handleChange}
                    options={[
                        {
                            label: 'Delhi',
                            value: 'Delhi',
                        },
                    ]}
                />

                {/* Country */}
                <SelectInput
                    label="Country"
                    name="country"
                    value={form.country}
                    onChange={handleChange}
                    options={[
                        {
                            label: 'India',
                            value: 'India',
                        },
                    ]}
                />
            </div>
        </div>
    );
}
