// src/components/user/org/BasicInfo.jsx

import React from 'react';
import Input from '../ui/Input';

export default function BasicInfo({ form, handleChange }) {
    const handlePhoneChange = (e) => {
        const value = e.target.value.replace(/\D/g, '').slice(0, 10);

        handleChange({
            target: {
                name: 'phone',
                value,
            },
        });
    };

    return (
        <div className="bg-card border-app rounded-2xl border p-5">
            <h3 className="text-muted text-xs font-semibold tracking-widest uppercase">Basic Information</h3>

            <div className="border-app my-4 border-b" />

            <div className="grid gap-3 md:grid-cols-2">
                {/* Organization Name */}
                <Input label="Organization Name" required name="name" value={form.name} onChange={handleChange} placeholder="Enter org name" />

                {/* Organization Email */}
                <Input label="Organization Email" type="email" name="email" value={form.email} onChange={handleChange} placeholder="Enter org email" />

                {/* Organization Phone */}
                <Input
                    label="Organization Phone"
                    type="tel"
                    name="phone"
                    value={form.phone}
                    onChange={handlePhoneChange}
                    placeholder="Enter 10 digit phone"
                    leftElement="+91"
                    maxLength={10}
                    inputMode="numeric"
                />

                {/* Website */}
                <Input label="Website" type="text" name="website" value={form.website} onChange={handleChange} placeholder="https://example.com" />
            </div>
        </div>
    );
}
