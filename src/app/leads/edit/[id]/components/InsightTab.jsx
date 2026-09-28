// src/app/leads/edit/[id]/components/InsightTab.jsx

'use client';

import { BriefcaseBusiness, Building2, CalendarDays, Copy, FileText, IndianRupee, Mail, MapPin, Phone, Tag, TrendingUp, User } from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa';

// ---------- small local helpers (kept in same file on purpose) ----------

const fmtDate = (d) => (d ? new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '-');

const fmtCurrency = (v) => (v ? `₹${Number(v).toLocaleString('en-IN')}` : '-');

const Btn = ({ children, ...props }) => (
    <a
        {...props}
        className="border-app bg-surface hover-app text-app flex items-center justify-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-medium transition"
    >
        {children}
    </a>
);

const Row = ({ icon: Icon, iconClass, label, value, href, copyable }) => (
    <div className="border-app flex items-center gap-3 border-b py-3 last:border-b-0">
        <Icon size={19} className={`shrink-0 ${iconClass}`} />
        <div className="min-w-0 flex-1">
            <p className="text-muted text-xs">{label}</p>
            {href && value ? (
                <a href={href} className="text-app text-sm font-medium break-all hover:text-blue-500">
                    {value}
                </a>
            ) : (
                <p className="text-app text-sm font-medium">{value || '-'}</p>
            )}
        </div>
        {copyable && value && (
            <button
                type="button"
                onClick={() => navigator.clipboard.writeText(value)}
                className="hover-app text-muted rounded-lg p-2"
                title={`Copy ${label.toLowerCase()}`}
            >
                <Copy size={15} />
            </button>
        )}
    </div>
);

const Card = ({ icon: Icon, iconClass, label, children }) => (
    <div className="border-app bg-surface rounded-xl border p-4">
        <div className="mb-2 flex items-center gap-2">
            <Icon size={16} className={iconClass} />
            <p className="text-muted text-xs">{label}</p>
        </div>
        {children}
    </div>
);

// ---------- main component ----------

