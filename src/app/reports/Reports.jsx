"use client";

import React from "react";
import { FileBarChart2 } from "lucide-react";

export default function Reports() {
  return (
    <div className="bg-surface text-app min-h-[calc(100vh-64px)] p-6">

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold">CRM</h1>
        <p className="text-sm opacity-70">
          Reports & Analytics
        </p>
      </div>

      {/* Empty State */}
      <div className="bg-app border border-app rounded-2xl min-h-[500px] flex items-center justify-center">

        <div className="text-center max-w-md">

          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-blue-500/10">
            <FileBarChart2
              size={40}
              className="text-blue-500"
            />
          </div>

          <h2 className="text-2xl font-semibold mb-2">
            No Reports Found
          </h2>

          <p className="text-sm opacity-70 leading-6">
            You haven't generated any reports yet.
            Once your CRM starts collecting data, your sales,
            leads, and performance reports will appear here.
          </p>

          <button className="mt-6 px-5 h-11 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition">
            Generate Report
          </button>

        </div>

      </div>

    </div>
  );
}