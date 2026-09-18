// src/components/user/Navbar.jsx

'use client';

import { Bell, Moon, Sun, UserCircle, Settings, User, LogOut } from 'lucide-react';
import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';
import { toggleTheme } from '@/redux/user/themeSlice';
import { useEffect, useRef, useState } from 'react';
import { getMe } from '@/redux/user/userAuthSlice';
import axios from 'axios';
import { logout } from '@/redux/user/userAuthSlice';
import { useRouter } from 'next/navigation';

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

            if (notificationRef.current && !notificationRef.current.contains(e.target)) {
                setShowNotification(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);

        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLogout = async () => {
        try {
            await axios.post('/api/user/auth/logout', {}, { withCredentials: true });
            dispatch(logout());
            router.push('/login');
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <header className="bg-app border-app text-app sticky top-0 z-50 flex h-16 items-center justify-between border-b px-6">
            <h1 className="text-xl font-semibold">
                <span className="flex text-blue-600 md:hidden">CRM</span>
            </h1>

            <div className="flex items-center gap-3">
                <button
                    onClick={() => dispatch(toggleTheme())}
                    className="border-app hover-app flex h-10 w-10 items-center justify-center rounded-xl border transition"
                >
                    {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                </button>

                {/* Notification */}
                <div className="relative" ref={notificationRef}>
                    <button
                        onClick={() => {
                            setShowNotification((prev) => !prev);
                            setShowProfile(false);
                        }}
                        className="border-app hover-app flex h-10 w-10 items-center justify-center rounded-xl border transition"
                    >
                        <Bell size={20} />
                    </button>

                    {showNotification && (
                        <div className="bg-card border-app absolute right-0 z-50 mt-2 w-72 overflow-hidden rounded-xl border shadow-lg">
                            <div className="border-app flex items-center justify-between border-b px-4 py-3 font-semibold">
                                <p>Notifications</p>

                                <div className="rounded-md bg-blue-500 px-1.5 py-0.5 text-xs font-light text-white">0</div>
                            </div>

                            <div className="text-muted p-6 text-center text-sm">No notifications yet.</div>
                        </div>
                    )}
                </div>

                {/* Profile */}
                <div className="relative" ref={profileRef}>
                    <button
                        onClick={() => {
                            setShowProfile((prev) => !prev);
                            setShowNotification(false);
                        }}
                        className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-white"
                    >
                        <UserCircle size={22} />
                    </button>

                    {showProfile && (
                        <div className="bg-card border-app absolute right-0 z-50 mt-2 w-60 overflow-hidden rounded-xl border shadow-lg">
                            <div className="border-app border-b px-4 py-4">
                                <p className="text-app font-semibold">{user?.name || ''}</p>

                                <p className="text-muted text-sm">{user?.email || ''}</p>
                            </div>

                            <Link href="/profile" className="hover-app flex items-center gap-3 px-4 py-3 transition">
                                <User size={18} />
                                Profile
                            </Link>

                            <Link href="/settings" className="hover-app flex items-center gap-3 px-4 py-3 transition">
                                <Settings size={18} />
                                Settings
                            </Link>

                            <button onClick={handleLogout} className="flex w-full items-center gap-3 px-4 py-3 text-red-500 transition hover:bg-red-500/10">
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
