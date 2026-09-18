// src/components/user/ui/Input.jsx

'use client';

export default function Input({ name, label, required = false, type = 'text', value, onChange, placeholder, error, leftElement, ...rest }) {
    return (
        <div className="space-y-2">
            {label && (
                <label className="text-app text-xs font-medium">
                    {label}

                    {required && <span className="ml-1 text-red-500">*</span>}
                </label>
            )}

            <div className="border-app bg-app mt-0.5 flex overflow-hidden rounded-lg border text-sm">
                {leftElement && <div className="border-app text-app flex items-center border-r px-4">{leftElement}</div>}

                <input
                    type={type}
                    value={value}
                    name={name}
                    onChange={onChange}
                    placeholder={placeholder}
                    className="text-app placeholder:text-muted h-9 w-full bg-transparent px-4 outline-none"
                    {...rest}
                />
            </div>

            {error && <p className="text-xs text-red-500">{error}</p>}
        </div>
    );
}
