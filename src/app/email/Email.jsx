
'use client';

import { useState } from 'react';
import {
    Mail,
    Search,
    Plus,
    Star,
    Send,
    FileText,
    Archive,
    Trash2,
    Inbox,
    RefreshCw,
    MoreHorizontal,
    Paperclip,
    ChevronLeft,
} from 'lucide-react';

const emails = [
    {
        id: 1,
        name: 'Rahul Sharma',
        email: 'rahul@example.com',
        subject: 'Project discussion and updates',
        message:
            'Hi, I wanted to discuss the latest project updates and the remaining tasks. Please let me know when you are available.',
        time: '10:42 AM',
        unread: true,
        starred: true,
    },
    {
        id: 2,
        name: 'Priya Verma',
        email: 'priya@example.com',
        subject: 'Meeting scheduled for tomorrow',
        message:
            'Hello, our meeting is scheduled for tomorrow at 11 AM. Please confirm your availability.',
        time: '9:30 AM',
        unread: true,
        starred: false,
    },
    {
        id: 3,
        name: 'Amit Kumar',
        email: 'amit@example.com',
        subject: 'Monthly report',
        message:
            'Please find the monthly report details below. Let me know if any changes are required.',
        time: 'Yesterday',
        unread: false,
        starred: false,
    },
    {
        id: 4,
        name: 'Support Team',
        email: 'support@example.com',
        subject: 'Your account has been updated',
        message:
            'Your account information has been updated successfully. Contact us if you need any assistance.',
        time: 'Yesterday',
        unread: false,
        starred: true,
    },
];

const folders = [
    { label: 'Inbox', icon: Inbox, count: 2 },
    { label: 'Starred', icon: Star },
    { label: 'Sent', icon: Send },
    { label: 'Drafts', icon: FileText },
    { label: 'Archived', icon: Archive },
    { label: 'Trash', icon: Trash2 },
];