export default function InsightTab({ lead, onSchedule }) {
    const initials = (lead?.name || 'L')
        .split(' ')
        .map((w) => w[0])
        .slice(0, 2)
        .join('')
        .toUpperCase();

    const waNumber = lead?.phone ? (lead.phone.replace(/\D/g, '').length === 10 ? `91${lead.phone.replace(/\D/g, '')}` : lead.phone.replace(/\D/g, '')) : '';

    return (
        <div className="mx-auto max-w-5xl px-3 py-5 sm:px-5 md:px-8 md:py-8">
            <div className="bg-app border-app overflow-hidden rounded-2xl border">
                {/* PROFILE + ACTIONS */}
                <div className="p-4 sm:p-6">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex min-w-0 items-center gap-3">
                            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-blue-500/20 bg-blue-500/10 text-lg font-bold text-blue-600 sm:h-16 sm:w-16 dark:text-blue-400">
                                {initials}
                            </div>
                            <div className="min-w-0">
                                <h2 className="text-app truncate text-lg font-bold sm:text-xl">{lead?.name || '-'}</h2>
                                {lead?.companyName && (
                                    <p className="text-muted mt-1 flex items-center gap-1.5 truncate text-sm">
                                        <Building2 size={14} /> {lead.companyName}
                                    </p>
                                )}
                                {lead?.assignedTo?.name && (
                                    <p className="text-muted mt-1 flex items-center gap-1.5 text-xs">
                                        <User size={12} /> Assigned to {lead.assignedTo.name}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-2">
                            <span className="rounded-full border border-blue-500/20 bg-blue-500/10 px-3 py-1.5 text-xs font-semibold text-blue-600 capitalize dark:text-blue-400">
                                {lead?.stage?.replace(/_/g, ' ') || '-'}
                            </span>
                            <span
                                className={`rounded-full border px-3 py-1.5 text-xs font-semibold capitalize ${
                                    lead?.status === 'open'
                                        ? 'border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                                        : lead?.status === 'closed'
                                          ? 'border-blue-500/20 bg-blue-500/10 text-blue-600 dark:text-blue-400'
                                          : 'border-red-500/20 bg-red-500/10 text-red-600 dark:text-red-400'
                                }`}
                            >
                                {lead?.status || '-'}
                            </span>
                            {lead?.product && (
                                <span
                                    className="max-w-[180px] truncate rounded-full border border-purple-500/20 bg-purple-500/10 px-3 py-1.5 text-xs font-semibold text-purple-600 dark:text-purple-400"
                                    title={lead.product}
                                >
                                    {lead.product}
                                </span>
                            )}
                        </div>
                    </div>

                    {/* QUICK ACTIONS */}
                    <div className="mt-6 flex w-full flex-nowrap justify-evenly gap-2">
                        {lead?.phone && (
                            <Btn href={`tel:${lead.phone}`}>
                                <Phone size={17} className="text-blue-500" />
                                <span className="hidden sm:inline">Call</span>
                            </Btn>
                        )}
                        {lead?.phone && (
                            <Btn href={`https://wa.me/${waNumber}`} target="_blank" rel="noopener noreferrer">
                                <FaWhatsapp size={19} className="text-green-500" />
                                <span className="hidden sm:inline">WhatsApp</span>
                            </Btn>
                        )}
                        {lead?.email && (
                            <Btn href={`mailto:${lead.email}`}>
                                <Mail size={17} className="text-orange-500" />
                                <span className="hidden sm:inline">Email</span>
                            </Btn>
                        )}
                        <button
                            type="button"
                            onClick={onSchedule}
                            className="border-app bg-surface hover-app text-app flex items-center justify-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-medium transition"
                        >
                            <CalendarDays size={17} className="text-purple-500" />
                            <span className="hidden sm:inline">Schedule</span>
                        </button>
                    </div>
                </div>

                {/* CONTACT */}
                <div className="border-app border-t p-4 sm:p-6">
                    <div className="mb-4 flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/10 text-blue-500">
                            <User size={16} />
                        </div>
                        <div>
                            <h3 className="text-app text-sm font-semibold">Contact Information</h3>
                            <p className="text-muted text-xs">Lead contact details</p>
                        </div>
                    </div>

                    <div className="space-y-1">
                        <Row
                            icon={Phone}
                            iconClass="text-blue-500"
                            label="Phone"
                            value={lead?.phone}
                            href={lead?.phone ? `tel:${lead.phone}` : undefined}
                            copyable
                        />
                        <Row
                            icon={Mail}
                            iconClass="text-orange-500"
                            label="Email"
                            value={lead?.email}
                            href={lead?.email ? `mailto:${lead.email}` : undefined}
                            copyable
                        />
                        <Row icon={Building2} iconClass="text-indigo-500" label="Company" value={lead?.companyName} />
                        <Row icon={MapPin} iconClass="text-red-500" label="Location" value={lead?.place} />
                        <Row icon={BriefcaseBusiness} iconClass="text-purple-500" label="Product" value={lead?.product} />
                        <Row icon={FileText} iconClass="text-cyan-500" label="GST Number" value={lead?.gstNumber} />
                    </div>
                </div>

                {/* DEAL */}
                <div className="border-app border-t p-4 sm:p-6">
                    <div className="mb-4 flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-500">
                            <IndianRupee size={16} />
                        </div>
                        <div>
                            <h3 className="text-app text-sm font-semibold">Deal Information</h3>
                            <p className="text-muted text-xs">Value and closure details</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                        <Card icon={IndianRupee} iconClass="text-emerald-500" label="Deal Value">
                            <p className="text-app text-lg font-bold">{fmtCurrency(lead?.dealValue)}</p>
                        </Card>
                        <Card icon={CalendarDays} iconClass="text-purple-500" label="Expected Closure">
                            <p className="text-app text-sm font-semibold">{fmtDate(lead?.expectedClosureDate)}</p>
                        </Card>
                        <Card icon={Tag} iconClass="text-blue-500" label="Lead Source">
                            <p className="text-app text-sm font-semibold capitalize">{lead?.source || '-'}</p>
                        </Card>
                        <Card icon={IndianRupee} iconClass="text-orange-500" label="Price Range">
                            <p className="text-app text-sm font-semibold">{fmtCurrency(lead?.priceRange)}</p>
                        </Card>
                    </div>
                </div>

                {/* TIMELINE */}
                <div className="border-app border-t p-4 sm:p-6">
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                        <div className="border-app bg-surface flex items-center gap-3 rounded-xl border p-4">
                            <CalendarDays size={18} className="shrink-0 text-blue-500" />
                            <div>
                                <p className="text-muted text-xs">Created Date</p>
                                <p className="text-app text-sm font-medium">{fmtDate(lead?.createdAt)}</p>
                            </div>
                        </div>
                        <div className="border-app bg-surface flex items-center gap-3 rounded-xl border p-4">
                            <TrendingUp size={18} className="shrink-0 text-purple-500" />
                            <div>
                                <p className="text-muted text-xs">Last Updated</p>
                                <p className="text-app text-sm font-medium">{fmtDate(lead?.updatedAt)}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* MESSAGE */}
                {lead?.message && (
                    <div className="border-app border-t p-4 sm:p-6">
                        <div className="mb-3 flex items-center gap-2">
                            <FileText size={18} className="text-blue-500" />
                            <h3 className="text-app text-sm font-semibold">Lead Message</h3>
                        </div>
                        <div className="bg-surface border-app rounded-xl border p-4">
                            <p className="text-app text-sm leading-6 whitespace-pre-wrap">{lead.message}</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
