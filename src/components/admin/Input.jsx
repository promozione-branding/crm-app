// src/components/admin/Input.jsx

'use client';

export default function Input({ label, icon: Icon, required = false, error, className = '', ...props }) {
    return (
        <div className={className}>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
                {label}
                {required && <span className="ml-1 text-red-500">*</span>}
            </label>

            <div className="group relative">
                {Icon && (
                    <Icon
                        size={18}
                        className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400 transition-colors duration-200 group-focus-within:text-blue-500"
                    />
                )}

                <input
                    {...props}
                    className={`w-full rounded-lg border bg-white py-2.5 ${Icon ? 'pl-10' : 'pl-3'} border-gray-300 pr-3 transition outline-none focus:border-blue-300 focus:ring-1 focus:ring-blue-300`}
                />
            </div>

            {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
        </div>
    );
}
