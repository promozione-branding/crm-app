"use client";

import { ChevronDown } from "lucide-react";

export default function SelectInput({
    name,
    disabled,
    label,
    required = false,
    value,
    onChange,
    options = [],
}) {
    return (
        <div className="space-y-2">

            <label className="text-xs font-medium text-app">
                {label}

                {required && (
                    <span className="text-red-500 ml-1">*</span>
                )}
            </label>

            <div className="relative mt-0.5">

                <select
                    disabled={disabled}
                    value={value}
                    onChange={onChange}
                    name={name}
                    className="w-full h-9 rounded-lg border border-app bg-app px-4 appearance-none text-app outline-none text-sm"
                >
                    <option value="">
                        Select
                    </option>

                    {options.map((item) => (
                        <option
                            key={item.value}
                            value={item.value}
                        >
                            {item.label}
                        </option>
                    ))}
                </select>

                <ChevronDown
                    size={18}
                    className="absolute right-3 top-2.5 text-muted pointer-events-none"
                />

            </div>

        </div>
    );
}