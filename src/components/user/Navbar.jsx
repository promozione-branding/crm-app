// src/components/user/Navbar.jsx

'use client';

import { Bell, Moon, Sun, UserCircle, Settings, User, LogOut } from 'lucide-react';
import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';
import { toggleTheme } from '@/redux/user/themeSlice';
import { useEffect, useRef, useState } from 'react';
import { getMe, logout } from '@/redux/user/userAuthSlice';
import axios from 'axios';
import { useRouter } from 'next/navigation';

import { usePermissionMap } from '@/lib/permissions';
import { clearPermissionCache } from '@/lib/permissions';

export default function Navbar() {
    const router = useRouter();
    const dispatch = useDispatch();
    const theme = useSelector((state) => state.theme.mode);
    const user = useSelector((state) => state.userAuth.user);

    const [showProfile, setShowProfile] = useState(false);
    const [showNotification, setShowNotification] = useState(false);

    const [notifications, setNotifications] = useState({
        leads: [],
        tasks: [],
        unreadCount: 0,
    });

    const profileRef = useRef(null);
    const notificationRef = useRef(null);

    const { map } = usePermissionMap();

    useEffect(() => {
        dispatch(getMe());
    }, []);

    // ---------------- NOTIFICATIONS (SSE) ----------------
    useEffect(() => {
        let eventSource;

        const load = async () => {
            try {
                const res = await axios.get('/api/user/notification', {
                    withCredentials: true,
                });
                setNotifications(res.data?.data || { leads: [], tasks: [], unreadCount: 0 });
            } catch (err) {
                // silent
            }
        };

        load();

        eventSource = new EventSource('/api/user/notification/stream');

        eventSource.addEventListener('new-notifications', (e) => {
            try {
                const payload = JSON.parse(e.data);

                setNotifications((prev) => {
                    const merge = (oldArr, newArr) => {
                        const m = new Map();
                        [...newArr, ...oldArr].forEach((n) => m.set(n._id, n));
                        return Array.from(m.values()).slice(0, 20);
                    };

                    return {
                        leads: merge(prev.leads, payload.leads),
                        tasks: merge(prev.tasks, payload.tasks),
                        unreadCount: payload.unreadCount,
                    };
                });
            } catch (err) {
                console.error('SSE PARSE ERROR:', err);
            }
        });

        eventSource.onerror = () => {
            // Browser auto-reconnects
        };

        return () => {
            eventSource?.close();
        };
    }, []);

    // ---------------- CLICK OUTSIDE ----------------
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

    // ---------------- LOGOUT ----------------
    const handleLogout = async () => {
        try {
            await axios.post('/api/user/auth/logout', {}, { withCredentials: true });
        } catch (error) {
            console.log('Logout API error:', error);
        } finally {
            clearPermissionCache();
            dispatch(logout());
            window.location.replace('/login');
        }
    };

    // ---------------- NOTIFICATION CLICK ----------------
    const handleNotificationClick = async (n) => {
        if (!n.isRead) {
            try {
                await axios.patch(`/api/user/notification/${n._id}`, {}, { withCredentials: true });

                setNotifications((prev) => ({
                    ...prev,
                    unreadCount: Math.max(0, prev.unreadCount - 1),
                    leads: prev.leads.map((x) => (x._id === n._id ? { ...x, isRead: true } : x)),
                    tasks: prev.tasks.map((x) => (x._id === n._id ? { ...x, isRead: true } : x)),
                }));
            } catch (err) {
                // silent
            }
        }

        setShowNotification(false);

        if (n.refModel === 'Lead') router.push(`/leads/edit/${n.refId}`);
        else if (n.refModel === 'LeadTask') router.push(`/tasks/edit/${n.refId}`);
    };

    // ---------------- MARK ALL READ ----------------
    const handleMarkAllRead = async () => {
        try {
            await axios.post('/api/user/notification/read-all', {}, { withCredentials: true });

            setNotifications((prev) => ({
                leads: prev.leads.map((x) => ({ ...x, isRead: true })),
                tasks: prev.tasks.map((x) => ({ ...x, isRead: true })),
                unreadCount: 0,
            }));
        } catch (err) {
            // silent
        }
    };

    // ---------------- VIEW ALL ----------------
    const handleViewAll = () => {
        setShowNotification(false);
        router.push('/notifications');
    };

    return (
        <header className="bg-app border-app text-app sticky top-0 z-50 flex h-16 items-center justify-between border-b px-6">
            <h1 className="text-xl font-semibold">
                <span className="flex text-blue-600 md:hidden">CRM</span>
            </h1>

            <div className="flex items-center gap-3">
                {/* THEME TOGGLE */}
                <button
                    onClick={() => dispatch(toggleTheme())}
                    className="border-app hover-app flex h-10 w-10 items-center justify-center rounded-xl border transition"
                >
                    {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                </button>

                {/* ================= NOTIFICATION ================= */}
                <div className="relative" ref={notificationRef}>
                    <button
                        onClick={() => {
                            setShowNotification((prev) => !prev);
                            setShowProfile(false);
                        }}
                        className="border-app hover-app relative flex h-10 w-10 items-center justify-center rounded-xl border transition"
                    >
                        <Bell size={20} />

                        {notifications.unreadCount > 0 && (
                            <span className="absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[9px] font-bold text-white">
                                {notifications.unreadCount > 9 ? '9+' : notifications.unreadCount}
                            </span>
                        )}
                    </button>

                    {showNotification && (
                        <div className="bg-card border-app absolute right-0 z-50 mt-2 w-80 overflow-hidden rounded-xl border shadow-lg">
                            <div className="border-app flex items-center justify-between border-b px-4 py-3 font-semibold">
                                <p>Notifications</p>

                                <div className="flex items-center gap-2">
                                    <div className="rounded-md bg-blue-500 px-1.5 py-0.5 text-xs font-light text-white">{notifications.unreadCount}</div>

                                    {notifications.unreadCount > 0 && (
                                        <button onClick={handleMarkAllRead} className="text-xs text-blue-500 hover:underline">
                                            Mark all
                                        </button>
                                    )}
                                </div>
                            </div>

                            <div className="max-h-96 overflow-y-auto">
                                {/* ---------- LEADS ---------- */}
                                <div className="border-app bg-app/50 border-b px-4 py-2 text-xs font-semibold uppercase opacity-70">Leads</div>

                                {notifications.leads.length === 0 ? (
                                    <div className="text-muted px-4 py-3 text-xs">No lead notifications</div>
                                ) : (
                                    notifications.leads.map((n) => (
                                        <button
                                            key={n._id}
                                            onClick={() => handleNotificationClick(n)}
                                            className={`border-app flex w-full items-start gap-3 border-b px-4 py-3 text-left transition ${
                                                !n.isRead ? 'bg-blue-500/5' : ''
                                            } hover:bg-blue-500/10`}
                                        >
                                            <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-500/10 text-blue-500">
                                                <User size={14} />
                                            </div>

                                            <div className="min-w-0 flex-1">
                                                <p className="text-app truncate text-sm font-medium">{n.title}</p>
                                                <p className="text-muted truncate text-xs">{n.message}</p>
                                                <p className="text-muted mt-0.5 text-[10px]">{new Date(n.createdAt).toLocaleString('en-IN')}</p>
                                            </div>

                                            {!n.isRead && <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-blue-500" />}
                                        </button>
                                    ))
                                )}

                                {/* ---------- TASKS ---------- */}
                                <div className="border-app bg-app/50 border-b px-4 py-2 text-xs font-semibold uppercase opacity-70">Tasks</div>

                                {notifications.tasks.length === 0 ? (
                                    <div className="text-muted px-4 py-3 text-xs">No task notifications</div>
                                ) : (
                                    notifications.tasks.map((n) => (
                                        <button
                                            key={n._id}
                                            onClick={() => handleNotificationClick(n)}
                                            className={`border-app flex w-full items-start gap-3 border-b px-4 py-3 text-left transition ${
                                                !n.isRead ? 'bg-blue-500/5' : ''
                                            } hover:bg-blue-500/10`}
                                        >
                                            <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500">
                                                <Bell size={14} />
                                            </div>

                                            <div className="min-w-0 flex-1">
                                                <p className="text-app truncate text-sm font-medium">{n.title}</p>
                                                <p className="text-muted truncate text-xs">{n.message}</p>
                                                <p className="text-muted mt-0.5 text-[10px]">{new Date(n.createdAt).toLocaleString('en-IN')}</p>
                                            </div>

                                            {!n.isRead && <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-blue-500" />}
                                        </button>
                                    ))
                                )}
                            </div>

                            {/* ---------- VIEW ALL / HISTORY ---------- */}
                            <button
                                onClick={handleViewAll}
                                className="border-app text-app hover-app w-full border-t px-4 py-3 text-center text-sm font-medium transition"
                            >
                                View all notifications →
                            </button>
                        </div>
                    )}
                </div>

                {/* ================= PROFILE ================= */}
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

                            {map['profile.access'] && (
                                <Link href="/profile" className="hover-app flex items-center gap-3 px-4 py-3 transition">
                                    <User size={18} />
                                    Profile
                                </Link>
                            )}

                            {map['settings.access'] && (
                                <Link href="/settings" className="hover-app flex items-center gap-3 px-4 py-3 transition">
                                    <Settings size={18} />
                                    Settings
                                </Link>
                            )}

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
