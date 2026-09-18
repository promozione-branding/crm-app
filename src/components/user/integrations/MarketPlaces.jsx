// src/components/user/integrations/MarketPlaces.jsx

import React from 'react';

export default function MarketPlaces() {
    const marketplaces = [
        {
            name: 'IndiaMART',
            description: 'Connect IndiaMART to receive and manage your customer inquiries.',
            logo: '/logos/indiamart.png',
            status: 'Available',
        },
        {
            name: 'TradeIndia',
            description: 'Sync your TradeIndia inquiries directly with your workspace.',
            logo: '/logos/tradeindia.png',
            status: 'Available',
        },
        {
            name: 'Justdial',
            description: 'Receive leads and inquiries from your Justdial business listing.',
            logo: '/logos/justdial.png',
            status: 'Available',
        },
        {
            name: 'InquiryBazaar',
            description: 'Connect InquiryBazaar and automatically receive new inquiries.',
            logo: '/logos/logocheck.png',
            status: 'Available',
        },
    ];

    return (
        <div className="space-y-5">
            <div>
                <h2 className="text-app text-base font-semibold">Market Places</h2>

                <p className="text-muted mt-1 text-xs">Connect your marketplace accounts and receive inquiries automatically.</p>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                {marketplaces.map((marketplace, idx) => (
                    <div
                        key={idx}
                        className="group bg-app border-app rounded-2xl border p-5 transition-all duration-200 hover:border-blue-500/40 hover:shadow-lg"
                    >
                        <div className="flex items-start justify-between gap-4">
                            <div className="flex min-w-0 items-center gap-3">
                                <div className="border-app bg-surface flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl border">
                                    <img src={marketplace.logo} alt={`${name} logo`} className="h-8 w-8 object-contain" />
                                </div>

                                <div className="min-w-0">
                                    <h3 className="text-app text-sm font-semibold">{marketplace.name}</h3>

                                    <div className="mt-1 flex items-center gap-1.5">
                                        <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                                        <span className="text-muted text-[11px]">{marketplace.status}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <p className="text-muted mt-4 min-h-[40px] text-xs leading-5">{marketplace.description}</p>

                        <button className="mt-5 h-9 w-full rounded-lg bg-blue-600 text-xs font-medium text-white transition-colors hover:bg-blue-700">
                            Connect
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}
