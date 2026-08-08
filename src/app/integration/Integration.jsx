
import { ArrowLeft, Globe, Search, Share2, ShoppingBag, Webhook, CheckCircle2, Copy, RefreshCw, Plus, } from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";

export default function Integration() {
    const [active, setActive] = useState("market-places");

    const tabs = [
        { id: "market-places", label: "Market Places", icon: ShoppingBag, },
        { id: "websites", label: "Websites", icon: Globe, },
        { id: "meta", label: "Meta", icon: Share2, },
        { id: "google", label: "Google", icon: Search, },
        { id: "webhook-api", label: "Webhook API", icon: Webhook, },
    ];

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

    const integrations = [
        {
            name: "Facebook",
            description: "Connect Facebook to receive leads and messages from your business pages.",
            logo: "/logos/facebook.png",
            status: "Available",
        },
        {
            name: "Google",
            description: "Connect Google to manage leads and customer interactions from Google.",
            logo: "/logos/google.png",
            status: "Available",
        },
    ];

    const renderIntegrationCard = ({ name, description, logo, status, }) => (
        <div className="group bg-app border border-app rounded-2xl p-5 transition-all duration-200 hover:border-blue-500/40 hover:shadow-lg">
            <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3 min-w-0">
                    <div className=" w-12 h-12 rounded-xl border border-app bg-surface flex items-center justify-center shrink-0 overflow-hidden">
                        <img
                            src={logo}
                            alt={`${name} logo`}
                            className="w-8 h-8 object-contain"
                        />
                    </div>

                    <div className="min-w-0">
                        <h3 className="font-semibold text-app text-sm">
                            {name}
                        </h3>

                        <div className="flex items-center gap-1.5 mt-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                            <span className="text-[11px] text-muted">
                                {status}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <p className="text-xs text-muted leading-5 mt-4 min-h-[40px]">
                {description}
            </p>

            <button className="w-full mt-5 h-9 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium transition-colors">
                Connect
            </button>
        </div>
    );

    const renderMarketPlaces = () => (
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
                {marketplaces.map((marketplace) => (
                    <React.Fragment key={marketplace.name}>
                        {renderIntegrationCard(marketplace)}
                    </React.Fragment>
                ))}
            </div>
        </div>
    );

    const renderWebsites = () => (
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
    );

    const renderMeta = () => (
        <div className="space-y-5">
            <div>
                <h2 className="text-base font-semibold text-app">
                    Meta
                </h2>

                <p className="text-xs text-muted mt-1">
                    Connect your Meta accounts to manage Facebook leads and
                    conversations.
                </p>
            </div>

            <div className="max-w-xl">
                {renderIntegrationCard(integrations[0])}
            </div>
        </div>
    );

    const renderGoogle = () => (
        <div className="space-y-5">
            <div>
                <h2 className="text-base font-semibold text-app">
                    Google
                </h2>

                <p className="text-xs text-muted mt-1">
                    Connect your Google account to manage your Google
                    integrations.
                </p>
            </div>

            <div className="max-w-xl">
                {renderIntegrationCard(integrations[1])}
            </div>
        </div>
    );

    const renderWebhookApi = () => (
        <div className="space-y-5">
            <div>
                <h2 className="text-base font-semibold text-app">
                    Webhook API
                </h2>

                <p className="text-xs text-muted mt-1">
                    Use your API credentials to send and receive integration
                    data securely.
                </p>
            </div>

            <div className="max-w-3xl bg-app border border-app rounded-2xl p-5">
                <div className="flex items-center gap-3 pb-5 border-b border-app">
                    <div className="w-11 h-11 rounded-xl bg-surface border border-app flex items-center justify-center">
                        <Webhook size={20} className="text-blue-500" />
                    </div>

                    <div>
                        <h3 className="text-sm font-semibold text-app">
                            API Configuration
                        </h3>

                        <p className="text-xs text-muted mt-1">
                            Manage your webhook endpoint and API credentials.
                        </p>
                    </div>
                </div>

                <div className="space-y-5 mt-5">
                    <div>
                        <label className="text-xs font-medium text-app">
                            Webhook URL
                        </label>

                        <div className="flex gap-2 mt-2">
                            <input
                                readOnly
                                value="https://api.yourdomain.com/webhooks"
                                className="flex-1 h-10 px-3 rounded-lg bg-surface border border-app text-xs text-app outline-none"
                            />

                            <button className="w-10 h-10 rounded-lg border border-app hover-app flex items-center justify-center text-app"
                                title="Copy webhook URL"
                            >
                                <Copy size={15} />
                            </button>
                        </div>
                    </div>

                    <div>
                        <label className="text-xs font-medium text-app">
                            API Key
                        </label>

                        <div className="flex gap-2 mt-2">
                            <input
                                readOnly
                                value="sk_live_xxxxxxxxxxxxxxxxx"
                                type="password"
                                className="flex-1 h-10 px-3 rounded-lg bg-surface border border-app text-xs text-app outline-none"
                            />

                            <button className="w-10 h-10 rounded-lg border border-app hover-app flex items-center justify-center text-app"
                                title="Copy API key"
                            >
                                <Copy size={15} />
                            </button>
                        </div>
                    </div>

                    <div className="flex items-center justify-between gap-4 p-4  rounded-xl bg-surface border border-app">
                        <div className="flex items-center gap-3">
                            <CheckCircle2 size={18} className="text-blue-500" />

                            <div>
                                <p className="text-xs font-medium text-app">
                                    API Active
                                </p>

                                <p className="text-[11px] text-muted mt-0.5">
                                    Your API integration is currently active.
                                </p>
                            </div>
                        </div>

                        <button className="flex items-center gap-2 h-8 px-3 rounded-lg border border-app hover-app text-xs text-app">
                            <RefreshCw size={13} />
                            Regenerate
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );

    const renderContent = () => {
        switch (active) {
            case "market-places":
                return renderMarketPlaces();

            case "websites":
                return renderWebsites();

            case "meta":
                return renderMeta();

            case "google":
                return renderGoogle();

            case "webhook-api":
                return renderWebhookApi();

            default:
                return null;
        }
    };

    return (
        <div className="bg-surface min-h-screen text-app">
            {/* Header */}
            <div className="h-16 top-0 sticky z-40 bg-surface border-b border-app flex items-center justify-between md:px-8 px-3">
                <div className="flex items-center md:gap-2 gap-1">
                    <Link
                        href="/settings"
                        className="p-2 rounded-xl border bg-app border-app hover-app text-app"
                    >
                        <ArrowLeft size={20} />
                    </Link>

                    <h1 className="text-sm font-bold text-app">
                        Integrations
                    </h1>
                </div>

                <div className="flex md:gap-2 gap-1 text-sm">
                    <p className="flex items-center text-xs gap-1">
                        <span className="text-blue-500 text-sm">●</span>
                        15 Available
                    </p>
                </div>
            </div>

            {/* Tabs */}
            <div className="h-11 top-16 sticky z-40 bg-surface border-b border-app flex items-center gap-2 md:px-8 px-1 overflow-x-auto overflow-y-hidden">
                {tabs.map((tab) => {
                    const Icon = tab.icon;
                    const isActive = active === tab.id;

                    return (
                        <button
                            key={tab.id}
                            onClick={() => setActive(tab.id)}
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
                        </button>
                    );
                })}
            </div>

            {/* Content */}
            <main className="px-3 md:px-8 py-6">
                {renderContent()}
            </main>
        </div>
    );
}