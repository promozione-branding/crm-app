import { ClipboardCheck } from 'lucide-react'
import React from 'react'

export default function Task() {
    return (
        <div className="bg-card border border-app rounded-2xl p-5">
            <h3 className="uppercase tracking-widest text-xs font-semibold text-muted">
                Tasks
            </h3>

            <div className="border-b border-app my-4" />

            <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="w-14 h-14 rounded-full bg-app border border-app flex items-center justify-center text-app">
                    <ClipboardCheck size={24} className="opacity-80" />
                </div>

                <h4 className="mt-4 text-sm font-medium text-app">
                    No Task Found
                </h4>

                <p className="mt-1 text-xs text-muted">
                    Tasks history will appear here.
                </p>
            </div>
        </div>
    )
}
