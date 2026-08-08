import { ArrowLeft, Dot, Globe, Search, Share2, ShoppingBag, Webhook } from 'lucide-react'
import Link from 'next/link'
import React, { useState } from 'react'

export default function Integration() {
    const [active, setActive] = useState("market-places");
    const tabs = [
        { id: "market-places", label: "Market Places", icon: ShoppingBag },
        { id: "websites", label: "Websites", icon: Globe },
        { id: "meta", label: "Meta", icon: Share2 },
        { id: "google", label: "Google", icon: Search },
        { id: "webhook-api", label: "Webhook API", icon: Webhook },
    ];

    return (
        <div className='bg-surface min-h-screen text-app'>
            <div className="h-16 top-16 sticky z-40 bg-surface border-b border-app flex items-center justify-between md:px-8 px-1">
                <div className="flex items-center md:gap-2 gap-1">
                    <Link href="/settings" className="p-2 rounded-xl border bg-app border-app hover-app text-app">
                        <ArrowLeft size={20} />
                    </Link>

                    <h1 className="text-sm font-bold text-app flex flex-col">
                        Integrations
                    </h1>
                </div>

                <div className="flex md:gap-2 gap-1 text-sm">
                    <p className='flex items-center text-xs gap-1'>
                       <span className='text-blue-500 text-sm'>
                        ●
                       </span>
                        15 Available
                    </p>
                </div>
            </div>

            <div className='h-10 top-32 sticky z-40 bg-surface border-b border-app flex items-center gap-2 justify-between md:px-8 px-1 overflow-x-auto overflow-y-hidden'>
                {tabs.map((tab) => {
                    const Icon = tab.icon;
                    const isActive = active === tab.id;

                    return (
                        <button key={tab.id} onClick={() => setActive(tab.id)}
                            className={`
                        relative flex items-center justify-center gap-2
                        px-5 h-11 min-w-max
                        text-sm font-medium whitespace-nowrap
                        transition-all duration-200
                        border-b-2
                        ${isActive
                                    ? "border-blue-600 text-blue-600 dark:text-blue-400 bg-blue-500/10"
                                    : "border-transparent text-app hover-app"
                                }
                    `}
                        >
                            <Icon size={16} />
                            <span>{tab.label}</span>

                            {tab.badge && (
                                <span className={`flex items-center justify-center min-w-5 h-5 rounded-full text-[10px]
                                ${isActive ? "bg-blue-600 text-white" : "bg-app border border-app text-app"}`}>
                                    {tab.badge}
                                </span>
                            )}
                        </button>
                    );
                })}
            </div>

            
        </div>
    )
}