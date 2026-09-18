// src/app/integration/Integration.jsx

import Google from '@/components/user/integrations/Google';
import MarketPlaces from '@/components/user/integrations/MarketPlaces';
import Meta from '@/components/user/integrations/Meta';
import WebhookApi from '@/components/user/integrations/WebhookApi';
import Websites from '@/components/user/integrations/Websites';
import { ArrowLeft, Globe, Search, Share2, ShoppingBag, Webhook } from 'lucide-react';
import Link from 'next/link';
import React, { useState } from 'react';

export default function Integration() {
    const [active, setActive] = useState('market-places');
    const tabs = [
        { id: 'market-places', label: 'Market Places', icon: ShoppingBag },
        { id: 'websites', label: 'Websites', icon: Globe },
        { id: 'meta', label: 'Meta', icon: Share2 },
        { id: 'google', label: 'Google', icon: Search },
        { id: 'webhook-api', label: 'Webhook API', icon: Webhook },
    ];

    return (
        <div className="bg-surface text-app min-h-screen">
            {/* Header */}
            <div className="bg-surface border-app sticky top-0 z-40 flex h-16 items-center justify-between border-b px-3 md:px-8">
                <div className="flex items-center gap-1 md:gap-2">
                    <Link href="/settings" className="bg-app border-app hover-app text-app rounded-xl border p-2">
                        <ArrowLeft size={20} />
                    </Link>

                    <h1 className="text-app text-sm font-bold">Integrations</h1>
                </div>

                <div className="flex gap-1 text-sm md:gap-2">
                    <p className="flex items-center gap-1 text-xs">
                        <span className="text-sm text-blue-500">●</span>
                        15 Available
                    </p>
                </div>
            </div>

            {/* Tabs */}
            <div className="bg-surface border-app sticky top-16 z-40 flex h-11 items-center gap-2 overflow-x-auto overflow-y-hidden border-b px-1 md:px-8">
                {tabs.map((tab) => {
                    const Icon = tab.icon;
                    const isActive = active === tab.id;

                    return (
                        <button
                            key={tab.id}
                            onClick={() => setActive(tab.id)}
                            className={`relative flex h-11 min-w-max items-center justify-center gap-2 border-b-2 px-5 text-sm font-medium whitespace-nowrap transition-all duration-200 ${isActive ? 'border-blue-600 bg-blue-500/10 text-blue-600 dark:text-blue-400' : 'text-app hover-app border-transparent'} `}
                        >
                            <Icon size={16} />
                            <span>{tab.label}</span>
                        </button>
                    );
                })}
            </div>

            {/* Content */}
            <main className="px-3 py-6 md:px-8">
                {active == 'market-places' && <MarketPlaces />}

                {active == 'websites' && <Websites />}

                {active == 'meta' && <Meta />}

                {active == 'google' && <Google />}

                {active == 'webhook-api' && <WebhookApi />}
            </main>
        </div>
    );
}
