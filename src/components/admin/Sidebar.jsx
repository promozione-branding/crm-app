"use client";

import React, { useState } from "react";
import {
    LayoutDashboard,
    Users,
    ShoppingCart,
    Package,
    Settings,
    Menu,
    X,
    LogOut,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";

const menuItems = [
    {
        title: "Dashboard",
        icon: LayoutDashboard,
        href: "/admin/dashboard"
    },
    {
        title: "Users",
        icon: Users,
        href: "/admin/users"
    },
    {
        title: "Settings",
        icon: Settings,
        href: "/admin/settings"
    },
];

export default function Sidebar() {
    const [open, setOpen] = useState(false);
    const pathname = usePathname();

    return (
        <>
            {/* Mobile Button */}
            <div className="flex justify-between items-center md:hidden fixed -top-1 z-50 px-2 bg-white shadow-lg w-full">
                <div>
                    <div className="w-auto h-15 p-2">
                        <img src="/logocheck.webp" alt="logo" className="w-full h-full" />
                    </div>
                </div>
                <button onClick={() => setOpen(!open)}
                    className="bg-gray-200 text-gray-800 shadow-lg rounded-lg p-2"
                >
                    <Menu size={24} />
                </button>
            </div>

            {/* Desktop Sidebar */}
            <aside className="hidden md:flex w-64 h-screen sticky top-0 bg-white border-r border-gray-300 flex-col justify-between">
                <div>
                    <div className="flex items-center justify-center border-b border-gray-300">
                        <div className="w-auto h-15 p-2">
                            <img src="/logocheck.webp" alt="logo" className="w-full h-full" />
                        </div>
                    </div>

                    <nav className="p-4 space-y-2">
                        {menuItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = pathname === item.href;

                            return (
                                <motion.div
                                    key={item.title}
                                    whileHover={{ x: 5 }}
                                    whileTap={{ scale: 0.97 }}
                                >
                                    <Link
                                        href={item.href}
                                        className={`flex items-center gap-3 p-3 rounded-xl transition
        ${isActive
                                                ? "bg-indigo-600 text-white shadow-lg"
                                                : "text-gray-700 hover:bg-gray-100"
                                            }`}
                                    >
                                        <Icon size={20} />
                                        {item.title}
                                    </Link>
                                </motion.div>
                            );
                        })}
                    </nav>
                </div>

                <div className="py-3 px-4 border-t border-gray-300">
                    <button className="w-full flex items-center gap-3 p-3 rounded-md hover:bg-red-100 border border-red-200 bg-red-50 text-red-500">
                        <LogOut size={20} />
                        Logout
                    </button>
                </div>
            </aside>

            {/* Mobile Sidebar */}
            <AnimatePresence>
                {open && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 0.4 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setOpen(false)}
                            className="fixed inset-0 bg-black z-40 md:hidden"
                        />

                        <motion.div
                            initial={{ x: -300 }}
                            animate={{ x: 0 }}
                            exit={{ x: -300 }}
                            transition={{ duration: 0.25 }}
                            className="fixed left-0 top-0 w-72 h-screen bg-white z-50 shadow-xl md:hidden flex flex-col justify-between"
                        >
                            <div>

                                <nav className="p-4 space-y-2 text-gray-800">
                                    {menuItems.map((item) => {
                                        const Icon = item.icon;
                                        const isActive = pathname === item.href;

                                        return (
                                            <motion.div key={item.title} whileTap={{ scale: 0.95 }}>
                                                <Link
                                                    href={item.href}
                                                    onClick={() => setOpen(false)}
                                                    className={`flex items-center gap-3 p-3 rounded-xl transition
        ${isActive
                                                            ? "bg-indigo-600 text-white"
                                                            : "text-gray-700 hover:bg-gray-100"
                                                        }`}
                                                >
                                                    <Icon size={20} />
                                                    {item.title}
                                                </Link>
                                            </motion.div>
                                        );
                                    })}
                                </nav>
                            </div>

                            <div className="py-3 px-4 border-t border-gray-300">
                                <button className="w-full flex items-center gap-3 p-3 rounded-md hover:bg-red-100 border border-red-200 bg-red-50 text-red-500">
                                    <LogOut size={20} />
                                    Logout
                                </button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}