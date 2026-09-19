// src/app/leads/components/LeadsFilter.jsx

'use client';

import React, { useState, useEffect } from 'react';
import { Filter, Calendar, ChevronRight, X } from 'lucide-react';

export const stageOptions = [
    { label: 'New', value: 'new' },
    { label: 'Contacted', value: 'contacted' },
    { label: 'Qualified', value: 'qualified' },
    { label: 'Proposal Sent', value: 'proposal_sent' },
    { label: 'Negotiation', value: 'negotiation' },
    { label: 'Won', value: 'won' },
    { label: 'Lost', value: 'lost' },
];

export const dateOptions = [
    { label: 'Today', value: 'today' },
    { label: 'Yesterday', value: 'yesterday' },
    { label: 'Last 3 Days', value: 'last_3_days' },
    { label: 'Last 7 Days', value: 'last_7_days' },
    { label: 'Last 14 Days', value: 'last_14_days' },
    { label: 'Custom Range', value: 'custom' },
];

export default function LeadsFilter({
    selectedStage = [],
    setSelectedStage,
    selectedDate,
    setSelectedDate,
    customStartDate,
    setCustomStartDate,
    customEndDate,
    setCustomEndDate,
    setPage,
    filterOpen,
    setFilterOpen,
    filterRef,
}) {
    const [draftStage, setDraftStage] = useState(Array.isArray(selectedStage) ? selectedStage : []);
    const [draftDate, setDraftDate] = useState(selectedDate || '');
    const [draftStartDate, setDraftStartDate] = useState(customStartDate || '');
    const [draftEndDate, setDraftEndDate] = useState(customEndDate || '');

    const [showCustomDate, setShowCustomDate] = useState(false);

    useEffect(() => {
        if (filterOpen) {
            setDraftStage(Array.isArray(selectedStage) ? selectedStage : []);
            setDraftDate(selectedDate || '');
            setDraftStartDate(customStartDate || '');
            setDraftEndDate(customEndDate || '');
            setShowCustomDate(selectedDate === 'custom');
        }
    }, [filterOpen, selectedStage, selectedDate, customStartDate, customEndDate]);

    const stageLabels = (Array.isArray(selectedStage) ? selectedStage : []).map((val) => stageOptions.find((o) => o.value === val)?.label).filter(Boolean);

    const selectedDateLabel = dateOptions.find((option) => option.value === selectedDate)?.label;

    const buttonLabel =
        stageLabels.length > 0
            ? stageLabels.length === 1
                ? stageLabels[0]
                : `${stageLabels[0]} +${stageLabels.length - 1}`
            : selectedDateLabel
              ? selectedDateLabel
              : 'Filter';

    const toggleStage = (value) => {
        setDraftStage((prev) => (prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]));
    };

    const clearStageFilter = () => {
        setDraftStage([]);
    };

    const handleDateFilter = (date) => {
        if (date === 'custom') {
            setShowCustomDate(true);
            setDraftDate('custom');
            return;
        }

        setDraftDate(date);
        setShowCustomDate(false);
        setDraftStartDate('');
        setDraftEndDate('');
    };

    const clearDateFilter = () => {
        setDraftDate('');
        setShowCustomDate(false);
        setDraftStartDate('');
        setDraftEndDate('');
    };

    const handleApply = () => {
        if (draftDate === 'custom' && (!draftStartDate || !draftEndDate)) {
            return;
        }

        setSelectedStage(draftStage);
        setSelectedDate(draftDate);
        setCustomStartDate?.(draftStartDate);
        setCustomEndDate?.(draftEndDate);

        setPage(1);
        setFilterOpen(false);
    };

    const handleReset = () => {
        setDraftStage([]);
        setDraftDate('');
        setDraftStartDate('');
        setDraftEndDate('');
        setShowCustomDate(false);
    };

    const applyDisabled = draftDate === 'custom' && (!draftStartDate || !draftEndDate);

    return (
        <div className="relative" ref={filterRef}>
            {/* Filter Button */}
            <button
                type="button"
                onClick={() => setFilterOpen((prev) => !prev)}
                className="border-app hover-app flex h-10 w-full items-center justify-center gap-2 rounded-lg border px-3 text-sm transition sm:w-auto"
            >
                <Filter size={16} />
                <span>{buttonLabel}</span>
            </button>

            {/* Dropdown */}
            {filterOpen && (
                <div className="border-app bg-app absolute top-full right-0 z-50 mt-1 max-h-[80vh] w-72 max-w-[calc(100vw-1.5rem)] overflow-y-auto rounded-lg border p-3 shadow-lg">
                    {/* =================================================
                        APPLY / RESET — NOW AT THE TOP
                    ================================================= */}
                    <div className="mb-3 flex gap-2">
                        <button type="button" onClick={handleReset} className="border-app hover-app flex-1 rounded-md border py-2 text-xs transition">
                            Reset
                        </button>

                        <button
                            type="button"
                            onClick={handleApply}
                            disabled={applyDisabled}
                            className={`flex-1 rounded-md py-2 text-xs font-medium text-white transition ${
                                applyDisabled ? 'cursor-not-allowed bg-blue-600 opacity-50' : 'bg-blue-600 hover:opacity-90'
                            }`}
                        >
                            Apply Filter
                        </button>
                    </div>

                    {/* Divider */}
                    <div className="border-app mb-3 border-t" />

                    {/* =================================================
                        FILTER BY STAGE — MULTI SELECT
                    ================================================= */}
                    <div className="mb-3">
                        <div className="mb-2 flex items-center justify-between">
                            <p className="text-xs font-semibold tracking-wide uppercase opacity-60">Filter by Stage</p>

                            {draftStage.length > 0 && (
                                <button type="button" onClick={clearStageFilter} className="flex items-center gap-1 text-[11px] text-blue-500 hover:opacity-80">
                                    <X size={11} />
                                    Clear
                                </button>
                            )}
                        </div>

                        <div className="flex flex-wrap gap-1.5">
                            {stageOptions.map((option) => {
                                const active = draftStage.includes(option.value);

                                return (
                                    <button
                                        key={option.value}
                                        type="button"
                                        onClick={() => toggleStage(option.value)}
                                        className={`rounded-full border px-2.5 py-1 text-[11px] font-medium transition ${
                                            active ? 'border-blue-500/40 bg-blue-500/15 text-blue-500' : 'border-app hover-app opacity-70'
                                        }`}
                                    >
                                        {option.label}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Divider */}
                    <div className="border-app my-3 border-t" />

                    {/* =================================================
                        FILTER BY DATE
                    ================================================= */}
                    <div>
                        <div className="mb-2 flex items-center justify-between">
                            <p className="text-xs font-semibold tracking-wide uppercase opacity-60">Filter by Date</p>

                            {draftDate && (
                                <button type="button" onClick={clearDateFilter} className="flex items-center gap-1 text-[11px] text-blue-500 hover:opacity-80">
                                    <X size={11} />
                                    Clear
                                </button>
                            )}
                        </div>

                        <div className="space-y-1">
                            {dateOptions.map((option) => (
                                <button
                                    key={option.value}
                                    type="button"
                                    onClick={() => handleDateFilter(option.value)}
                                    className={`hover-app flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-sm transition ${
                                        draftDate === option.value ? 'bg-surface font-medium' : ''
                                    }`}
                                >
                                    <span className="flex items-center gap-2">
                                        <Calendar size={13} className="opacity-50" />
                                        {option.label}
                                    </span>

                                    {option.value === 'custom' && <ChevronRight size={14} className="opacity-50" />}
                                </button>
                            ))}
                        </div>

                        {/* =================================================
                            CUSTOM DATE RANGE
                        ================================================= */}
                        {showCustomDate && (
                            <div className="border-app bg-surface mt-2 space-y-3 rounded-lg border p-3">
                                <div>
                                    <label className="mb-1 block text-[11px] font-medium opacity-60">Start Date</label>
                                    <input
                                        type="date"
                                        value={draftStartDate || ''}
                                        onChange={(e) => setDraftStartDate(e.target.value)}
                                        className="border-app bg-app text-app w-full rounded-md border px-2 py-1.5 text-sm"
                                    />
                                </div>

                                <div>
                                    <label className="mb-1 block text-[11px] font-medium opacity-60">End Date</label>
                                    <input
                                        type="date"
                                        value={draftEndDate || ''}
                                        onChange={(e) => setDraftEndDate(e.target.value)}
                                        className="border-app bg-app text-app w-full rounded-md border px-2 py-1.5 text-sm"
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
