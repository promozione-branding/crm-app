"use client";

export default function TextArea({
    label,
    name,
    value,
    onChange,
    placeholder,
    rows = 5,
}) {
    return (
        <div className="space-y-2">
            <label className="text-xs font-medium text-app">
                {label}
            </label>

            <textarea
                name={name}
                rows={rows}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className="w-full rounded-xl border mt-0.5 text-sm border-app bg-app px-4 py-3 outline-none text-app placeholder:text-muted resize-none"
            />
        </div>
    );
}