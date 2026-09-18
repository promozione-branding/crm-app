// src/app/leads/components/LeadsFilter.jsx

'use client';

import React from 'react';
import { Filter } from 'lucide-react';

export const stageOptions = [
    { label: 'New', value: 'new' },
    { label: 'Contacted', value: 'contacted' },
    { label: 'Qualified', value: 'qualified' },
    {
        label: 'Proposal Sent',
        value: 'proposal_sent',
    },
    {
        label: 'Negotiation',
        value: 'negotiation',
    },
    { label: 'Won', value: 'won' },
    { label: 'Lost', value: 'lost' },
];

export default function LeadsFilter({ selectedStage, setSelectedStage, setPage, filterOpen, setFilterOpen, filterRef }) {
    const selectedStageLabel = stageOptions.find((option) => option.value === selectedStage)?.label;

    const handleStageFilter = (stage) => {
        setSelectedStage(stage);
        setPage(1);
        setFilterOpen(false);
    };

    const clearFilter = () => {
        setSelectedStage('');
        setPage(1);
        setFilterOpen(false);
    };

    return (
        <div className="relative" ref={filterRef}>
            {/* Filter Button */}
            <button
                type="button"
                onClick={() => setFilterOpen((prev) => !prev)}
                className="border-app hover-app flex h-10 w-full items-center justify-center gap-2 rounded-lg border px-3 text-sm transition sm:w-auto"
            >
                <Filter size={16} />

                <span>{selectedStageLabel || 'Filter'}</span>
            </button>

            {/* Dropdown */}
            {filterOpen && (
                <div className="border-app bg-app absolute top-full right-0 z-50 mt-1 w-52 max-w-[calc(100vw-1.5rem)] rounded-lg border p-1 shadow-lg">
                    {/* All Stages */}
                    <button
                        type="button"
                        onClick={clearFilter}
                        className={`hover-app w-full rounded-md px-3 py-2 text-left text-sm transition ${!selectedStage ? 'bg-surface font-medium' : ''} `}
                    >
                        All Stages
                    </button>

                    {/* Stage Options */}
                    {stageOptions.map((option) => (
                        <button
                            key={option.value}
                            type="button"
                            onClick={() => handleStageFilter(option.value)}
                            className={`hover-app w-full rounded-md px-3 py-2 text-left text-sm transition ${selectedStage === option.value ? 'bg-surface font-medium' : ''} `}
                        >
                            {option.label}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
