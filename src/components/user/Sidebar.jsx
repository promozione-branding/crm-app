"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    Users,
    Settings,
    ClipboardList,
    PhoneCall,
    BarChart3,
    PanelLeftClose,
    PanelLeftOpen,
} from "lucide-react";

const menus = [
    {
        name: "Dashboard",
        href: "/dashboard",
        icon: LayoutDashboard,
    },
    {
        name: "Leads",
        href: "/leads",
        icon: Users,
    },
    {
        name: "Task",
        href: "/tasks",
        icon: ClipboardList,
    },
    {
        name: "Reports",
        href: "/reports",
        icon: BarChart3,
    },
    {
        name: "Call Logs",
        href: "/call-logs",
        icon: PhoneCall,
    },
    {
        name: "Settings",
        href: "/settings",
        icon: Settings,
    },
];

export default function Sidebar() {
    const pathname = usePathname();
    const [open, setOpen] = useState(true);

    return (
        <aside className={`bg-app hidden sticky top-0 md:flex flex-col border-r h-screen border-app text-app transition-all duration-300 ${open ? "w-60" : "w-20"}`}>
            {/* Header */}
            <div className={`h-16 border-b border-app flex items-center ${open ? "justify-between px-5" : "justify-center"}`}>
                {open && (
                    <h2 className="font-bold text-xl tracking-wide">
                        CRM
                    </h2>
                )}

                <button
                    onClick={() => setOpen(!open)}
                    className="w-9 h-9 rounded-lg hover-app flex items-center justify-center transition"
                >
                    {open ? (
                        <PanelLeftClose size={20} />
                    ) : (
                        <PanelLeftOpen size={20} />
                    )}
                </button>
            </div>

            {/* Menu */}
            <div className="p-3 space-y-2">

                {menus.map((item) => {
                    const Icon = item.icon;

                    const active =
                        pathname === item.href ||
                        pathname.startsWith(item.href + "/");

                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={`flex items-center rounded-xl transition-all duration-200 ${active
                                ? "bg-blue-600 text-white shadow-lg"
                                : "hover-app"
                                } ${open
                                    ? "px-4 h-12 gap-3"
                                    : "justify-center h-12"
                                }`}
                        >
                            <Icon size={18} />

                            {open && (
                                <span className="font-medium whitespace-nowrap text-sm">
                                    {item.name}
                                </span>
                            )}
                        </Link>
                    );
                })}
            </div>
        </aside>
    );
}