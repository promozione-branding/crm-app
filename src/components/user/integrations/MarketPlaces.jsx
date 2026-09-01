import React from 'react'

export default function MarketPlaces() {
    const marketplaces = [
        {
            name: "IndiaMART",
            description: "Connect IndiaMART to receive and manage your customer inquiries.",
            logo: "/logos/indiamart.png",
            status: "Available",
        },
        {
            name: "TradeIndia",
            description: "Sync your TradeIndia inquiries directly with your workspace.",
            logo: "/logos/tradeindia.png",
            status: "Available",
        },
        {
            name: "Justdial",
            description: "Receive leads and inquiries from your Justdial business listing.",
            logo: "/logos/justdial.png",
            status: "Available",
        },
        {
            name: "InquiryBazaar",
            description: "Connect InquiryBazaar and automatically receive new inquiries.",
            logo: "/logos/logocheck.png",
            status: "Available",
        },
    ];

    return (
        <div className="space-y-5">
            <div>
                <h2 className="text-base font-semibold text-app">
                    Market Places
                </h2>

                <p className="text-xs text-muted mt-1">
                    Connect your marketplace accounts and receive inquiries
                    automatically.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {marketplaces.map((marketplace, idx) => (
                    <div key={idx} className="group bg-app border border-app rounded-2xl p-5 transition-all duration-200 hover:border-blue-500/40 hover:shadow-lg">
                        <div className="flex items-start justify-between gap-4">
                            <div className="flex items-center gap-3 min-w-0">
                                <div className=" w-12 h-12 rounded-xl border border-app bg-surface flex items-center justify-center shrink-0 overflow-hidden">
                                    <img
                                        src={marketplace.logo}
                                        alt={`${name} logo`}
                                        className="w-8 h-8 object-contain"
                                    />
                                </div>

                                <div className="min-w-0">
                                    <h3 className="font-semibold text-app text-sm">
                                        {marketplace.name}
                                    </h3>

                                    <div className="flex items-center gap-1.5 mt-1">
                                        <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                                        <span className="text-[11px] text-muted">
                                            {marketplace.status}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <p className="text-xs text-muted leading-5 mt-4 min-h-[40px]">
                            {marketplace.description}
                        </p>

                        <button className="w-full mt-5 h-9 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium transition-colors">
                            Connect
                        </button>
                    </div>
                ))}
            </div>
        </div>
    )
}