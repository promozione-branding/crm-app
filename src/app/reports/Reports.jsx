"use client";

import React from "react";
import { FileBarChart2 } from "lucide-react";

export default function Reports() {
  return (
    <div className="bg-surface text-app min-h-[calc(100vh-64px)] p-6">

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-base font-bold">CRM</h1>
        <p className="text-xs opacity-70">
          Reports & Analytics
        </p>
      </div>

      {/* Empty State */}
      <div className="bg-app border border-app rounded-2xl min-h-[400px] flex items-center justify-center">

        <div className="text-center max-w-md">

          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-blue-500/10">
            <FileBarChart2
              size={40}
              className="text-blue-500"
            />
          </div>

          <h2 className="text-xl font-semibold mb-2">
            No Reports Found
          </h2>

          <p className="text-xs opacity-70 leading-6">
            You haven't generated any reports yet.
            Once your CRM starts collecting data, your sales,
            leads, and performance reports will appear here.
          </p>

          <button className="mt-6 px-5 h-10 rounded-xl btn-primary transition">
            Generate Report
          </button>

        </div>

      </div>

    </div>
  );
}