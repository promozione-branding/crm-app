// src/components/admin/Sidebar.jsx

'use client';

import React, { useState } from 'react';
import { LayoutDashboard, Users, ShoppingCart, Package, Settings, Menu, X, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const menuItems = [
    {
        title: 'Dashboard',
        icon: LayoutDashboard,
        href: '/admin/dashboard',
    },
    {
        title: 'Users',
        icon: Users,
        href: '/admin/users',
    },
    {
        title: 'Settings',
        icon: Settings,
        href: '/admin/settings',
    },
];

export default function Sidebar() {
    const [open, setOpen] = useState(false);
    const pathname = usePathname();

    return (
        <>
            {/* Mobile Button */}
            <div className="fixed -top-1 z-50 flex w-full items-center justify-between bg-white px-2 shadow-lg md:hidden">
                <div>
                    <div className="h-15 w-auto p-2">
                        <img src="/logocheck.webp" alt="logo" className="h-full w-full" />
                    </div>
                </div>
                <button onClick={() => setOpen(!open)} className="rounded-lg bg-gray-200 p-2 text-gray-800 shadow-lg">
                    <Menu size={24} />
                </button>
            </div>

            {/* Desktop Sidebar */}
            <aside className="sticky top-0 hidden h-screen w-64 flex-col justify-between border-r border-gray-300 bg-white md:flex">
                <div>
                    <div className="flex items-center justify-center border-b border-gray-300">
                        <div className="h-15 w-auto p-2">
                            <img src="/logocheck.webp" alt="logo" className="h-full w-full" />
                        </div>
                    </div>

                    <nav className="space-y-2 p-4">
                        {menuItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = pathname === item.href;

                            return (
                                <motion.div key={item.title} whileHover={{ x: 5 }} whileTap={{ scale: 0.97 }}>
                                    <Link
                                        href={item.href}
                                        className={`flex items-center gap-3 rounded-xl p-3 transition ${isActive ? 'bg-indigo-600 text-white shadow-lg' : 'text-gray-700 hover:bg-gray-100'}`}
                                    >
                                        <Icon size={20} />
                                        {item.title}
                                    </Link>
                                </motion.div>
                            );
                        })}
                    </nav>
                </div>

                <div className="border-t border-gray-300 px-4 py-3">
                    <button className="flex w-full items-center gap-3 rounded-md border border-red-200 bg-red-50 p-3 text-red-500 hover:bg-red-100">
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
                            className="fixed inset-0 z-40 bg-black md:hidden"
                        />

                        <motion.div
                            initial={{ x: -300 }}
                            animate={{ x: 0 }}
                            exit={{ x: -300 }}
                            transition={{ duration: 0.25 }}
                            className="fixed top-0 left-0 z-50 flex h-screen w-72 flex-col justify-between bg-white shadow-xl md:hidden"
                        >
                            <div>
                                <nav className="space-y-2 p-4 text-gray-800">
                                    {menuItems.map((item) => {
                                        const Icon = item.icon;
                                        const isActive = pathname === item.href;

                                        return (
                                            <motion.div key={item.title} whileTap={{ scale: 0.95 }}>
                                                <Link
                                                    href={item.href}
                                                    onClick={() => setOpen(false)}
                                                    className={`flex items-center gap-3 rounded-xl p-3 transition ${isActive ? 'bg-indigo-600 text-white' : 'text-gray-700 hover:bg-gray-100'}`}
                                                >
                                                    <Icon size={20} />
                                                    {item.title}
                                                </Link>
                                            </motion.div>
                                        );
                                    })}
                                </nav>
                            </div>

                            <div className="border-t border-gray-300 px-4 py-3">
                                <button className="flex w-full items-center gap-3 rounded-md border border-red-200 bg-red-50 p-3 text-red-500 hover:bg-red-100">
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