export default function Email() {
    const [activeFolder, setActiveFolder] = useState('Inbox');
    const [selectedEmail, setSelectedEmail] = useState(null);
    const [search, setSearch] = useState('');
    const [showCompose, setShowCompose] = useState(false);
    const [emailsList, setEmailsList] = useState(emails);

    const filteredEmails = emailsList.filter((email) => {
        const matchesSearch = [
            email.name,
            email.email,
            email.subject,
            email.message,
        ]
            .join(' ')
            .toLowerCase()
            .includes(search.toLowerCase());

        if (!matchesSearch) return false;

        if (activeFolder === 'Starred') return email.starred;
        if (activeFolder === 'Inbox') return true;
        if (activeFolder === 'Sent') return false;
        if (activeFolder === 'Drafts') return false;
        if (activeFolder === 'Archived' || activeFolder === 'Trash') {
            return false;
        }

        return true;
    });

    const toggleStar = (id) => {
        setEmailsList((current) =>
            current.map((email) =>
                email.id === id
                    ? { ...email, starred: !email.starred }
                    : email
            )
        );
    };

    const openEmail = (email) => {
        setSelectedEmail(email);

        setEmailsList((current) =>
            current.map((item) =>
                item.id === email.id
                    ? { ...item, unread: false }
                    : item
            )
        );
    };

    const sendEmail = (event) => {
        event.preventDefault();
        alert('Email UI demo: connect your email API to send messages.');
        setShowCompose(false);
    };

    return (
        <div className="bg-surface text-app min-h-[calc(100vh-64px)] w-full max-w-full min-w-0 overflow-x-clip p-3 sm:p-4 md:p-6">
            {/* HEADER */}
            <div className="mb-5 flex min-w-0 flex-wrap items-center justify-between gap-3">
                <div className="min-w-0">
                    <h1 className="text-2xl font-bold sm:text-3xl">
                        Email
                    </h1>
                    <p className="text-muted mt-1 text-sm">
                        Manage your emails and conversations.
                    </p>
                </div>

                <button
                    type="button"
                    onClick={() => setShowCompose(true)}
                    className="flex shrink-0 items-center gap-2 rounded-lg bg-blue-500 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-blue-600"
                >
                    <Plus size={18} />
                    Compose
                </button>
            </div>

            {/* EMAIL CONTAINER */}
            <div className="bg-app border-app flex min-h-[calc(100vh-190px)] min-w-0 flex-col overflow-hidden rounded-xl border shadow-sm lg:flex-row">
                {/* SIDEBAR */}
                <aside className="border-app w-full shrink-0 border-b p-3 sm:p-4 lg:w-56 lg:border-r lg:border-b-0">
                    <div className="mb-3 flex items-center justify-between">
                        <h2 className="text-sm font-semibold">Mailbox</h2>

                        <button
                            type="button"
                            aria-label="Refresh emails"
                            onClick={() => setSearch('')}
                            className="text-muted rounded-lg p-2 transition hover:bg-blue-500/10 hover:text-blue-500"
                        >
                            <RefreshCw size={16} />
                        </button>
                    </div>

                    <nav className="flex gap-2 overflow-x-auto pb-1 lg:flex-col lg:overflow-visible">
                        {folders.map(({ label, icon: Icon, count }) => (
                            <button
                                key={label}
                                type="button"
                                onClick={() => {
                                    setActiveFolder(label);
                                    setSelectedEmail(null);
                                }}
                                className={`flex shrink-0 items-center justify-between gap-3 rounded-lg px-3 py-2.5 text-sm transition lg:w-full ${
                                    activeFolder === label
                                        ? 'bg-blue-500/10 font-semibold text-blue-500'
                                        : 'text-muted hover:bg-blue-500/5 hover:text-app'
                                }`}
                            >
                                <span className="flex items-center gap-2.5">
                                    <Icon size={17} />
                                    {label}
                                </span>

                                {count > 0 && (
                                    <span className="rounded-full bg-blue-500/10 px-2 py-0.5 text-xs">
                                        {count}
                                    </span>
                                )}
                            </button>
                        ))}
                    </nav>
                </aside>

                {/* MAIN EMAIL AREA */}
                <div className="flex min-h-0 min-w-0 flex-1 flex-col">
                    {/* TOOLBAR */}
                    <div className="border-app flex flex-wrap items-center gap-3 border-b p-3 sm:p-4">
                        {selectedEmail ? (
                            <button
                                type="button"
                                onClick={() => setSelectedEmail(null)}
                                className="text-muted rounded-lg p-2 transition hover:bg-blue-500/10 hover:text-blue-500"
                                aria-label="Back to inbox"
                            >
                                <ChevronLeft size={19} />
                            </button>
                        ) : null}

                        <div className="relative min-w-0 flex-1">
                            <Search
                                size={17}
                                className="text-muted absolute top-1/2 left-3 -translate-y-1/2"
                            />
                            <input
                                type="search"
                                value={search}
                                onChange={(event) =>
                                    setSearch(event.target.value)
                                }
                                placeholder="Search emails..."
                                className="bg-surface border-app text-app placeholder:text-muted w-full rounded-lg border py-2.5 pr-3 pl-9 text-sm outline-none transition focus:border-blue-500"
                            />
                        </div>

                        <button
                            type="button"
                            onClick={() => setSearch('')}
                            className="text-muted rounded-lg p-2 transition hover:bg-blue-500/10 hover:text-blue-500"
                            aria-label="Clear search"
                        >
                            <RefreshCw size={17} />
                        </button>
                    </div>

                    {selectedEmail ? (
                        /* EMAIL DETAIL */
                        <div className="min-w-0 flex-1 p-4 sm:p-6">
                            <div className="mb-5 flex items-start justify-between gap-3">
                                <h2 className="min-w-0 text-lg font-semibold break-words sm:text-xl">
                                    {selectedEmail.subject}
                                </h2>

                                <button
                                    type="button"
                                    onClick={() =>
                                        toggleStar(selectedEmail.id)
                                    }
                                    className="text-muted shrink-0 rounded-lg p-2 hover:bg-blue-500/10"
                                    aria-label="Toggle star"
                                >
                                    <Star
                                        size={18}
                                        fill={
                                            emailsList.find(
                                                (item) =>
                                                    item.id === selectedEmail.id
                                            )?.starred
                                                ? 'currentColor'
                                                : 'none'
                                        }
                                    />
                                </button>
                            </div>

                            <div className="border-app flex flex-wrap items-center gap-3 border-b pb-4">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-500/10 font-semibold text-blue-500">
                                    {selectedEmail.name.charAt(0)}
                                </div>

                                <div className="min-w-0 flex-1">
                                    <p className="text-sm font-semibold">
                                        {selectedEmail.name}
                                    </p>
                                    <p className="text-muted text-xs break-all">
                                        {selectedEmail.email}
                                    </p>
                                </div>

                                <span className="text-muted text-xs">
                                    {selectedEmail.time}
                                </span>
                            </div>

                            <p className="text-app mt-6 text-sm leading-7 whitespace-pre-wrap">
                                {selectedEmail.message}
                            </p>

                            <div className="mt-8 flex flex-wrap gap-2">
                                <button
                                    type="button"
                                    onClick={() => setShowCompose(true)}
                                    className="flex items-center gap-2 rounded-lg bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-600"
                                >
                                    <Send size={16} />
                                    Reply
                                </button>

                                <button
                                    type="button"
                                    onClick={() => setSelectedEmail(null)}
                                    className="border-app text-app rounded-lg border px-4 py-2 text-sm hover:bg-blue-500/5"
                                >
                                    Back to inbox
                                </button>
                            </div>
                        </div>
                    ) : (
                        /* EMAIL LIST */
                        <div className="min-w-0 flex-1">
                            <div className="border-app flex items-center justify-between gap-3 border-b px-4 py-3">
                                <h2 className="text-sm font-semibold">
                                    {activeFolder}
                                </h2>

                                <span className="text-muted text-xs">
                                    {filteredEmails.length} messages
                                </span>
                            </div>

                            {filteredEmails.length > 0 ? (
                                <div>
                                    {filteredEmails.map((email) => (
                                        <div
                                            key={email.id}
                                            className={`border-app flex min-w-0 items-start gap-3 border-b px-3 py-4 transition hover:bg-blue-500/[0.04] sm:px-4 ${
                                                email.unread
                                                    ? 'bg-blue-500/[0.035]'
                                                    : ''
                                            }`}
                                        >
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    toggleStar(email.id)
                                                }
                                                className="text-muted mt-1 shrink-0 rounded p-1 hover:text-amber-500"
                                                aria-label="Toggle star"
                                            >
                                                <Star
                                                    size={17}
                                                    fill={
                                                        email.starred
                                                            ? 'currentColor'
                                                            : 'none'
                                                    }
                                                    className={
                                                        email.starred
                                                            ? 'text-amber-500'
                                                            : ''
                                                    }
                                                />
                                            </button>

                                            <button
                                                type="button"
                                                onClick={() => openEmail(email)}
                                                className="flex min-w-0 flex-1 flex-col gap-1 text-left"
                                            >
                                                <div className="flex min-w-0 items-start justify-between gap-2">
                                                    <span
                                                        className={`truncate text-sm ${
                                                            email.unread
                                                                ? 'font-bold'
                                                                : 'font-medium'
                                                        }`}
                                                    >
                                                        {email.name}
                                                    </span>

                                                    <span className="text-muted shrink-0 text-xs">
                                                        {email.time}
                                                    </span>
                                                </div>

                                                <p
                                                    className={`truncate text-sm ${
                                                        email.unread
                                                            ? 'font-semibold'
                                                            : ''
                                                    }`}
                                                >
                                                    {email.subject}
                                                </p>

                                                <p className="text-muted line-clamp-2 text-xs leading-5">
                                                    {email.message}
                                                </p>
                                            </button>

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setEmailsList((current) =>
                                                        current.filter(
                                                            (item) =>
                                                                item.id !==
                                                                email.id
                                                        )
                                                    )
                                                }
                                                className="text-muted hidden shrink-0 rounded-lg p-2 transition hover:bg-red-500/10 hover:text-red-500 sm:block"
                                                aria-label="Remove email from demo list"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="flex min-h-64 flex-col items-center justify-center px-5 py-12 text-center">
                                    <div className="bg-blue-500/10 mb-3 rounded-full p-4 text-blue-500">
                                        <Mail size={26} />
                                    </div>

                                    <h3 className="font-semibold">
                                        No emails found
                                    </h3>

                                    <p className="text-muted mt-1 text-sm">
                                        Try another search or select a different folder.
                                    </p>
                                </div>
                            )}
                        </div>
                    )}

                    {/* FOOTER */}
                    <div className="border-app text-muted mt-auto border-t px-4 py-3 text-center text-xs">
                        Showing demo emails
                    </div>
                </div>
            </div>

            {/* COMPOSE MODAL */}
            {showCompose && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-3 sm:p-5">
                    <div className="bg-app border-app w-full max-w-xl overflow-hidden rounded-xl border shadow-xl">
                        <div className="border-app flex items-center justify-between border-b px-4 py-3">
                            <h2 className="font-semibold">New Message</h2>

                            <button
                                type="button"
                                onClick={() => setShowCompose(false)}
                                className="text-muted rounded-lg px-3 py-1.5 text-sm hover:bg-blue-500/10"
                            >
                                Close
                            </button>
                        </div>

                        <form onSubmit={sendEmail} className="space-y-4 p-4">
                            <input
                                type="email"
                                required
                                placeholder="To"
                                className="bg-surface border-app text-app placeholder:text-muted w-full rounded-lg border px-3 py-2.5 text-sm outline-none focus:border-blue-500"
                            />

                            <input
                                type="text"
                                required
                                placeholder="Subject"
                                className="bg-surface border-app text-app placeholder:text-muted w-full rounded-lg border px-3 py-2.5 text-sm outline-none focus:border-blue-500"
                            />

                            <textarea
                                required
                                rows={7}
                                placeholder="Write your message..."
                                className="bg-surface border-app text-app placeholder:text-muted w-full resize-y rounded-lg border px-3 py-3 text-sm outline-none focus:border-blue-500"
                            />

                            <div className="flex flex-wrap items-center justify-between gap-3">
                                <button
                                    type="button"
                                    aria-label="Attachment placeholder"
                                    className="text-muted rounded-lg p-2 hover:bg-blue-500/10 hover:text-blue-500"
                                >
                                    <Paperclip size={19} />
                                </button>

                                <button
                                    type="submit"
                                    className="flex items-center gap-2 rounded-lg bg-blue-500 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-blue-600"
                                >
                                    <Send size={16} />
                                    Send message
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
