// src/components/user/integrations/Websites.jsx

import { Globe, Plus } from 'lucide-react';
import React from 'react';

export default function Websites() {
    return (
        <div className="space-y-5">
            <div className="flex items-center justify-between gap-3">
                <div>
                    <h2 className="text-app text-base font-semibold">Websites</h2>

                    <p className="text-muted mt-1 text-xs">Connect your websites to capture leads and inquiries.</p>
                </div>

                <button className="flex h-9 shrink-0 items-center gap-2 rounded-lg bg-blue-600 px-4 text-xs font-medium text-white hover:bg-blue-700">
                    <Plus size={15} />
                    Add Website
                </button>
            </div>

            <div className="border-app bg-app flex min-h-[320px] flex-col items-center justify-center rounded-2xl border border-dashed px-6 text-center">
                <div className="bg-surface border-app mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border">
                    <Globe size={24} className="text-muted" />
                </div>

                <h3 className="text-app text-sm font-semibold">No website found</h3>

                <p className="text-muted mt-2 max-w-sm text-xs leading-5">
                    You haven't connected any website yet. Add your website to start receiving and managing inquiries.
                </p>

                <button className="border-app hover-app text-app mt-5 flex h-9 items-center gap-2 rounded-lg border px-4 text-xs font-medium">
                    <Plus size={15} />
                    Add Website
                </button>
            </div>
        </div>
    );
}
