// src/components/user/ui/SelectInput.jsx

'use client';

import { ChevronDown } from 'lucide-react';

export default function SelectInput({ name, disabled, label, required = false, value, onChange, options = [] }) {
    return (
        <div className="space-y-2">
            <label className="text-app text-xs font-medium">
                {label}

                {required && <span className="ml-1 text-red-500">*</span>}
            </label>

            <div className="relative mt-0.5">
                <select
                    disabled={disabled}
                    value={value}
                    onChange={onChange}
                    name={name}
                    className="border-app bg-app text-app h-9 w-full appearance-none rounded-lg border px-4 text-sm outline-none"
                >
                    <option value="">Select</option>

                    {options.map((item) => (
                        <option key={item.value} value={item.value}>
                            {item.label}
                        </option>
                    ))}
                </select>

                <ChevronDown size={18} className="text-muted pointer-events-none absolute top-2.5 right-3" />
            </div>
        </div>
    );
}
