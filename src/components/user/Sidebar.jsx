// src/components/user/Sidebar.jsx

'use client';

import Link from 'next/link';
import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Users, Settings, ClipboardList, PhoneCall, BarChart3, PanelLeftClose, PanelLeftOpen } from 'lucide-react';

const menus = [
    {
        name: 'Dashboard',
        href: '/dashboard',
        icon: LayoutDashboard,
    },
    {
        name: 'Leads',
        href: '/leads',
        icon: Users,
    },
    {
        name: 'Task',
        href: '/tasks',
        icon: ClipboardList,
    },
    {
        name: 'Reports',
        href: '/reports',
        icon: BarChart3,
    },
    {
        name: 'Call Logs',
        href: '/call-logs',
        icon: PhoneCall,
    },
    {
        name: 'Settings',
        href: '/settings',
        icon: Settings,
    },
];

export default function Sidebar() {
    const pathname = usePathname();
    const [open, setOpen] = useState(true);

    return (
        <aside
            className={`bg-app border-app text-app sticky top-0 left-0 hidden h-screen shrink-0 flex-col border-r transition-all duration-300 ease-in-out md:flex ${open ? 'w-60' : 'w-20'} `}
        >
            {/* ================= HEADER ================= */}
            <div
                className={`border-app flex h-16 shrink-0 items-center border-b transition-all duration-300 ${open ? 'justify-between px-5' : 'justify-center'} `}
            >
                {/* Logo / Brand */}
                <div className={`overflow-hidden transition-all duration-300 ${open ? 'w-auto opacity-100' : 'w-0 opacity-0'} `}>
                    <h2 className="text-xl font-bold tracking-wide whitespace-nowrap">CRM</h2>
                </div>

                {/* Toggle */}
                <button
                    type="button"
                    onClick={() => setOpen((prev) => !prev)}
                    aria-label={open ? 'Collapse sidebar' : 'Expand sidebar'}
                    title={open ? 'Collapse sidebar' : 'Expand sidebar'}
                    className="hover-app flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition-all duration-200 active:scale-95"
                >
                    {open ? <PanelLeftClose size={20} /> : <PanelLeftOpen size={20} />}
                </button>
            </div>

            {/* ================= MENU ================= */}
            <nav className="flex-1 space-y-2 overflow-y-auto p-3">
                {menus.map((item) => {
                    const Icon = item.icon;

                    const active = pathname === item.href || pathname.startsWith(item.href + '/');

                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            title={!open ? item.name : undefined}
                            className={`group relative flex items-center rounded-xl transition-all duration-200 active:scale-[0.98] ${active ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'hover-app'} ${open ? 'h-12 gap-3 px-4' : 'h-12 justify-center px-0'} `}
                        >
                            {/* Icon */}
                            <Icon size={19} strokeWidth={active ? 2.5 : 2} className="shrink-0 transition-transform duration-200 group-hover:scale-105" />

                            {/* Menu Name */}
                            <span
                                className={`overflow-hidden text-sm font-medium whitespace-nowrap transition-all duration-300 ${open ? 'w-auto opacity-100' : 'w-0 opacity-0'} `}
                            >
                                {item.name}
                            </span>

                            {/* Tooltip when collapsed */}
                            {!open && (
                                <span className="pointer-events-none absolute left-full z-50 ml-3 translate-x-[-4px] rounded-lg bg-gray-900 px-3 py-2 text-xs font-medium whitespace-nowrap text-white opacity-0 transition-all duration-200 group-hover:translate-x-0 group-hover:opacity-100">
                                    {item.name}
                                </span>
                            )}
                        </Link>
                    );
                })}
            </nav>

            {/* ================= FOOTER ================= */}
            <div className={`border-app shrink-0 border-t p-3 transition-all duration-300 ${open ? 'text-left' : 'flex justify-center'} `}>
                {open ? (
                    <p className="text-muted px-1 text-xs">CRM Dashboard</p>
                ) : (
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-xs font-bold text-white">C</span>
                )}
            </div>
        </aside>
    );
}
