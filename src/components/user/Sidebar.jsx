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
        <aside
            className={`
                hidden
                md:flex
                sticky
                top-0
                left-0
                h-screen
                shrink-0
                flex-col
                bg-app
                border-r
                border-app
                text-app
                transition-all
                duration-300
                ease-in-out
                ${open ? "w-60" : "w-20"}
            `}
        >
            {/* ================= HEADER ================= */}
            <div
                className={`
                    h-16
                    shrink-0
                    border-b
                    border-app
                    flex
                    items-center
                    transition-all
                    duration-300
                    ${open
                        ? "justify-between px-5"
                        : "justify-center"
                    }
                `}
            >
                {/* Logo / Brand */}
                <div
                    className={`
                        overflow-hidden
                        transition-all
                        duration-300
                        ${open
                            ? "w-auto opacity-100"
                            : "w-0 opacity-0"
                        }
                    `}
                >
                    <h2 className="font-bold text-xl tracking-wide whitespace-nowrap">
                        CRM
                    </h2>
                </div>

                {/* Toggle */}
                <button
                    type="button"
                    onClick={() => setOpen((prev) => !prev)}
                    aria-label={open ? "Collapse sidebar" : "Expand sidebar"}
                    title={open ? "Collapse sidebar" : "Expand sidebar"}
                    className="
                        w-9
                        h-9
                        shrink-0
                        rounded-lg
                        flex
                        items-center
                        justify-center
                        hover-app
                        transition-all
                        duration-200
                        active:scale-95
                    "
                >
                    {open ? (
                        <PanelLeftClose size={20} />
                    ) : (
                        <PanelLeftOpen size={20} />
                    )}
                </button>
            </div>

            {/* ================= MENU ================= */}
            <nav className="flex-1 p-3 space-y-2 overflow-y-auto">
                {menus.map((item) => {
                    const Icon = item.icon;

                    const active =
                        pathname === item.href ||
                        pathname.startsWith(item.href + "/");

                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            title={!open ? item.name : undefined}
                            className={`
                                group
                                relative
                                flex
                                items-center
                                rounded-xl
                                transition-all
                                duration-200
                                active:scale-[0.98]
                                ${
                                    active
                                        ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
                                        : "hover-app"
                                }
                                ${
                                    open
                                        ? "h-12 px-4 gap-3"
                                        : "h-12 justify-center px-0"
                                }
                            `}
                        >
                            {/* Icon */}
                            <Icon
                                size={19}
                                strokeWidth={active ? 2.5 : 2}
                                className="shrink-0 transition-transform duration-200 group-hover:scale-105"
                            />

                            {/* Menu Name */}
                            <span
                                className={`
                                    font-medium
                                    text-sm
                                    whitespace-nowrap
                                    overflow-hidden
                                    transition-all
                                    duration-300
                                    ${
                                        open
                                            ? "w-auto opacity-100"
                                            : "w-0 opacity-0"
                                    }
                                `}
                            >
                                {item.name}
                            </span>

                            {/* Tooltip when collapsed */}
                            {!open && (
                                <span
                                    className="
                                        pointer-events-none
                                        absolute
                                        left-full
                                        ml-3
                                        z-50
                                        whitespace-nowrap
                                        rounded-lg
                                        bg-gray-900
                                        px-3
                                        py-2
                                        text-xs
                                        font-medium
                                        text-white
                                        opacity-0
                                        translate-x-[-4px]
                                        transition-all
                                        duration-200
                                        group-hover:opacity-100
                                        group-hover:translate-x-0
                                    "
                                >
                                    {item.name}
                                </span>
                            )}
                        </Link>
                    );
                })}
            </nav>

            {/* ================= FOOTER ================= */}
            <div
                className={`
                    shrink-0
                    border-t
                    border-app
                    p-3
                    transition-all
                    duration-300
                    ${open ? "text-left" : "flex justify-center"}
                `}
            >
                {open ? (
                    <p className="text-xs text-muted px-1">
                        CRM Dashboard
                    </p>
                ) : (
                    <span
                        className="
                            w-8
                            h-8
                            rounded-lg
                            bg-blue-600
                            text-white
                            flex
                            items-center
                            justify-center
                            text-xs
                            font-bold
                        "
                    >
                        C
                    </span>
                )}
            </div>
        </aside>
    );
}