// src/components/user/leads/form/Call.jsx

import { Phone } from 'lucide-react';
import React from 'react';

export default function Call() {
    return (
        <div className="bg-card border-app rounded-2xl border p-5">
            <h3 className="text-muted text-xs font-semibold tracking-widest uppercase">Call Log</h3>

            <div className="border-app my-4 border-b" />

            <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="bg-app border-app text-app flex h-14 w-14 items-center justify-center rounded-full border">
                    <Phone size={24} className="opacity-80" />
                </div>

                <h4 className="text-app mt-4 text-sm font-medium">No Call Log Found</h4>

                <p className="text-muted mt-1 text-xs">Call history will appear here.</p>
            </div>
        </div>
    );
}
