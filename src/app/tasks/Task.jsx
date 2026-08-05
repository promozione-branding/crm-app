"use client";

import React, { useState } from "react";
import { Search, Filter, Plus, MoreVertical, ChevronDown, ChevronUp } from "lucide-react";

const tasks = [
    {
        task: "Follow up with John",
        assigned: "Alex",
        lead: "John Smith",
        priority: "High",
        status: "Pending",
        due: "Aug 08, 2026",
        created: "Aug 05, 2026",
    },
    {
        task: "Send quotation",
        assigned: "Sarah",
        lead: "David Miller",
        priority: "Medium",
        status: "Completed",
        due: "Aug 06, 2026",
        created: "Aug 04, 2026",
    },
    {
        task: "Demo call",
        assigned: "Mike",
        lead: "Robert Wilson",
        priority: "Low",
        status: "In Progress",
        due: "Aug 10, 2026",
        created: "Aug 03, 2026",
    },
];


export default function Task() {

    const [page, setPage] = useState(1);

    return (
        <div className="bg-surface text-app min-h-[calc(100vh-64px)] p-6">

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold">
                        CRM
                    </h1>

                    <p className="text-sm opacity-70">
                        Manage your tasks
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    {/* Search */}
                    <div className="relative">
                        <Search
                            size={18}
                            className="absolute left-3 top-1/2 -translate-y-1/2 opacity-60"
                        />

                        <input
                            placeholder="Search leads..."
                            className="h-10 w-60 rounded-lg border border-app bg-app bg-transparent pl-10 pr-3 outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    {/* Filter */}
                    <button
                        className="h-10 px-4 rounded-lg border border-app hover-app flex items-center gap-2 transition"
                    >
                        <Filter size={18} />
                        Filter
                    </button>

                    {/* Add Lead */}
                    <button
                        className="h-10 px-4 rounded-lg btn-primary flex items-center gap-2 transition"
                    >
                        <Plus size={18} />
                        Add Tasks
                    </button>
                </div>
            </div>

            {/* Table Card */}
            <div className=" rounded-2xl border border-app shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="border-b border-app bg-app">
                            <tr className="text-left">
                                <th className="px-6 py-4 font-semibold">
                                    <div className="flex justify-center items-center gap-2">
                                        Task Name
                                        <span className="flex flex-col">
                                            <ChevronUp size={10} />
                                            <ChevronDown size={10} />
                                        </span>
                                    </div>
                                </th>

                                <th className="px-6 py-4 font-semibold">
                                    <div className="flex justify-center items-center gap-2">
                                        Assigned To
                                        <span className="flex flex-col">
                                            <ChevronUp size={10} />
                                            <ChevronDown size={10} />
                                        </span>
                                    </div>
                                </th>

                                <th className="px-6 py-4 font-semibold">
                                    <div className="flex justify-center items-center gap-2">
                                        Related Lead
                                        <span className="flex flex-col">
                                            <ChevronUp size={10} />
                                            <ChevronDown size={10} />
                                        </span>
                                    </div>
                                </th>

                                <th className="px-6 py-4 font-semibold">
                                    <div className="flex justify-center items-center gap-2">
                                        Priority
                                        <span className="flex flex-col">
                                            <ChevronUp size={10} />
                                            <ChevronDown size={10} />
                                        </span>
                                    </div>
                                </th>

                                <th className="px-6 py-4 font-semibold">
                                    <div className="flex justify-center items-center gap-2">
                                        Status
                                        <span className="flex flex-col">
                                            <ChevronUp size={10} />
                                            <ChevronDown size={10} />
                                        </span>
                                    </div>
                                </th>

                                <th className="px-6 py-4 font-semibold">
                                    <div className="flex justify-center items-center gap-2">
                                        Due Date
                                        <span className="flex flex-col">
                                            <ChevronUp size={10} />
                                            <ChevronDown size={10} />
                                        </span>
                                    </div>
                                </th>

                                <th className="px-6 py-4 font-semibold">
                                    <div className="flex justify-center items-center gap-2">
                                        Created At
                                        <span className="flex flex-col">
                                            <ChevronUp size={10} />
                                            <ChevronDown size={10} />
                                        </span>
                                    </div>
                                </th>

                                <th className="px-6 py-4 font-semibold">
                                    Action
                                </th>
                            </tr>
                        </thead>

                        <tbody>

                            {tasks.map((item, index) => (
                                <tr
                                    key={index}
                                    className="border-b border-app hover-app transition bg-surface"
                                >

                                    <td className="px-6 py-4 font-medium">
                                        {item.task}
                                    </td>

                                    <td className="px-6 py-4 font-medium">
                                        {item.assigned}
                                    </td>

                                    <td className="px-6 py-4">
                                        {item.lead}
                                    </td>

                                    <td className="px-6 py-4">
                                        <span className={`px-3 py-1 rounded-full text-xs
                                            ${item.priority === "High"
                                                ? "bg-red-500/10 text-red-500"
                                                :
                                                item.priority === "Medium"
                                                    ? "bg-yellow-500/10 text-yellow-500"
                                                    :
                                                    "bg-green-500/10 text-green-500"
                                            }
                                        `}>
                                            {item.priority}
                                        </span>
                                    </td>

                                    <td className="px-6 py-4">
                                        <span className="px-3 py-1 rounded-full text-xs bg-blue-500/10 text-blue-500">
                                            {item.status}
                                        </span>
                                    </td>

                                    <td className="px-6 py-4">
                                        {item.due}
                                    </td>

                                    <td className="px-6 py-4">
                                        {item.created}
                                    </td>

                                    <td className="px-6 py-4">
                                        <button className="w-8 h-8 rounded-lg btn-primary flex items-center justify-center">
                                            <MoreVertical size={18} />
                                        </button>
                                    </td>

                                </tr>
                            ))}

                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="flex items-center justify-between px-6 py-4 bg-app">

                    <p className="text-sm opacity-70">
                        Showing 1-10 of 100 leads
                    </p>


                    <div className="flex gap-2 items-center">

                        <button
                            onClick={() => setPage(Math.max(1, page - 1))}
                            className="px-3 h-9 rounded-lg border border-app hover-app"
                        >
                            Prev
                        </button>


                        {[1].map(num => (
                            <button
                                key={num}
                                onClick={() => setPage(num)}
                                className={`px-3 h-8 rounded-lg ${page === num
                                    ? "bg-blue-600 text-white"
                                    : "border border-app hover-app"
                                    }`}
                            >
                                {num}
                            </button>
                        ))}


                        <button
                            onClick={() => setPage(page + 1)}
                            className="px-3 h-9 rounded-lg border border-app hover-app"
                        >
                            Next
                        </button>

                    </div>

                </div>
            </div>
        </div>
    );
}