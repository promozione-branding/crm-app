// src/app/tasks/components/MultiSelect.jsx

'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Check, ChevronDown, X } from 'lucide-react';

export default function MultiSelect({
    label = 'Select',
    options = [],
    selected = [],
    onChange,
    placeholder = 'All',
    width = 'w-56',
}) {
    const [open, setOpen] = useState(false);
    const wrapperRef = useRef(null);

    // Close on outside click
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
                setOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const toggleValue = (value) => {
        const next = selected.includes(value)
            ? selected.filter((v) => v !== value)
            : [...selected, value];

        onChange?.(next);
    };

    const clearAll = (e) => {
        e.stopPropagation();
        onChange?.([]);
    };

    const summary =
        selected.length === 0
            ? placeholder
            : selected.length === 1
              ? options.find((o) => o.value === selected[0])?.label || selected[0]
              : `${selected.length} selected`;

    return (
        <div ref={wrapperRef} className={`relative shrink-0 ${width}`}>
            {/* TRIGGER */}
            <button
                type="button"
                onClick={() => setOpen((prev) => !prev)}
                className="border-app bg-app hover-app flex h-9 w-full items-center justify-between gap-2 rounded-lg border px-3 text-sm outline-none focus:ring-2 focus:ring-blue-500"
            >
                <span className="truncate">
                    <span className="opacity-60">{label}: </span>
                    <span className="font-medium">{summary}</span>
                </span>

                <div className="flex shrink-0 items-center gap-1">
                    {selected.length > 0 && (
                        <span
                            role="button"
                            tabIndex={0}
                            onClick={clearAll}
                            onKeyDown={(e) => e.key === 'Enter' && clearAll(e)}
                            className="hover-app rounded p-0.5"
                            title="Clear"
                        >
                            <X size={13} />
                        </span>
                    )}

                    <ChevronDown size={15} className={`transition-transform ${open ? 'rotate-180' : ''}`} />
                </div>
            </button>

            {/* DROPDOWN */}
            {open && (
                <div className="border-app bg-app absolute z-50 mt-1 max-h-64 w-full overflow-y-auto rounded-lg border shadow-lg">
                    {options.length === 0 ? (
                        <div className="px-3 py-2 text-xs opacity-60">No options</div>
                    ) : (
                        options.map((opt) => {
                            const isChecked = selected.includes(opt.value);

                            return (
                                <button
                                    key={opt.value}
                                    type="button"
                                    onClick={() => toggleValue(opt.value)}
                                    className="hover-app flex w-full items-center gap-2 px-3 py-2 text-left text-sm transition"
                                >
                                    <span
                                        className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border ${
                                            isChecked ? 'border-blue-600 bg-blue-600 text-white' : 'border-app'
                                        }`}
                                    >
                                        {isChecked && <Check size={12} />}
                                    </span>

                                    <span className="truncate">{opt.label}</span>
                                </button>
                            );
                        })
                    )}
                </div>
            )}
        </div>
    );
}