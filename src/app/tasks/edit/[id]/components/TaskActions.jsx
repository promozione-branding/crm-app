// src/app/tasks/edit/[id]/components/TaskActions.jsx

"use client";

import React from "react";
import {
    Loader2,
    Save,
} from "lucide-react";

export default function TaskActions({
    saving,
    onCancel,
}) {
    return (
        <div className="
            flex
            flex-col-reverse
            sm:flex-row
            sm:items-center
            sm:justify-end
            gap-3
            mt-8
        ">

            {/* =================================================
                CANCEL
            ================================================= */}

            <button
                type="button"
                onClick={onCancel}
                disabled={saving}
                className="
                    w-full
                    sm:w-auto
                    px-5
                    py-2.5
                    rounded-lg
                    border
                    border-app
                    text-sm
                    font-medium
                    hover:opacity-80
                    active:scale-[0.98]
                    transition
                    disabled:opacity-50
                    disabled:cursor-not-allowed
                "
            >
                Cancel
            </button>

            {/* =================================================
                UPDATE
            ================================================= */}

            <button
                type="submit"
                disabled={saving}
                className="
                    w-full
                    sm:w-auto
                    flex
                    items-center
                    justify-center
                    gap-2
                    px-5
                    py-2.5
                    rounded-lg
                    bg-blue-600
                    text-white
                    text-sm
                    font-medium
                    hover:bg-blue-700
                    active:scale-[0.98]
                    transition
                    disabled:opacity-50
                    disabled:cursor-not-allowed
                "
            >
                {saving ? (
                    <>
                        <Loader2
                            size={17}
                            className="animate-spin"
                        />

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