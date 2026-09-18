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
        <div className="bg-card border-app rounded-2xl border p-5">
            <h3 className="text-muted text-xs font-semibold tracking-widest uppercase">Business Info</h3>

            <div className="border-app my-4 border-b" />

            <div className="grid gap-3 md:grid-cols-2">
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
