"use client";

import React from "react";
import {
    Building2,
    Users,
    Phone,
    MessageCircle,
    Mail,
    Bell,
    Link2,
} from "lucide-react";

const sections = [
    {
        title: "GENERAL",
        items: [
            {
                icon: Building2,
                color: "text-blue-500 bg-blue-500/10",
                title: "Organization",
                description:
                    "Configure company information, branding, and preferences.",
            },
            {
                icon: Users,
                color: "text-indigo-500 bg-indigo-500/10",
                title: "Users & Roles",
                description:
                    "Manage team members, access levels, and permissions.",
            },
        ],
    },
    {
        title: "CRM",
        items: [
            {
                icon: Link2,
                color: "text-cyan-500 bg-cyan-500/10",
                title: "Integration",
                description:
                    "Connect third-party tools, apps, and business systems.",
            },
        ],
    },
    {
        title: "COMMUNICATIONS",
        items: [
            {
                icon: Phone,
                color: "text-violet-500 bg-violet-500/10",
                title: "Phone",
                description:
                    "Configure calling, tracking, and communication settings.",
            },
            {
                icon: MessageCircle,
                color: "text-green-500 bg-green-500/10",
                title: "WhatsApp",
                description:
                    "Manage WhatsApp connectivity, messaging, and automation.",
            },
            {
                icon: Mail,
                color: "text-purple-500 bg-purple-500/10",
                title: "Email",
                description:
                    "Configure email templates, alerts, and tracking options.",
            },
            {
                icon: Bell,
                color: "text-orange-500 bg-orange-500/10",
                title: "Notification",
                description:
                    "Manage notifications across web, mobile, and email.",
            },
        ],
    },
];

export default function Setting() {
    return (
        <div className="bg-surface text-app min-h-[calc(100vh-64px)] p-6">

            <div className="mb-8">
                <h1 className="text-2xl font-bold">Settings</h1>
                <p className="text-sm opacity-70">
                    Manage your CRM preferences and integrations.
                </p>
            </div>

            {sections.map((section) => (
                <div key={section.title} className="mb-10">

                    <h2 className="text-xs font-semibold tracking-widest uppercase text-blue-500 mb-3">
                        {section.title}
                    </h2>

                    <div className="border-t border-app pt-5">

                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">

                            {section.items.map((item) => {
                                const Icon = item.icon;

                                return (
                                    <button
                                        key={item.title}
                                        className="bg-app border border-app rounded-2xl p-7 text-left hover:border-blue-500 hover:-translate-y-1 transition-all duration-200"
                                    >
                                        <div
                                            className={`w-12 h-12 rounded-xl flex items-center justify-center mb-5 ${item.color}`}
                                        >
                                            <Icon size={24} />
                                        </div>

                                        <h3 className="text-xl font-semibold mb-2">
                                            {item.title}
                                        </h3>

                                        <p className="text-sm opacity-70 leading-6">
                                            {item.description}
                                        </p>
                                    </button>
                                );
                            })}

                        </div>

                    </div>
                </div>
            ))}
        </div>
    );
}