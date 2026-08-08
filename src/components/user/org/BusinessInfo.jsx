import React from 'react'
import Input from '../ui/Input'
import SelectInput from '../ui/SelectInput'

export default function BusinessInfo({ form, handleChange }) {
    return (
        <div className="bg-card border border-app rounded-2xl p-5">
            <h3 className="uppercase tracking-widest text-xs font-semibold text-muted">
                Business Info
            </h3>

            <div className="border-b border-app my-4" />

            <div className="grid md:grid-cols-2 gap-3">
                <Input
                    label="GST Number"
                    name="gst"
                    value={form.gst}
                    onChange={handleChange}
                    placeholder="Enter gst no."
                />

                <Input
                    label="Address"
                    name="address"
                    value={form.address}
                    onChange={handleChange}
                    placeholder="Enter address"
                />

                <SelectInput
                    label="State"
                    name="state"
                    value={form.state}
                    onChange={handleChange}
                    options={[
                        { label: "Delhi", value: "Delhi", },
                    ]}
                />

                <SelectInput
                    label="Country"
                    name="country"
                    value={form.country}
                    onChange={handleChange}
                    options={[
                        { label: "India", value: "India" },
                    ]}
                />

            </div>
        </div>
    )
}
