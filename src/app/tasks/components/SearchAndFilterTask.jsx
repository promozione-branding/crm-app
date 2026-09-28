// src/app/tasks/components/SearchAndFilterTask.jsx

'use client';

import React, { useState } from 'react';
import { Search, Filter, Plus, ChevronDown, ArrowUpDown } from 'lucide-react';
import MultiSelect from './MultiSelect';

const STAGE_OPTIONS = [
    { value: 'new', label: 'New' },
    { value: 'contacted', label: 'Contacted' },
    { value: 'qualified', label: 'Qualified' },
    { value: 'proposal_sent', label: 'Proposal Sent' },
    { value: 'negotiation', label: 'Negotiation' },
    { value: 'won', label: 'Won' },
    { value: 'lost', label: 'Lost' },
];

export default function SearchAndFilterTask({
    search,
    setSearch,

    relatedTo,
    setRelatedTo,

    assignedTo,
    setAssignedTo,

    priority,
    setPriority,

    sortBy,
    setSortBy,

    stage,
    setStage,

    onAddTask,
}) {
    const [searchType, setSearchType] = useState('title');

    // ============================================================
    // HANDLE SEARCH TYPE CHANGE
    // ============================================================

    const handleSearchTypeChange = (e) => {
        const value = e.target.value;

        setSearchType(value);

        setSearch('');
        setRelatedTo('');
        setAssignedTo('');
    };

    // ============================================================
    // HANDLE SEARCH
    // ============================================================

    const handleSearchChange = (e) => {
        const value = e.target.value;

        if (searchType === 'title') setSearch(value);
        if (searchType === 'relatedTo') setRelatedTo(value);
        if (searchType === 'assignedTo') setAssignedTo(value);
    };

    // ============================================================
    // CURRENT SEARCH VALUE
    // ============================================================

    const currentSearchValue =
        searchType === 'title' ? search : searchType === 'relatedTo' ? relatedTo : assignedTo;

    const placeholder =
        searchType === 'title'
            ? 'Search task title...'
            : searchType === 'relatedTo'
              ? 'Search related lead...'
              : 'Search assigned to...';

    // Shared class for consistent height + border
    const selectClass =
        'border-app bg-app h-9 appearance-none rounded-lg border text-sm outline-none focus:ring-2 focus:ring-blue-500';

    return (
        <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:gap-3">
            {/* ============================================================
                ROW 1 — Add Task + Priority + Stage
            ============================================================ */}

            <div className="flex w-full items-center gap-2 sm:w-auto sm:gap-3">
                

                {/* PRIORITY FILTER */}
                <div className="relative min-w-0 flex-1 sm:flex-none">
                    <Filter
                        size={15}
                        className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 opacity-60"
                    />

                    <select
                        value={priority}
                        onChange={(e) => setPriority(e.target.value)}
                        className={`${selectClass} w-full pr-8 pl-9 sm:w-auto`}
                    >
                        <option value="">All Priorities</option>
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                        <option value="urgent">Urgent</option>
                    </select>
                </div>

                {/* STAGE MULTI-SELECT */}
                <div className="relative min-w-0 flex-1 sm:flex-none">
                    <MultiSelect
                        label="Stage"
                        placeholder="All Stages"
                        options={STAGE_OPTIONS}
                        selected={stage}
                        onChange={setStage}
                        width="w-full sm:w-52"
                    />
                </div>
            </div>

            {/* ============================================================
                ROW 2 — Sort + Search Type + Search Input
            ============================================================ */}

            <div className="flex w-full items-center gap-2 sm:w-auto sm:gap-3">
                {/* SORT BY */}
                <div className="relative min-w-0 flex-1 sm:flex-none">
                    <ArrowUpDown
                        size={15}
                        className="pointer-events-none absolute top-1/2 left-3 z-10 -translate-y-1/2 opacity-60"
                    />

                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className={`${selectClass} w-full pr-8 pl-9 sm:w-56`}
                    >
                        <option value="">Sort By</option>
                        <option value="leadCreatedAtAsc">Old First</option>
                        <option value="leadCreatedAtDesc">New First</option>
                        <option value="dueDate">Due Date</option>
                    </select>

                    <ChevronDown
                        size={15}
                        className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 opacity-60"
                    />
                </div>

                {/* SEARCH TYPE */}
                <div className="relative min-w-0 flex-1 sm:flex-none">
                    <Search
                        size={15}
                        className="pointer-events-none absolute top-1/2 left-3 z-10 -translate-y-1/2 opacity-60"
                    />

                    <select
                        value={searchType}
                        onChange={handleSearchTypeChange}
                        className={`${selectClass} w-full pr-8 pl-9 sm:w-44`}
                    >
                        <option value="title">By Title</option>
                        <option value="relatedTo">By Related Lead</option>
                        <option value="assignedTo">By Assigned To</option>
                    </select>

                    <ChevronDown
                        size={15}
                        className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 opacity-60"
                    />
                </div>

                {/* SEARCH INPUT */}
                <div className="relative min-w-0 flex-1 sm:w-52 sm:flex-none">
                    <Search
                        size={16}
                        className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 opacity-60"
                    />

                    <input
                        type="text"
                        value={currentSearchValue}
                        onChange={handleSearchChange}
                        placeholder={placeholder}
                        className="border-app bg-app h-9 w-full rounded-lg border pr-3 pl-10 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
            </div>
        </div>
    );
}