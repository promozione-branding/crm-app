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
import Link from "next/link";

const sections = [
    {
        title: "GENERAL",
        items: [
            {
                icon: Building2,
                href: "/organization-settings",
                color: "text-blue-500 bg-blue-500/10",
                title: "Organization",
                description: "Configure company information, branding, and preferences.",
            },
            {
                icon: Users,
                href: "/team-management",
                color: "text-indigo-500 bg-indigo-500/10",
                title: "Users & Roles",
                description: "Manage team members, access levels, and permissions.",
            },
        ],
    },
    {
        title: "CRM",
        items: [
            {
                icon: Link2,
                href: "/integration",
                color: "text-cyan-500 bg-cyan-500/10",
                title: "Integration",
                description: "Connect third-party tools, apps, and business systems.",
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
            <div className="mb-6">
                <h1 className="text-base font-bold">Settings</h1>
                <p className="text-xs text-muted">
                    Manage your CRM preferences and integrations.
                </p>
            </div>

            {sections.map((section) => (
                <div key={section.title} className="mb-5">
                    <h2 className="text-xs font-semibold tracking-widest uppercase text-blue-500 mb-2">
                        {section.title}
                    </h2>

                    <div className="border-t border-app pt-5">
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                            {section.items.map((item) => {
                                const Icon = item.icon;

                                return (
                                    <Link href={item.href || ""}
                                        key={item.title}
                                        className="bg-app border border-app rounded-2xl p-5 text-left hover:border-blue-500 hover:-translate-y-1 transition-all duration-200"
                                    >
                                        <div
                                            className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${item.color}`}
                                        >
                                            <Icon size={24} />
                                        </div>

                                        <h3 className="text-base font-semibold mb-2">
                                            {item.title}
                                        </h3>

                                        <p className="text-xs text-muted">
                                            {item.description}
                                        </p>
                                    </Link>
                                );
                            })}

                        </div>

                    </div>
                </div>
            ))}
        </div>
    );
}