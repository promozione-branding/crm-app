"use client";

import { ChevronDown } from "lucide-react";

export default function SelectInput({
    label,
    icon: Icon,
    options = [],
    required = false,
    error,
    className = "",
    ...props
}) {
    return (
        <div className={className}>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
                {label}
                {required && (
                    <span className="ml-1 text-red-500">*</span>
                )}
            </label>

            <div className="relative group">
                {Icon && (
                    <Icon
                        size={18}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 transition-colors duration-200 group-focus-within:text-blue-500"
                    />
                )}

                <select
                    {...props}
                    className={`appearance-none w-full rounded-lg border bg-white py-2.5 ${Icon ? "pl-10" : "pl-3"
                        } pr-10 outline-none transition
                    border-gray-300
                    focus:border-blue-300
                    focus:ring-1
                    focus:ring-blue-300`}
                >
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
                    className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 transition-colors duration-200 group-focus-within:text-blue-500"
                />
            </div>

            {error && (
                <p className="mt-1 text-xs text-red-500">
                    {error}
                </p>
            )}
        </div>
    );
}