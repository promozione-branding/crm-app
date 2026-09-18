// src/components/user/ui/TextArea.jsx

'use client';

export default function TextArea({ label, name, value, onChange, placeholder, rows = 5 }) {
    return (
        <div className="space-y-2">
            <label className="text-app text-xs font-medium">{label}</label>

            <textarea
                name={name}
                rows={rows}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className="border-app bg-app text-app placeholder:text-muted mt-0.5 w-full resize-none rounded-xl border px-4 py-3 text-sm outline-none"
            />
        </div>
    );
}
