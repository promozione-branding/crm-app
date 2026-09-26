// src/components/user/integrations/Websites.jsx

'use client';

import { Globe } from 'lucide-react';
import React from 'react';
import WebsiteIntegration from './WebsiteIntegration';

export default function Websites() {
    return (
        <div className="space-y-5">
            <div className="flex items-center gap-3">
                <div className="border-app bg-app flex h-10 w-10 items-center justify-center rounded-xl border">
                    <Globe size={18} className="text-blue-600" />
                </div>
                <div>
                    <h2 className="text-app text-base font-semibold">Websites</h2>
                    <p className="text-muted mt-0.5 text-xs">
                        Connect your website to capture leads and inquiries automatically.
                    </p>
                </div>
            </div>

            <WebsiteIntegration />
        </div>
    );
}