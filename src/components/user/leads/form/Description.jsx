import React from 'react'
import Input from '../../ui/Input'
import TextArea from '../../ui/TextArea'

export default function Description({ form, handleChange }) {
    return (
        <div className="bg-card border border-app rounded-2xl p-5 mt-6">
            <h3 className="uppercase tracking-widest text-xs font-semibold text-muted">
                Description
            </h3>

            <div className="border-b border-app my-4" />

            <div className="grid gap-4">

                <Input
                    label="Product"
                    name="product"
                    value={form.product}
                    onChange={handleChange}
                    placeholder="Interested Product"
                />

                <TextArea
                    label="Message"
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    placeholder="Enter lead description..."
                />
            </div>
        </div>
    )
}
