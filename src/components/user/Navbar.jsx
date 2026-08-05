"use client";

import {
    Bell,
    Moon,
    Sun,
    UserCircle,
    Settings,
    User,
    LogOut,
} from "lucide-react";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { toggleTheme } from "@/redux/user/themeSlice";
import { useEffect, useRef, useState } from "react";
import { getMe } from "@/redux/user/userAuthSlice";
import axios from "axios";
import { logout } from "@/redux/user/userAuthSlice";
import { useRouter } from "next/navigation";

export default function Navbar() {
    const router = useRouter();
    const dispatch = useDispatch();
    const theme = useSelector((state) => state.theme.mode);
    const user = useSelector((state) => state.userAuth.user);
    const [showProfile, setShowProfile] = useState(false);
    const [showNotification, setShowNotification] = useState(false);
    const profileRef = useRef(null);
    const notificationRef = useRef(null);

    useEffect(() => {
        dispatch(getMe());
    }, []);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (profileRef.current && !profileRef.current.contains(e.target)) {
                setShowProfile(false);
            }

            if (
                notificationRef.current &&
                !notificationRef.current.contains(e.target)
            ) {
                setShowNotification(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleLogout = async () => {
        try {
            await axios.post("/api/user/auth/logout", {}, { withCredentials: true });
            dispatch(logout());
            router.push("/login");
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <header className="h-16 px-6 flex items-center justify-between bg-app border-b border-app text-app sticky top-0 z-50">
            <h1 className="text-xl font-semibold">
                <span className="text-blue-600 flex md:hidden">CRM</span>
            </h1>

            <div className="flex items-center gap-3">
                <button
                    onClick={() => dispatch(toggleTheme())}
                    className="w-10 h-10 rounded-xl border border-app hover-app flex items-center justify-center transition"
                >
                    {theme === "dark" ? (
                        <Sun size={20} />
                    ) : (
                        <Moon size={20} />
                    )}
                </button>

                {/* Notification */}
                <div className="relative" ref={notificationRef}>
                    <button onClick={() => { setShowNotification((prev) => !prev); setShowProfile(false); }} className="w-10 h-10 rounded-xl border border-app hover-app flex items-center justify-center transition">
                        <Bell size={20} />
                    </button>

                    {showNotification && (
                        <div className="absolute right-0 mt-2 w-72 bg-card border border-app rounded-xl shadow-lg overflow-hidden z-50">
                            <div className="px-4 py-3 border-b border-app font-semibold">
                                Notifications
                            </div>

                            <div className="p-6 text-center text-muted">
                                No notifications yet.
                            </div>
                        </div>
                    )}
                </div>

                {/* Profile */}
                <div className="relative" ref={profileRef}>
                    <button onClick={() => { setShowProfile((prev) => !prev); setShowNotification(false); }} className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center">
                        <UserCircle size={22} />
                    </button>

                    {showProfile && (
                        <div className="absolute right-0 mt-2 w-60 bg-card border border-app rounded-xl shadow-lg overflow-hidden z-50">
                            <div className="px-4 py-4 border-b border-app">
                                <p className="font-semibold text-app">
                                    {user?.name || ""}
                                </p>

                                <p className="text-sm text-muted">
                                    {user?.email || ""}
                                </p>
                            </div>

                            <Link href="/profile" className="flex items-center gap-3 px-4 py-3 hover-app transition">
                                <User size={18} />
                                Profile
                            </Link>

                            <Link href="/settings" className="flex items-center gap-3 px-4 py-3 hover-app transition">
                                <Settings size={18} />
                                Settings
                            </Link>

                            <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-500/10 transition">
                                <LogOut size={18} />
                                Logout
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}