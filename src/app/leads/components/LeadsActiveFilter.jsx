// src/app/leads/components/LeadsActiveFilter.jsx

'use client';

import React from 'react';

export default function LeadsActiveFilter({
    selectedStage,          // 👈 now an array
    selectedStageLabels,    // 👈 array of labels
    selectedDate,
    selectedDateLabel,
    customStartDate,
    customEndDate,
    onClear,
}) {
    const stageChips = Array.isArray(selectedStage) ? selectedStage : [];
    const stageLabels = Array.isArray(selectedStageLabels) ? selectedStageLabels : [];

    const hasStage = stageChips.length > 0;
    const hasDate = !!selectedDate;

    if (!hasStage && !hasDate) {
        return null;
    }

    // Build date label
    const dateLabel =
        selectedDate === 'custom' && customStartDate && customEndDate
            ? `${customStartDate} → ${customEndDate}`
            : selectedDateLabel || selectedDate;

    return (
        <div className="mb-4 flex flex-wrap items-center gap-2">
            <span className="text-xs opacity-60">Filtered by:</span>

            {/* Stage chips */}
            {stageChips.map((value, i) => (
                <span
                    key={value}
                    className="rounded-full bg-blue-500/10 px-2.5 py-1 text-xs text-blue-500 capitalize"
                >
                    {stageLabels[i] || value}
                </span>
            ))}

            {/* Date chip */}
            {hasDate && (
                <span className="rounded-full bg-purple-500/10 px-2.5 py-1 text-xs text-purple-400">
                    {dateLabel}
                </span>
            )}

            {/* Clear all */}
            <button
                type="button"
                onClick={onClear}
                className="rounded-full border border-app px-2.5 py-1 text-xs opacity-70 transition hover:opacity-100"
            >
                Clear all ×
            </button>
        </div>
    );
}