// src/app/leads/components/LeadsActiveFilter.jsx

'use client';

import React from 'react';

export default function LeadsActiveFilter({ selectedStage, selectedStageLabel, onClear }) {
    if (!selectedStage) {
        return null;
    }

    return (
        <div
            className="
                mb-4
                flex
                flex-wrap
                items-center
                gap-2
            "
        >
            <span className="text-xs opacity-60">Filtered by:</span>

            <button
                type="button"
                onClick={onClear}
                className="
                    px-2.5
                    py-1
                    rounded-full
                    text-xs
                    bg-blue-500/10
                    text-blue-500
                    hover:opacity-80
                    transition
                "
            >
                {selectedStageLabel} ×
            </button>
        </div>
    );
}
