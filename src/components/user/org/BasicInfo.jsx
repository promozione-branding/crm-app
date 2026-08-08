import React from 'react'
import Input from '../ui/Input'

export default function BasicInfo({ form, handleChange }) {
    return (
        <div className="bg-card border border-app rounded-2xl p-5">
            <h3 className="uppercase tracking-widest text-xs font-semibold text-muted">
                Basic Information
            </h3>

            <div className="border-b border-app my-4" />

            <div className="grid md:grid-cols-2 gap-3">
                <Input
                    label="Organization Name"
                    required
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Enter org name"
                />

                <Input
                    label="Organization Email"
                    type='mail'
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="Enter org email"
                />

                <Input
                    label="Organization Phone"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="Enter org phone"
                    leftElement="+91"
                />

                <Input
                    label="Website"
                    type='text'
                    name="website"
                    value={form.website}
                    onChange={handleChange}
                    placeholder="https://example.com"
                />

            </div>
        </div>
    )
}
