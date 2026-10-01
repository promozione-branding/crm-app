
'use client';

import { useState } from 'react';
import {
    Bell,
    CheckCheck,
    Mail,
    CalendarDays,
    Users,
    CheckCircle2,
    Clock,
    AlertCircle,
    Trash2,
    Settings2,
    Filter,
    ChevronRight,
    BellOff,
} from 'lucide-react';

const initialNotifications = [
    {
        id: 1,
        title: 'New lead assigned',
        message: 'Rahul Sharma has been assigned to your team.',
        type: 'lead',
        time: '5 minutes ago',
        unread: true,
    },
    {
        id: 2,
        title: 'Upcoming meeting',
        message: 'Your meeting with Priya Verma is scheduled for 2:30 PM.',
        type: 'meeting',
        time: '20 minutes ago',
        unread: true,
    },
    {
        id: 3,
        title: 'Task deadline approaching',
        message: 'Follow up with the client before the end of the day.',
        type: 'task',
        time: '1 hour ago',
        unread: true,
    },
    {
        id: 4,
        title: 'Email sent successfully',
        message: 'Your email has been sent to the selected recipient.',
        type: 'email',
        time: '3 hours ago',
        unread: false,
    },
    {
        id: 5,
        title: 'Task completed',
        message: 'The client onboarding task has been marked as completed.',
        type: 'success',
        time: 'Yesterday',
        unread: false,
    },
    {
        id: 6,
        title: 'Reminder overdue',
        message: 'You have a pending reminder that needs your attention.',
        type: 'alert',
        time: 'Yesterday',
        unread: false,
    },
];

const notificationTypes = {
    lead: {
        icon: Users,
        color: 'text-blue-500',
        bg: 'bg-blue-500/10',
        label: 'Lead',
    },
    meeting: {
        icon: CalendarDays,
        color: 'text-purple-500',
        bg: 'bg-purple-500/10',
        label: 'Meeting',
    },
    task: {
        icon: Clock,
        color: 'text-amber-500',
        bg: 'bg-amber-500/10',
        label: 'Task',
    },
    email: {
        icon: Mail,
        color: 'text-cyan-500',
        bg: 'bg-cyan-500/10',
        label: 'Email',
    },
    success: {
        icon: CheckCircle2,
        color: 'text-emerald-500',
        bg: 'bg-emerald-500/10',
        label: 'Completed',
    },
    alert: {
        icon: AlertCircle,
        color: 'text-red-500',
        bg: 'bg-red-500/10',
        label: 'Reminder',
    },
};

