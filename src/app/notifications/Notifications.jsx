// src/app/notifications/Notifications.jsx

'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import {
    Bell,
    BellOff,
    CheckCheck,
    CheckCircle2,
    Clock3,
    RefreshCw,
    Trash2,
    Filter,
    Mail,
    AlertTriangle,
    UserPlus,
    ClipboardCheck,
    CalendarDays,
    X,
    ChevronRight,
    LoaderCircle,
} from 'lucide-react';

const FILTERS = [
    { value: 'all', label: 'All notifications' },
    { value: 'unread', label: 'Unread' },
    { value: 'assignment', label: 'Assignments' },
    { value: 'reminder', label: 'Reminders' },
];

const TYPE_CONFIG = {
    lead_assigned: {
        label: 'Lead assigned',
        icon: UserPlus,
        color: 'text-blue-500',
        bg: 'bg-blue-500/10',
    },
    task_assigned: {
        label: 'Task assigned',
        icon: ClipboardCheck,
        color: 'text-indigo-500',
        bg: 'bg-indigo-500/10',
    },
    task_reminder: {
        label: 'Task reminder',
        icon: Clock3,
        color: 'text-amber-500',
        bg: 'bg-amber-500/10',
    },
    meeting_reminder: {
        label: 'Meeting reminder',
        icon: CalendarDays,
        color: 'text-emerald-500',
        bg: 'bg-emerald-500/10',
    },
    overdue_task: {
        label: 'Overdue task',
        icon: AlertTriangle,
        color: 'text-red-500',
        bg: 'bg-red-500/10',
    },
};

function formatDate(value) {
    if (!value) return 'Recently';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return 'Recently';

    return new Intl.DateTimeFormat('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
    }).format(date);
}

function getTypeConfig(type) {
    return (
        TYPE_CONFIG[type] || {
            label: 'Notification',
            icon: Bell,
            color: 'text-blue-500',
            bg: 'bg-blue-500/10',
        }
    );
}

