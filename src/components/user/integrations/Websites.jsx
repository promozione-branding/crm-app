import { Globe, Plus } from 'lucide-react'
import React from 'react'

export default function Websites() {
  return (
   <div className="space-y-5">
            <div className="flex items-center justify-between gap-3">
                <div>
                    <h2 className="text-base font-semibold text-app">
                        Websites
                    </h2>

                    <p className="text-xs text-muted mt-1">
                        Connect your websites to capture leads and inquiries.
                    </p>
                </div>

                <button className="flex items-center gap-2 h-9 px-4 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium shrink-0">
                    <Plus size={15} />
                    Add Website
                </button>
            </div>

            <div className="min-h-[320px] rounded-2xl border border-dashed border-app bg-app flex flex-col items-center justify-center text-center px-6">
                <div className="w-14 h-14 rounded-2xl bg-surface border border-app flex items-center justify-center mb-4">
                    <Globe size={24} className="text-muted" />
                </div>

                <h3 className="text-sm font-semibold text-app">
                    No website found
                </h3>

                <p className="text-xs text-muted mt-2 max-w-sm leading-5">
                    You haven't connected any website yet. Add your website to
                    start receiving and managing inquiries.
                </p>

                <button className="mt-5 flex items-center gap-2 h-9 px-4 rounded-lg border border-app hover-app text-app text-xs font-medium">
                    <Plus size={15} />
                    Add Website
                </button>
            </div>
        </div>
  )
}
