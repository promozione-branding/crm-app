import React from 'react'
import Input from '../../ui/Input'
import SelectInput from '../../ui/SelectInput'

export default function BasicInfo({ form, handleChange }) {
    return (
        <div className="bg-card border border-app rounded-2xl p-5">
            <h3 className="uppercase tracking-widest text-xs font-semibold text-muted">
                Basic Information
            </h3>

            <div className="border-b border-app my-4" />

            <div className="grid md:grid-cols-2 gap-3">
                <Input
                    label="Contact Name"
                    required
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Enter contact name"
                />

                <Input
                    label="Email"
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="Enter email"
                />

                <Input
                    label="Phone"
                    required
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="Enter phone"
                    leftElement="+91"
                />

                <Input
                    label="Location"
                    name="place"
                    value={form.place}
                    onChange={handleChange}
                    placeholder="Enter location"
                />

                {/* <Input
                               label="City"
                               name="city"
                               value={form.city}
                               onChange={handleChange}
                               placeholder="Enter city"
                           /> */}

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
    )
}
