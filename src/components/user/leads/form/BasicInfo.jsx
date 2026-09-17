// src/components/user/leads/form/BasicInfo.jsx

import React from "react";
import Input from "../../ui/Input";
import SelectInput from "../../ui/SelectInput";

export default function BasicInfo({ form, handleChange }) {
    const handlePhoneChange = (e) => {
        const value = e.target.value.replace(/\D/g, "").slice(0, 10);

        handleChange({
            target: {
                name: "phone",
                value,
            },
        });
    };

    return (
        <div className="bg-card border border-app rounded-2xl p-5">
            <h3 className="uppercase tracking-widest text-xs font-semibold text-muted">
                Basic Information
            </h3>

            <div className="border-b border-app my-4" />

            <div className="grid md:grid-cols-2 gap-3">

                {/* Contact Name */}
                <Input
                    label="Contact Name"
                    required
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Enter contact name"
                />

                {/* Email */}
                <Input
                    label="Email"
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="Enter email"
                />

                {/* Phone */}
                <Input
                    label="Phone"
                    required
                    type="tel"
                    name="phone"
                    value={form.phone}
                    onChange={handlePhoneChange}
                    placeholder="Enter 10 digit phone"
                    leftElement="+91"
                    maxLength={10}
                    inputMode="numeric"
                />

                {/* Location */}
                <Input
                    label="Location"
                    name="place"
                    value={form.place}
                    onChange={handleChange}
                    placeholder="Enter location"
                />

                {/* City */}
                {/* 
                <Input
                    label="City"
                    name="city"
                    value={form.city}
                    onChange={handleChange}
                    placeholder="Enter city"
                />
                */}

                {/* Lead Source */}
                <SelectInput
                    label="Lead Source"
                    name="source"
                    value={form.source}
                    onChange={handleChange}
                    options={[
                        {
                            label: "Website",
                            value: "website",
                        },
                        {
                            label: "Facebook",
                            value: "facebook",
                        },
                        {
                            label: "Google Ads",
                            value: "google",
                        },
                        {
                            label: "WhatsApp",
                            value: "whatsapp",
                        },
                    ]}
                />
            </div>
        </div>
    );
}