export default function Notifications() {
    const [notifications, setNotifications] =
        useState(initialNotifications);

    const [activeFilter, setActiveFilter] = useState('all');
    const [activeTab, setActiveTab] = useState('all');

    const unreadCount = notifications.filter(
        (notification) => notification.unread
    ).length;

    const filteredNotifications = notifications.filter((notification) => {
        if (activeTab === 'unread' && !notification.unread) {
            return false;
        }

        if (
            activeFilter !== 'all' &&
            notification.type !== activeFilter
        ) {
            return false;
        }

        return true;
    });

    const markAsRead = (id) => {
        setNotifications((current) =>
            current.map((notification) =>
                notification.id === id
                    ? { ...notification, unread: false }
                    : notification
            )
        );
    };

    const markAllAsRead = () => {
        setNotifications((current) =>
            current.map((notification) => ({
                ...notification,
                unread: false,
            }))
        );
    };

    const deleteNotification = (id) => {
        setNotifications((current) =>
            current.filter((notification) => notification.id !== id)
        );
    };

    const clearReadNotifications = () => {
        setNotifications((current) =>
            current.filter((notification) => notification.unread)
        );
    };

    return (
        <div className="bg-surface text-app min-h-[calc(100vh-64px)] w-full max-w-full min-w-0 overflow-x-clip p-3 sm:p-4 md:p-6">
            {/* HEADER */}
            <div className="mb-6 flex min-w-0 flex-wrap items-center justify-between gap-3">
                <div className="flex min-w-0 items-start gap-3">
                    <div className="bg-blue-500/10 mt-1 rounded-xl p-2.5 text-blue-500">
                        <Bell size={23} />
                    </div>

                    <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                            <h1 className="text-2xl font-bold sm:text-3xl">
                                Notifications
                            </h1>

                            {unreadCount > 0 && (
                                <span className="rounded-full bg-blue-500/10 px-2.5 py-1 text-xs font-semibold text-blue-500">
                                    {unreadCount} new
                                </span>
                            )}
                        </div>

                        <p className="text-muted mt-1 text-xs sm:text-sm">
                            Stay updated with your CRM activities.
                        </p>
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                    <button
                        type="button"
                        onClick={markAllAsRead}
                        disabled={unreadCount === 0}
                        className="border-app text-app flex items-center gap-2 rounded-lg border px-3 py-2.5 text-sm transition hover:bg-blue-500/5 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        <CheckCheck size={16} />
                        <span className="hidden sm:inline">
                            Mark all read
                        </span>
                        <span className="sm:hidden">Read all</span>
                    </button>

                    <button
                        type="button"
                        onClick={clearReadNotifications}
                        disabled={!notifications.some((item) => !item.unread)}
                        className="text-muted rounded-lg p-2.5 transition hover:bg-red-500/10 hover:text-red-500 disabled:cursor-not-allowed disabled:opacity-50"
                        aria-label="Clear read notifications"
                        title="Clear read notifications"
                    >
                        <Trash2 size={18} />
                    </button>
                </div>
            </div>

            {/* MAIN CONTAINER */}
            <div className="bg-app border-app flex min-h-[calc(100vh-190px)] min-w-0 flex-col overflow-hidden rounded-xl border shadow-sm">
                {/* SUMMARY CARDS */}
                <div className="border-app grid grid-cols-2 gap-3 border-b p-3 sm:grid-cols-3 sm:gap-4 sm:p-4">
                    <div className="bg-surface border-app rounded-xl border p-3 sm:p-4">
                        <div className="flex items-center justify-between gap-2">
                            <p className="text-muted text-xs sm:text-sm">
                                All notifications
                            </p>
                            <Bell className="text-blue-500" size={18} />
                        </div>

                        <p className="mt-2 text-2xl font-bold">
                            {notifications.length}
                        </p>
                    </div>

                    <div className="bg-surface border-app rounded-xl border p-3 sm:p-4">
                        <div className="flex items-center justify-between gap-2">
                            <p className="text-muted text-xs sm:text-sm">
                                Unread
                            </p>
                            <Mail className="text-amber-500" size={18} />
                        </div>

                        <p className="mt-2 text-2xl font-bold">
                            {unreadCount}
                        </p>
                    </div>

                    <div className="bg-surface border-app col-span-2 rounded-xl border p-3 sm:col-span-1 sm:p-4">
                        <div className="flex items-center justify-between gap-2">
                            <p className="text-muted text-xs sm:text-sm">
                                Read
                            </p>
                            <CheckCircle2
                                className="text-emerald-500"
                                size={18}
                            />
                        </div>

                        <p className="mt-2 text-2xl font-bold">
                            {notifications.length - unreadCount}
                        </p>
                    </div>
                </div>

                {/* FILTER TOOLBAR */}
                <div className="border-app flex min-w-0 flex-col gap-3 border-b p-3 sm:flex-row sm:items-center sm:justify-between sm:p-4">
                    <div className="bg-surface border-app flex w-full rounded-lg border p-1 sm:w-auto">
                        {[
                            { value: 'all', label: 'All' },
                            { value: 'unread', label: 'Unread' },
                        ].map((tab) => (
                            <button
                                key={tab.value}
                                type="button"
                                onClick={() => setActiveTab(tab.value)}
                                className={`flex-1 rounded-md px-4 py-2 text-sm font-medium transition sm:flex-none ${
                                    activeTab === tab.value
                                        ? 'bg-blue-500 text-white shadow-sm'
                                        : 'text-muted hover:text-app'
                                }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    <div className="flex min-w-0 items-center gap-2">
                        <Filter
                            size={17}
                            className="text-muted shrink-0"
                        />

                        <select
                            value={activeFilter}
                            onChange={(event) =>
                                setActiveFilter(event.target.value)
                            }
                            className="bg-surface border-app text-app min-w-0 flex-1 rounded-lg border px-3 py-2.5 text-sm outline-none focus:border-blue-500 sm:flex-none"
                        >
                            <option value="all">All types</option>
                            <option value="lead">Leads</option>
                            <option value="meeting">Meetings</option>
                            <option value="task">Tasks</option>
                            <option value="email">Emails</option>
                            <option value="success">Completed</option>
                            <option value="alert">Reminders</option>
                        </select>
                    </div>
                </div>

                {/* NOTIFICATION LIST */}
                <div className="min-w-0 flex-1">
                    {filteredNotifications.length > 0 ? (
                        <div>
                            {filteredNotifications.map((notification) => {
                                const config =
                                    notificationTypes[notification.type] ||
                                    notificationTypes.alert;

                                const Icon = config.icon;

                                return (
                                    <div
                                        key={notification.id}
                                        className={`border-app group flex min-w-0 items-start gap-3 border-b p-3 transition sm:gap-4 sm:p-4 ${
                                            notification.unread
                                                ? 'bg-blue-500/[0.035]'
                                                : 'hover:bg-blue-500/[0.025]'
                                        }`}
                                    >
                                        {/* ICON */}
                                        <div
                                            className={`relative mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl sm:h-11 sm:w-11 ${config.bg} ${config.color}`}
                                        >
                                            <Icon size={20} />

                                            {notification.unread && (
                                                <span className="absolute -top-1 -right-1 h-2.5 w-2.5 rounded-full border-2 border-[var(--notification-border,#fff)] bg-blue-500" />
                                            )}
                                        </div>

                                        {/* CONTENT */}
                                        <div className="min-w-0 flex-1">
                                            <div className="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1">
                                                <h3
                                                    className={`min-w-0 break-words text-sm ${
                                                        notification.unread
                                                            ? 'font-bold'
                                                            : 'font-semibold'
                                                    }`}
                                                >
                                                    {notification.title}
                                                </h3>

                                                <span
                                                    className={`rounded-md px-2 py-0.5 text-[10px] font-medium ${config.bg} ${config.color}`}
                                                >
                                                    {config.label}
                                                </span>
                                            </div>

                                            <p className="text-muted mt-1 text-xs leading-5 break-words sm:text-sm">
                                                {notification.message}
                                            </p>

                                            <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-2">
                                                <span className="text-muted flex items-center gap-1 text-xs">
                                                    <Clock size={12} />
                                                    {notification.time}
                                                </span>

                                                {notification.unread && (
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            markAsRead(
                                                                notification.id
                                                            )
                                                        }
                                                        className="text-xs font-medium text-blue-500 transition hover:text-blue-600"
                                                    >
                                                        Mark as read
                                                    </button>
                                                )}
                                            </div>
                                        </div>

                                        {/* ACTIONS */}
                                        <div className="flex shrink-0 items-center gap-1">
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    deleteNotification(
                                                        notification.id
                                                    )
                                                }
                                                aria-label="Delete notification"
                                                title="Delete notification"
                                                className="text-muted rounded-lg p-2 transition hover:bg-red-500/10 hover:text-red-500 sm:opacity-0 sm:group-hover:opacity-100"
                                            >
                                                <Trash2 size={16} />
                                            </button>

                                            <ChevronRight
                                                size={17}
                                                className="text-muted hidden sm:block"
                                            />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="flex min-h-72 flex-col items-center justify-center px-5 py-12 text-center">
                            <div className="bg-blue-500/10 mb-4 rounded-full p-4 text-blue-500">
                                <BellOff size={28} />
                            </div>

                            <h3 className="font-semibold">
                                No notifications found
                            </h3>

                            <p className="text-muted mt-1 max-w-sm text-sm">
                                You're all caught up. New notifications will
                                appear here when there is an update.
                            </p>

                            {(activeTab !== 'all' ||
                                activeFilter !== 'all') && (
                                <button
                                    type="button"
                                    onClick={() => {
                                        setActiveTab('all');
                                        setActiveFilter('all');
                                    }}
                                    className="mt-4 rounded-lg bg-blue-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-600"
                                >
                                    Clear filters
                                </button>
                            )}
                        </div>
                    )}
                </div>

                {/* FOOTER */}
                <div className="border-app text-muted mt-auto flex flex-wrap items-center justify-between gap-2 border-t px-4 py-3 text-xs">
                    <span>
                        Showing {filteredNotifications.length} of{' '}
                        {notifications.length} notifications
                    </span>

                    <button
                        type="button"
                        onClick={clearReadNotifications}
                        className="flex items-center gap-1.5 transition hover:text-blue-500"
                    >
                        <Trash2 size={13} />
                        Clear read
                    </button>
                </div>
            </div>
        </div>
    );
}
