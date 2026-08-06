"use client";

export default function Input({
    name,   
    label,
    required = false,
    type = "text",
    value,
    onChange,
    placeholder,
    error,
    leftElement,
}) {
    return (
        <div className="space-y-2">
            {label && (
                <label className="text-xs font-medium text-app">
                    {label}

                    {required && (
                        <span className="text-red-500 ml-1">*</span>
                    )}
                </label>
            )}

            <div className="flex rounded-lg border border-app bg-app overflow-hidden mt-0.5 text-sm">

                {leftElement && (
                    <div className="px-4 flex items-center border-r border-app text-app">
                        {leftElement}
                    </div>
                )}

                <input
                    type={type}
                    value={value}
                    name={name}
                    onChange={onChange}
                    placeholder={placeholder}
                    className="w-full h-9 px-4 bg-transparent text-app outline-none placeholder:text-muted"
                />

            </div>

            {error && (
                <p className="text-red-500 text-xs">
                    {error}
                </p>
            )}
        </div>
    );
}