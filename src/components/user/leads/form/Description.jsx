// src/components/user/leads/form/Description.jsx

import React from 'react';
import Input from '../../ui/Input';
import TextArea from '../../ui/TextArea';

export default function Description({ form, handleChange }) {
    return (
        <div className="bg-card border-app mt-6 rounded-2xl border p-5">
            <h3 className="text-muted text-xs font-semibold tracking-widest uppercase">Description</h3>

            <div className="border-app my-4 border-b" />

            <div className="grid gap-4">
                <Input label="Product" name="product" value={form.product} onChange={handleChange} placeholder="Interested Product" />

                <TextArea label="Message" name="message" value={form.message} onChange={handleChange} placeholder="Enter lead description..." />
            </div>
        </div>
    );
}
