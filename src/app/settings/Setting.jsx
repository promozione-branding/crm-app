// src/app/settings/Setting.jsx

'use client';

import React from 'react';
import { Building2, Users, Phone, MessageCircle, Mail, Bell, Link2 } from 'lucide-react';
import Link from 'next/link';

const sections = [
    {
        title: 'GENERAL',
        items: [
            {
                icon: Building2,
                href: '/organization-settings',
                color: 'text-blue-500 bg-blue-500/10',
                title: 'Organization',
                description: 'Configure company information, branding, and preferences.',
            },
            {
                icon: Users,
                href: '/team-management',
                color: 'text-indigo-500 bg-indigo-500/10',
                title: 'Users & Roles',
                description: 'Manage team members, access levels, and permissions.',
            },
        ],
    },
    {
        title: 'CRM',
        items: [
            {
                icon: Link2,
                href: '/integration',
                color: 'text-cyan-500 bg-cyan-500/10',
                title: 'Integration',
                description: 'Connect third-party tools, apps, and business systems.',
            },
        ],
    },
    {
        title: 'COMMUNICATIONS',
        items: [
            {
                icon: Phone,
                color: 'text-violet-500 bg-violet-500/10',
                title: 'Phone',
                description: 'Configure calling, tracking, and communication settings.',
            },
            {
                icon: MessageCircle,
                color: 'text-green-500 bg-green-500/10',
                title: 'WhatsApp',
                description: 'Manage WhatsApp connectivity, messaging, and automation.',
            },
            {
                icon: Mail,
                color: 'text-purple-500 bg-purple-500/10',
                title: 'Email',
                description: 'Configure email templates, alerts, and tracking options.',
            },
            {
                icon: Bell,
                color: 'text-orange-500 bg-orange-500/10',
                title: 'Notification',
                description: 'Manage notifications across web, mobile, and email.',
            },
        ],
    },
];

export default function Setting() {
    return (
        <div className="bg-surface text-app min-h-[calc(100vh-64px)] p-6">
            <div className="mb-6">
                <h1 className="text-base font-bold">Settings</h1>
                <p className="text-muted text-xs">Manage your CRM preferences and integrations.</p>
            </div>

            {sections.map((section) => (
                <div key={section.title} className="mb-5">
                    <h2 className="mb-2 text-xs font-semibold tracking-widest text-blue-500 uppercase">{section.title}</h2>

                    <div className="border-app border-t pt-5">
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
                            {section.items.map((item) => {
                                const Icon = item.icon;

                                return (
                                    <Link
                                        href={item.href || ''}
                                        key={item.title}
                                        className="bg-app border-app rounded-2xl border p-5 text-left transition-all duration-200 hover:-translate-y-1 hover:border-blue-500"
                                    >
                                        <div className={`mb-4 flex h-10 w-10 items-center justify-center rounded-xl ${item.color}`}>
                                            <Icon size={24} />
                                        </div>

                                        <h3 className="mb-2 text-base font-semibold">{item.title}</h3>

                                        <p className="text-muted text-xs">{item.description}</p>
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
