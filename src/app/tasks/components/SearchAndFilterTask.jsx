"use client";

import React, { useState } from "react";
import { Search, Filter, Plus, ChevronDown } from "lucide-react";

export default function SearchAndFilterTask({
  search,
  setSearch,

  relatedTo,
  setRelatedTo,

  assignedTo,
  setAssignedTo,

  priority,
  setPriority,

  onAddTask,
}) {
  const [searchType, setSearchType] = useState("title");

  // ============================================================
  // HANDLE SEARCH TYPE CHANGE
  // ============================================================

  const handleSearchTypeChange = (e) => {
    const value = e.target.value;

    setSearchType(value);

    // Clear all search values when changing search type
    setSearch("");
    setRelatedTo("");
    setAssignedTo("");
  };

  // ============================================================
  // HANDLE SEARCH
  // ============================================================

  const handleSearchChange = (e) => {
    const value = e.target.value;

    if (searchType === "title") {
      setSearch(value);
    }

    if (searchType === "relatedTo") {
      setRelatedTo(value);
    }

    if (searchType === "assignedTo") {
      setAssignedTo(value);
    }
  };

  // ============================================================
  // CURRENT SEARCH VALUE
  // ============================================================

  const currentSearchValue =
    searchType === "title"
      ? search
      : searchType === "relatedTo"
        ? relatedTo
        : assignedTo;

  // ============================================================
  // CURRENT PLACEHOLDER
  // ============================================================

  const placeholder =
    searchType === "title"
      ? "Search task title..."
      : searchType === "relatedTo"
        ? "Search related lead..."
        : "Search assigned to...";

  return (
    <div
      className="
                flex
                flex-wrap
                items-center
                gap-2
                sm:gap-3
            "
    >
      {/* ==================================================
                ADD TASK
            ================================================== */}

      <button
        type="button"
        onClick={onAddTask}
        className="
                    flex
                    h-9
                    items-center
                    justify-center
                    gap-2
                    rounded-lg
                    px-3
                    text-sm
                    btn-primary
                "
      >
        <Plus size={16} />

        <span>Add Task</span>
      </button>

      {/* ==================================================
                PRIORITY FILTER
            ================================================== */}

      <div className="relative">
        <Filter
          size={15}
          className="
                        pointer-events-none
                        absolute
                        left-3
                        top-1/2
                        -translate-y-1/2
                        opacity-60
                    "
        />

        <select
          value={priority}
          onChange={(e) => {
            setPriority(e.target.value);
          }}
          className="
                        h-9
                        appearance-none
                        rounded-lg
                        border
                        border-app
                        bg-app
                        pl-9
                        pr-8
                        text-sm
                        outline-none
                        focus:ring-2
                        focus:ring-blue-500
                    "
        >
          <option value="">All Leads</option>

          <option value="low">Low</option>

          <option value="medium">Medium</option>

          <option value="high">High</option>

          <option value="urgent">Urgent</option>
        </select>
      </div>

      {/* ==================================================
                SEARCH TYPE + SEARCH INPUT
            ================================================== */}

      <div
        className="
                    flex
                    w-full
                    sm:w-auto
                    items-center
                    gap-2
                "
      >
        {/* ==================================================
                    SEARCH TYPE DROPDOWN
                ================================================== */}

        <div className="relative shrink-0">
          <Search
            size={15}
            className="
                            pointer-events-none
                            absolute
                            left-3
                            top-1/2
                            -translate-y-1/2
                            opacity-60
                        "
          />

          <select
            value={searchType}
            onChange={handleSearchTypeChange}
            className="
                            h-9
                            w-44
                            appearance-none
                            rounded-lg
                            border
                            border-app
                            bg-app
                            pl-9
                            pr-8
                            text-sm
                            outline-none
                            focus:ring-2
                            focus:ring-blue-500
                        "
          >
            <option value="title">Search by Title</option>

            <option value="relatedTo">Search by Related Lead</option>

            <option value="assignedTo">Search by Assigned To</option>
          </select>

          <ChevronDown
            size={15}
            className="
                            pointer-events-none
                            absolute
                            right-3
                            top-1/2
                            -translate-y-1/2
                            opacity-60
                        "
          />
        </div>

        {/* ==================================================
                    SEARCH INPUT
                ================================================== */}

        <div
          className="
                        relative
                        w-full
                        sm:w-52
                    "
        >
          <Search
            size={16}
            className="
                            pointer-events-none
                            absolute
                            left-3
                            top-1/2
                            -translate-y-1/2
                            opacity-60
                        "
          />

          <input
            type="text"
            value={currentSearchValue}
            onChange={handleSearchChange}
            placeholder={placeholder}
            className="
                            h-9
                            w-full
                            rounded-lg
                            border
                            border-app
                            bg-app
                            pl-10
                            pr-3
                            text-sm
                            outline-none
                            focus:ring-2
                            focus:ring-blue-500
                        "
          />
        </div>
      </div>
    </div>
  );
}
