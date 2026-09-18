// src/app/tasks/edit/[id]/components/TaskActions.jsx

'use client';

import React from 'react';
import { Loader2, Save } from 'lucide-react';

export default function TaskActions({ saving, onCancel }) {
    return (
        <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-end">
            {/* =================================================
                CANCEL
            ================================================= */}

            <button
                type="button"
                onClick={onCancel}
                disabled={saving}
                className="border-app w-full rounded-lg border px-5 py-2.5 text-sm font-medium transition hover:opacity-80 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
            >
                Cancel
            </button>

            {/* =================================================
                UPDATE
            ================================================= */}

            <button
                type="submit"
                disabled={saving}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
            >
                {saving ? (
                    <>
                        <Loader2 size={17} className="animate-spin" />
                        Updating...
                    </>
                ) : (
                    <>
                        <Save size={17} />
                        Update Task
                    </>
                )}
            </button>
        </div>
    );
}