export default function Notifications() {
    const [notifications, setNotifications] = useState([]);
    const [activeFilter, setActiveFilter] = useState('all');
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [busyKey, setBusyKey] = useState('');
    const [error, setError] = useState('');
    const [notice, setNotice] = useState('');

    const loadNotifications = useCallback(async (showLoader = true) => {
        if (showLoader) setLoading(true);
        else setRefreshing(true);

        setError('');
        try {
            const response = await fetch('/api/notification-center', {
                method: 'GET',
                cache: 'no-store',
                credentials: 'same-origin',
            });
            const data = await response.json();

            if (!response.ok || !data.success) {
                throw new Error(data.message || 'Unable to load notifications.');
            }

            setNotifications(Array.isArray(data.notifications) ? data.notifications : []);
        } catch (err) {
            setError(err.message || 'Something went wrong while loading notifications.');
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, []);

    useEffect(() => {
        loadNotifications();
    }, [loadNotifications]);

    const unreadCount = useMemo(() => notifications.filter((item) => !item.isRead).length, [notifications]);
    const readCount = notifications.length - unreadCount;
    const overdueCount = useMemo(() => notifications.filter((item) => item.type === 'overdue_task').length, [notifications]);

    const filteredNotifications = useMemo(
        () =>
            notifications.filter((item) => {
                if (activeFilter === 'unread') return !item.isRead;
                if (activeFilter === 'assignment') return item.source === 'assignment';
                if (activeFilter === 'reminder') return item.source === 'reminder';
                return true;
            }),
        [notifications, activeFilter]
    );

    const updateNotification = async (item, action) => {
        const key = `${item.source}:${item._id}`;
        setBusyKey(key);
        setError('');
        setNotice('');

        try {
            const response = await fetch('/api/notification-center', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'same-origin',
                body: JSON.stringify({ id: item._id, source: item.source, action }),
            });
            const data = await response.json();

            if (!response.ok || !data.success) {
                throw new Error(data.message || 'Unable to update this notification.');
            }

            if (action === 'dismiss' && item.source === 'reminder') {
                setNotifications((current) => current.filter((notification) => !(notification._id === item._id && notification.source === item.source)));
                setNotice('Reminder dismissed.');
            } else {
                setNotifications((current) =>
                    current.map((notification) =>
                        notification._id === item._id && notification.source === item.source ? { ...notification, isRead: true } : notification
                    )
                );
                setNotice('Notification marked as read.');
            }
        } catch (err) {
            setError(err.message || 'Unable to update this notification.');
        } finally {
            setBusyKey('');
        }
    };

    const markAllAsRead = async () => {
        const unread = notifications.filter((item) => !item.isRead);
        if (!unread.length || busyKey) return;

        for (const item of unread) {
            await updateNotification(item, 'read');
        }
    };

    const clearReadReminders = async () => {
        const readReminders = notifications.filter((item) => item.source === 'reminder' && item.isRead);
        if (!readReminders.length || busyKey) return;

        for (const item of readReminders) {
            await updateNotification(item, 'dismiss');
        }
    };

    const stats = [
        { label: 'All notifications', value: notifications.length, icon: Bell, color: 'text-blue-500' },
        { label: 'Unread', value: unreadCount, icon: Mail, color: 'text-amber-500' },
        { label: 'Read', value: readCount, icon: CheckCircle2, color: 'text-emerald-500' },
        { label: 'Overdue tasks', value: overdueCount, icon: AlertTriangle, color: 'text-red-500' },
    ];

    return (
        <main className="bg-surface text-app min-h-[calc(100vh-64px)] w-full max-w-full min-w-0 overflow-x-clip p-3 sm:p-4 md:p-6">
            {/* Header */}
            <div className="mb-6 flex min-w-0 flex-wrap items-center justify-between gap-3">
                <div className="flex min-w-0 items-start gap-3">
                    <div className="mt-1 flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-500/10 text-blue-500">
                        <Bell size={23} />
                    </div>
                    <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                            <h1 className="text-2xl font-bold sm:text-3xl">Notifications</h1>
                            {unreadCount > 0 && (
                                <span className="rounded-full bg-blue-500/10 px-2.5 py-1 text-xs font-semibold text-blue-500">{unreadCount} new</span>
                            )}
                        </div>
                        <p className="text-muted mt-1 text-xs sm:text-sm">Stay updated with your CRM activities.</p>
                    </div>
                </div>

                <div className="flex w-full flex-wrap items-center justify-end gap-2 sm:w-auto">
                    <button
                        type="button"
                        onClick={() => loadNotifications(false)}
                        disabled={loading || refreshing}
                        className="border-app text-app inline-flex items-center gap-2 rounded-lg border px-3 py-2.5 text-sm transition hover:bg-blue-500/5 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        <RefreshCw size={16} className={refreshing ? 'animate-spin' : ''} />
                        <span>{refreshing ? 'Refreshing...' : 'Refresh'}</span>
                    </button>
                    <button
                        type="button"
                        onClick={markAllAsRead}
                        disabled={unreadCount === 0 || Boolean(busyKey)}
                        className="inline-flex items-center gap-2 rounded-lg bg-blue-500 px-3 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        <CheckCheck size={16} />
                        <span className="hidden sm:inline">Mark all read</span>
                        <span className="sm:hidden">Read all</span>
                    </button>
                    <button
                        type="button"
                        onClick={clearReadReminders}
                        disabled={!notifications.some((item) => item.source === 'reminder' && item.isRead) || Boolean(busyKey)}
                        aria-label="Clear read reminders"
                        title="Clear read reminders"
                        className="text-muted rounded-lg p-2.5 transition hover:bg-red-500/10 hover:text-red-500 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                        <Trash2 size={18} />
                    </button>
                </div>
            </div>

            {error && (
                <div className="mb-4 flex items-start gap-2 rounded-lg border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-600" role="alert">
                    <AlertTriangle size={18} className="mt-0.5 shrink-0" />
                    <span className="min-w-0 flex-1 break-words">{error}</span>
                    <button type="button" onClick={() => setError('')} aria-label="Dismiss error" className="rounded p-1 hover:bg-red-500/10">
                        <X size={16} />
                    </button>
                </div>
            )}
            {notice && (
                <div
                    className="mb-4 flex items-start gap-2 rounded-lg border border-emerald-500/20 bg-emerald-500/10 p-3 text-sm text-emerald-600"
                    role="status"
                >
                    <CheckCircle2 size={18} className="mt-0.5 shrink-0" />
                    <span className="min-w-0 flex-1">{notice}</span>
                    <button type="button" onClick={() => setNotice('')} aria-label="Dismiss message" className="rounded p-1 hover:bg-emerald-500/10">
                        <X size={16} />
                    </button>
                </div>
            )}

            {/* Summary cards */}
            <div className="mb-5 grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
                {stats.map((stat) => {
                    const Icon = stat.icon;
                    return (
                        <div key={stat.label} className="bg-app border-app min-w-0 rounded-xl border p-3 shadow-sm sm:p-4">
                            <div className="flex items-center justify-between gap-2">
                                <p className="text-muted min-w-0 text-xs break-words sm:text-sm">{stat.label}</p>
                                <Icon size={19} className={`${stat.color} shrink-0`} />
                            </div>
                            <p className="mt-2 text-2xl font-bold sm:text-3xl">{stat.value}</p>
                        </div>
                    );
                })}
            </div>

            {/* Main notifications panel */}
            <section className="bg-app border-app flex min-h-[420px] min-w-0 flex-col overflow-hidden rounded-xl border shadow-sm">
                <div className="border-app flex min-w-0 flex-col gap-3 border-b p-3 sm:p-4 lg:flex-row lg:items-center lg:justify-between">
                    <div className="min-w-0">
                        <h2 className="font-semibold">Your activity</h2>
                        <p className="text-muted mt-1 text-xs sm:text-sm">Assignments, reminders and items that need your attention.</p>
                    </div>
                    <div className="flex min-w-0 items-center gap-2">
                        <Filter size={17} className="text-muted shrink-0" />
                        <div className="bg-surface border-app flex max-w-full min-w-0 gap-1 overflow-x-auto rounded-lg border p-1">
                            {FILTERS.map((filter) => (
                                <button
                                    key={filter.value}
                                    type="button"
                                    onClick={() => setActiveFilter(filter.value)}
                                    className={`shrink-0 rounded-md px-3 py-2 text-xs font-medium transition sm:text-sm ${
                                        activeFilter === filter.value ? 'bg-blue-500 text-white shadow-sm' : 'text-muted hover:text-app hover:bg-blue-500/5'
                                    }`}
                                >
                                    {filter.label}
                                    {filter.value === 'unread' && unreadCount > 0 && (
                                        <span
                                            className={`ml-1.5 rounded-full px-1.5 py-0.5 text-[10px] ${
                                                activeFilter === filter.value ? 'bg-white/20 text-white' : 'bg-blue-500/10 text-blue-500'
                                            }`}
                                        >
                                            {unreadCount}
                                        </span>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="min-w-0 flex-1">
                    {loading ? (
                        <div className="flex min-h-72 flex-col items-center justify-center px-5 py-12 text-center">
                            <LoaderCircle size={30} className="mb-3 animate-spin text-blue-500" />
                            <p className="text-muted text-sm">Loading your notifications...</p>
                        </div>
                    ) : filteredNotifications.length === 0 ? (
                        <div className="flex min-h-72 flex-col items-center justify-center px-5 py-12 text-center">
                            <div className="mb-4 rounded-full bg-blue-500/10 p-4 text-blue-500">
                                <BellOff size={28} />
                            </div>
                            <h3 className="font-semibold">No notifications found</h3>
                            <p className="text-muted mt-1 max-w-sm text-sm">You&apos;re all caught up. New updates will appear here.</p>
                            {activeFilter !== 'all' && (
                                <button
                                    type="button"
                                    onClick={() => setActiveFilter('all')}
                                    className="mt-4 rounded-lg bg-blue-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-600"
                                >
                                    Clear filters
                                </button>
                            )}
                        </div>
                    ) : (
                        filteredNotifications.map((item) => {
                            const config = getTypeConfig(item.type);
                            const Icon = config.icon;
                            const key = `${item.source}:${item._id}`;
                            const busy = busyKey === key;

                            return (
                                <article
                                    key={key}
                                    className={`border-app group flex min-w-0 items-start gap-3 border-b p-3 transition sm:gap-4 sm:p-4 ${
                                        !item.isRead ? 'bg-blue-500/[0.035]' : 'hover:bg-blue-500/[0.025]'
                                    }`}
                                >
                                    <div
                                        className={`relative mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl sm:h-11 sm:w-11 ${config.bg} ${config.color}`}
                                    >
                                        <Icon size={20} />
                                        {!item.isRead && (
                                            <span className="absolute -top-1 -right-1 h-2.5 w-2.5 rounded-full border-2 border-[var(--notification-border,#fff)] bg-blue-500" />
                                        )}
                                    </div>

                                    <div className="min-w-0 flex-1">
                                        <div className="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1">
                                            <h3 className={`min-w-0 text-sm break-words ${!item.isRead ? 'font-bold' : 'font-semibold'}`}>
                                                {item.title || 'Notification'}
                                            </h3>
                                            <span className={`rounded-md px-2 py-0.5 text-[10px] font-medium ${config.bg} ${config.color}`}>
                                                {config.label}
                                            </span>
                                        </div>
                                        <p className="text-muted mt-1 text-xs leading-5 break-words sm:text-sm">
                                            {item.message || 'There is an update in your CRM.'}
                                        </p>
                                        <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-2">
                                            <span className="text-muted inline-flex items-center gap-1 text-xs">
                                                <Clock3 size={12} />
                                                {formatDate(item.createdAt)}
                                            </span>
                                            {!item.isRead && (
                                                <button
                                                    type="button"
                                                    onClick={() => updateNotification(item, 'read')}
                                                    disabled={Boolean(busyKey)}
                                                    className="text-xs font-medium text-blue-500 transition hover:text-blue-600 disabled:opacity-50"
                                                >
                                                    {busy ? 'Updating...' : 'Mark as read'}
                                                </button>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex shrink-0 items-center gap-1">
                                        {item.source === 'reminder' && (
                                            <button
                                                type="button"
                                                onClick={() => updateNotification(item, 'dismiss')}
                                                disabled={Boolean(busyKey)}
                                                aria-label="Dismiss reminder"
                                                title="Dismiss reminder"
                                                className="text-muted rounded-lg p-2 transition hover:bg-red-500/10 hover:text-red-500 disabled:opacity-40 sm:opacity-0 sm:group-hover:opacity-100"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        )}
                                        <ChevronRight size={17} className="text-muted hidden sm:block" />
                                    </div>
                                </article>
                            );
                        })
                    )}
                </div>

                <div className="border-app text-muted mt-auto flex flex-wrap items-center justify-between gap-2 border-t px-3 py-3 text-xs sm:px-4">
                    <span>
                        Showing {filteredNotifications.length} of {notifications.length} notifications
                    </span>
                    <button
                        type="button"
                        onClick={clearReadReminders}
                        disabled={!notifications.some((item) => item.source === 'reminder' && item.isRead) || Boolean(busyKey)}
                        className="inline-flex items-center gap-1.5 transition hover:text-blue-500 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                        <Trash2 size={13} />
                        Clear read reminders
                    </button>
                </div>
            </section>
        </main>
    );
}
