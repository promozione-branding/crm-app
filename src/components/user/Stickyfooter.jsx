"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    Users,
    ClipboardList,
    BarChart3,
    PhoneCall,
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
        name: "Calls",
        href: "/call-logs",
        icon: PhoneCall,
    },
];

export default function Stickyfooter() {
    const pathname = usePathname();

    return (
        <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-app border-t border-app">
            <div className="flex items-center justify-around h-16 px-2">

                {menus.map((item) => {
                    const Icon = item.icon;

                    const active =
                        pathname === item.href ||
                        pathname.startsWith(item.href + "/");

                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={`flex flex-col items-center justify-center gap-1 w-full h-full rounded-lg transition ${
                                active
                                    ? "text-blue-600"
                                    : "text-muted hover:text-app"
                            }`}
                        >
                            <Icon size={20} />

                            <span
                                className={`text-[11px] font-medium ${
                                    active ? "text-blue-600" : ""
                                }`}
                            >
                                {item.name}
                            </span>

                            {active && (
                                <span className="absolute bottom-0 h-0.5 w-8 bg-blue-600 rounded-full" />
                            )}
                        </Link>
                    );
                })}

            </div>
        </nav>
    );
}