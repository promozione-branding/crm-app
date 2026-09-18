// src/app/leads/edit/[id]/Edit.jsx

'use client';

import BasicInfo from '@/components/user/leads/form/BasicInfo';
import CampaignInfo from '@/components/user/leads/form/CampaignInfo';
import CompanyInfo from '@/components/user/leads/form/CompanyInfo';
import DealInfo from '@/components/user/leads/form/DealInfo';
import Description from '@/components/user/leads/form/Description';

import {
    Activity,
    ArrowLeft,
    BriefcaseBusiness,
    Building2,
    CalendarDays,
    ClipboardCheck,
    Copy,
    FileText,
    IndianRupee,
    LaptopMinimalCheck,
    Mail,
    MapPin,
    Phone,
    Tag,
    TrendingUp,
    User,
} from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa';

import Link from 'next/link';
import React, { useCallback, useEffect, useState } from 'react';

import { useParams } from 'next/navigation';

import axios from 'axios';
import Notes from '@/components/user/leads/form/Notes';
import Activities from '@/components/user/leads/form/Activities';
import Call from '@/components/user/leads/form/Call';
import Stage from '@/components/user/leads/form/Stage';
import Task from '@/components/user/leads/form/Task';
import Meetings from '@/components/user/leads/form/Meetings';

import toast from 'react-hot-toast';

export default function Edit() {
    const { id } = useParams();

    // ============================================================
    // STATE
    // ============================================================

    const [active, setActive] = useState('Insight');

    const [loading, setLoading] = useState(false);

    const [leadLoading, setLeadLoading] = useState(true);

    const [usersLoading, setUsersLoading] = useState(true);

    const [lead, setLead] = useState(null);

    const [users, setUsers] = useState([]);

    const [form, setForm] = useState({
        // Basic
        name: '',
        email: '',
        phone: '',
        place: '',
        source: '',

        // Company
        companyName: '',
        gstNumber: '',

        // Deal
        assignedTo: '',
        stage: 'new',
        priceRange: '',
        dealValue: '',
        expectedClosureDate: '',

        // Campaign
        campaignId: '',
        campaignName: '',

        // Description
        product: '',
        message: '',
    });

    // ============================================================
    // HANDLE CHANGE
    // ============================================================

    const handleChange = ({ target: { name, value } }) => {
        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // ============================================================
    // GET USERS
    // ============================================================
    //
    // IMPORTANT:
    // This API is now called ONLY ONCE by the parent.
    //
    // DealInfo, Meetings and Task receive users as props.
    // ============================================================

    const getUsers = useCallback(async () => {
        try {
            setUsersLoading(true);

            const res = await axios.get('/api/user?limit=100', {
                withCredentials: true,
            });

            setUsers(res.data?.data || []);
        } catch (error) {
            console.error('Get users error:', error);

            toast.error(error.response?.data?.message || 'Failed to load users.');
        } finally {
            setUsersLoading(false);
        }
    }, []);

    // ============================================================
    // GET LEAD
    // ============================================================

    const getLead = useCallback(async () => {
        if (!id) return;

        try {
            setLeadLoading(true);

            const res = await axios.get(`/api/user/lead/${id}`, {
                withCredentials: true,
            });

            const data = res.data?.data;

            setLead(data);

            setForm({
                name: data.name || '',
                email: data.email || '',
                phone: data.phone || '',
                place: data.place || '',
                source: data.source || '',

                companyName: data.companyName || '',
                gstNumber: data.gstNumber || '',

                assignedTo: data.assignedTo?._id || '',
                stage: data.stage || 'new',
                priceRange: data.priceRange || '',
                dealValue: data.dealValue || '',
                expectedClosureDate: data.expectedClosureDate ? data.expectedClosureDate.slice(0, 10) : '',

                campaignId: data.campaignId || '',
                campaignName: data.campaignName || '',

                product: data.product || '',
                message: data.message || '',
            });

            // ====================================================
            // ALWAYS OPEN OVERVIEW TAB
            // ====================================================

            setActive('Insight');
        } catch (error) {
            console.error('Get lead error:', error);

            toast.error(error.response?.data?.message || 'Failed to load lead');
        } finally {
            setLeadLoading(false);
        }
    }, [id]);

    // ============================================================
    // INITIAL DATA LOAD
    // ============================================================
    //
    // Lead + Users are independent API calls.
    // They can run at the same time.
    //
    // This means:
    //
    // GET /api/user/lead/:id
    // GET /api/user?limit=100
    //
    // instead of users being fetched by 3 child components.
    // ============================================================

    useEffect(() => {
        if (!id) return;

        getLead();

        getUsers();
    }, [id, getLead, getUsers]);

    // ============================================================
    // TABS
    // ============================================================

    const tabs = [
        {
            id: 'Insight',
            label: 'Insight',
            icon: User,
        },
        {
            id: 'overview',
            label: 'Overview',
            icon: User,
        },

        {
            id: 'meeting',
            label: 'Meetings',
            icon: LaptopMinimalCheck,
            badge: lead?.meetingCount || '0',
        },

        {
            id: 'notes',
            label: 'Notes',
            icon: FileText,
            badge: lead?.notes?.length || '0',
        },

        {
            id: 'activities',
            label: 'Activities',
            icon: Activity,
            badge: lead?.activities?.length || '0',
        },

        {
            id: 'calls',
            label: 'Call History',
            icon: Phone,
            badge: lead?.call?.length || '0',
        },

        {
            id: 'stage',
            label: 'Stage History',
            icon: TrendingUp,
            badge: lead?.stageHistory?.length || '0',
        },

        {
            id: 'task',
            label: 'Tasks',
            icon: ClipboardCheck,
            badge: lead?.taskCount || '0',
        },
    ];

    // ============================================================
    // UPDATE LEAD
    // ============================================================

    const handleEdit = async () => {
        const toastId = toast.loading('Updating lead...');

        try {
            setLoading(true);

            const res = await axios.put(`/api/user/lead/${id}`, form, {
                withCredentials: true,
            });

            toast.success(res.data.message, {
                id: toastId,
            });

            await getLead();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to update lead', {
                id: toastId,
            });
        } finally {
            setLoading(false);
        }
    };

    // ============================================================
    // INITIAL LOADING
    // ============================================================

    if (leadLoading) {
        return (
            <div className="bg-surface text-app flex min-h-screen items-center justify-center">
                <div className="text-sm opacity-70">Loading lead...</div>
            </div>
        );
    }

    // ============================================================
    // UI
    // ============================================================

    return (
        <div className="bg-surface min-h-screen">
            {/* =====================================================
                HEADER
            ===================================================== */}

            <div className="bg-surface border-app sticky top-16 z-40 flex h-16 items-center justify-between border-b px-1 md:px-8">
                <div className="flex items-center gap-1 md:gap-2">
                    <Link href="/leads" className="bg-app border-app hover-app text-app rounded-xl border p-2">
                        <ArrowLeft size={20} />
                    </Link>

                    <h1 className="text-app flex flex-col text-sm font-bold">
                        {lead?.name || '-'}

                        <span className="text-muted flex items-center gap-1 text-xs">
                            <User size={12} />

                            {lead?.assignedTo?.name}
                        </span>
                    </h1>
                </div>

                <div className="flex gap-1 text-sm md:gap-2">
                    <Link href="/leads" className="bg-app border-app hover-app text-app flex h-8 items-center rounded-lg border px-3">
                        Cancel
                    </Link>

                    <button disabled={loading} onClick={handleEdit} className="btn-primary h-8 rounded-lg px-3">
                        {loading ? 'Editing' : 'Edit Lead'}
                    </button>
                </div>
            </div>

            {/* =====================================================
                TABS
            ===================================================== */}

            <div className="bg-surface border-app sticky top-32 z-40 flex h-10 items-center overflow-x-auto overflow-y-hidden border-b px-1 md:px-4">
                {tabs.map((tab) => {
                    const Icon = tab.icon;

                    const isActive = active === tab.id;

                    return (
                        <button
                            key={tab.id}
                            onClick={() => setActive(tab.id)}
                            className={`relative flex h-11 min-w-max items-center justify-center gap-2 border-b-2 px-5 text-sm font-medium whitespace-nowrap transition-all duration-200 ${isActive ? 'border-blue-600 bg-blue-500/10 text-blue-600 dark:text-blue-400' : 'text-app hover-app border-transparent'} `}
                        >
                            <Icon size={16} />

                            <span>{tab.label}</span>

                            {tab.badge && (
                                <span
                                    className={`flex h-5 min-w-5 items-center justify-center rounded-full text-[10px] ${isActive ? 'bg-blue-600 text-white' : 'bg-app border-app text-app border'} `}
                                >
                                    {tab.badge}
                                </span>
                            )}
                        </button>
                    );
                })}
            </div>

            {/* =====================================================
                Insight
            ===================================================== */}

            {active === 'Insight' && (
                <div className="mx-auto max-w-5xl px-3 py-5 sm:px-5 md:px-8 md:py-8">
                    {/* =====================================================
            LEAD PROFILE
        ===================================================== */}

                    <div className="bg-app border-app overflow-hidden rounded-2xl border">
                        <div className="p-4 sm:p-6">
                            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                                {/* PROFILE */}
                                <div className="flex min-w-0 items-center gap-3">
                                    {/* Avatar */}
                                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-blue-500/20 bg-blue-500/10 text-lg font-bold text-blue-600 sm:h-16 sm:w-16 dark:text-blue-400">
                                        {(lead?.name || 'L')
                                            .split(' ')
                                            .map((word) => word[0])
                                            .slice(0, 2)
                                            .join('')
                                            .toUpperCase()}
                                    </div>

                                    <div className="min-w-0">
                                        <h2 className="text-app truncate text-lg font-bold sm:text-xl">{lead?.name || '-'}</h2>

                                        {lead?.companyName && (
                                            <p className="text-muted mt-1 flex items-center gap-1.5 truncate text-sm">
                                                <Building2 size={14} />

                                                {lead.companyName}
                                            </p>
                                        )}

                                        {lead?.assignedTo?.name && (
                                            <p className="text-muted mt-1 flex items-center gap-1.5 text-xs">
                                                <User size={12} />
                                                Assigned to {lead.assignedTo.name}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {/* STAGE + STATUS */}
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
                                        } `}
                                    >
                                        {lead?.status || '-'}
                                    </span>

                                    {/* PRODUCT — BESIDE LEAD STATUS */}
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

                            {/* =================================================
                    ACTION BUTTONS
                ================================================= */}

                            <div className="mt-6 flex w-full flex-nowrap justify-evenly gap-2">
                                {/* CALL */}
                                {lead?.phone && (
                                    <a
                                        href={`tel:${lead.phone}`}
                                        className="border-app bg-surface hover-app text-app flex items-center justify-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-medium transition"
                                    >
                                        <Phone size={17} className="text-blue-500" />

                                        <span className="hidden sm:inline">Call</span>
                                    </a>
                                )}

                                {/* WHATSAPP */}
                                {lead?.phone && (
                                    <a
                                        href={`https://wa.me/${
                                            lead.phone.replace(/\D/g, '').length === 10 ? `91${lead.phone.replace(/\D/g, '')}` : lead.phone.replace(/\D/g, '')
                                        }`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="border-app bg-surface hover-app text-app flex items-center justify-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-medium transition"
                                    >
                                        <FaWhatsapp size={19} className="text-green-500" />

                                        <span className="hidden sm:inline">WhatsApp</span>
                                    </a>
                                )}

                                {/* EMAIL */}
                                {lead?.email && (
                                    <a
                                        href={`mailto:${lead.email}`}
                                        className="border-app bg-surface hover-app text-app flex items-center justify-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-medium transition"
                                    >
                                        <Mail size={17} className="text-orange-500" />

                                        <span className="hidden sm:inline">Email</span>
                                    </a>
                                )}

                                {/* SCHEDULE */}
                                <button
                                    type="button"
                                    onClick={() => setActive('meeting')}
                                    className="border-app bg-surface hover-app text-app flex items-center justify-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-medium transition"
                                >
                                    <CalendarDays size={17} className="text-purple-500" />

                                    <span className="hidden sm:inline">Schedule</span>
                                </button>
                            </div>
                        </div>

                        {/* =====================================================
                CONTACT INFORMATION
            ===================================================== */}

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
                                {/* PHONE */}
                                <div className="border-app flex items-center gap-3 border-b py-3">
                                    <Phone size={19} className="shrink-0 text-blue-500" />

                                    <div className="min-w-0 flex-1">
                                        <p className="text-muted text-xs">Phone</p>

                                        {lead?.phone ? (
                                            <a href={`tel:${lead.phone}`} className="text-app text-sm font-medium transition hover:text-blue-500">
                                                {lead.phone}
                                            </a>
                                        ) : (
                                            <p className="text-app text-sm">-</p>
                                        )}
                                    </div>

                                    {lead?.phone && (
                                        <button
                                            type="button"
                                            onClick={() => navigator.clipboard.writeText(lead.phone)}
                                            className="hover-app text-muted rounded-lg p-2"
                                            title="Copy phone"
                                        >
                                            <Copy size={15} />
                                        </button>
                                    )}
                                </div>

                                {/* EMAIL */}
                                <div className="border-app flex items-center gap-3 border-b py-3">
                                    <Mail size={19} className="shrink-0 text-orange-500" />

                                    <div className="min-w-0 flex-1">
                                        <p className="text-muted text-xs">Email</p>

                                        {lead?.email ? (
                                            <a href={`mailto:${lead.email}`} className="text-app text-sm font-medium break-all hover:text-blue-500">
                                                {lead.email}
                                            </a>
                                        ) : (
                                            <p className="text-app text-sm">-</p>
                                        )}
                                    </div>

                                    {lead?.email && (
                                        <button
                                            type="button"
                                            onClick={() => navigator.clipboard.writeText(lead.email)}
                                            className="hover-app text-muted rounded-lg p-2"
                                            title="Copy email"
                                        >
                                            <Copy size={15} />
                                        </button>
                                    )}
                                </div>

                                {/* COMPANY */}
                                <div className="border-app flex items-center gap-3 border-b py-3">
                                    <Building2 size={19} className="shrink-0 text-indigo-500" />

                                    <div className="min-w-0 flex-1">
                                        <p className="text-muted text-xs">Company</p>

                                        <p className="text-app text-sm font-medium">{lead?.companyName || '-'}</p>
                                    </div>
                                </div>

                                {/* PLACE */}
                                <div className="border-app flex items-center gap-3 border-b py-3">
                                    <MapPin size={19} className="shrink-0 text-red-500" />

                                    <div className="flex-1">
                                        <p className="text-muted text-xs">Location</p>

                                        <p className="text-app text-sm font-medium">{lead?.place || '-'}</p>
                                    </div>
                                </div>

                                {/* PRODUCT */}
                                <div className="border-app flex items-center gap-3 border-b py-3">
                                    <BriefcaseBusiness size={19} className="shrink-0 text-purple-500" />

                                    <div className="flex-1">
                                        <p className="text-muted text-xs">Product</p>

                                        <p className="text-app text-sm font-medium">{lead?.product || '-'}</p>
                                    </div>
                                </div>

                                {/* GST */}
                                <div className="flex items-center gap-3 py-3">
                                    <FileText size={19} className="shrink-0 text-cyan-500" />

                                    <div className="flex-1">
                                        <p className="text-muted text-xs">GST Number</p>

                                        <p className="text-app text-sm font-medium">{lead?.gstNumber || '-'}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* =====================================================
                DEAL INFORMATION
            ===================================================== */}

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
                                {/* DEAL VALUE */}
                                <div className="border-app bg-surface rounded-xl border p-4">
                                    <div className="mb-2 flex items-center gap-2">
                                        <IndianRupee size={16} className="text-emerald-500" />

                                        <p className="text-muted text-xs">Deal Value</p>
                                    </div>

                                    <p className="text-app text-lg font-bold">{lead?.dealValue ? `₹${Number(lead.dealValue).toLocaleString('en-IN')}` : '-'}</p>
                                </div>

                                {/* EXPECTED CLOSURE */}
                                <div className="border-app bg-surface rounded-xl border p-4">
                                    <div className="mb-2 flex items-center gap-2">
                                        <CalendarDays size={16} className="text-purple-500" />

                                        <p className="text-muted text-xs">Expected Closure</p>
                                    </div>

                                    <p className="text-app text-sm font-semibold">
                                        {lead?.expectedClosureDate
                                            ? new Date(lead.expectedClosureDate).toLocaleDateString('en-IN', {
                                                  day: '2-digit',
                                                  month: 'short',
                                                  year: 'numeric',
                                              })
                                            : '-'}
                                    </p>
                                </div>

                                {/* SOURCE */}
                                <div className="border-app bg-surface rounded-xl border p-4">
                                    <div className="mb-2 flex items-center gap-2">
                                        <Tag size={16} className="text-blue-500" />

                                        <p className="text-muted text-xs">Lead Source</p>
                                    </div>

                                    <p className="text-app text-sm font-semibold capitalize">{lead?.source || '-'}</p>
                                </div>

                                {/* PRICE RANGE */}
                                <div className="border-app bg-surface rounded-xl border p-4">
                                    <div className="mb-2 flex items-center gap-2">
                                        <IndianRupee size={16} className="text-orange-500" />

                                        <p className="text-muted text-xs">Price Range</p>
                                    </div>

                                    <p className="text-app text-sm font-semibold">
                                        {lead?.priceRange ? `₹${Number(lead.priceRange).toLocaleString('en-IN')}` : '-'}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* =====================================================
                TIMELINE
            ===================================================== */}

                        <div className="border-app border-t p-4 sm:p-6">
                            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                <div className="border-app bg-surface flex items-center gap-3 rounded-xl border p-4">
                                    <CalendarDays size={18} className="shrink-0 text-blue-500" />

                                    <div>
                                        <p className="text-muted text-xs">Created Date</p>

                                        <p className="text-app text-sm font-medium">
                                            {lead?.createdAt
                                                ? new Date(lead.createdAt).toLocaleDateString('en-IN', {
                                                      day: '2-digit',
                                                      month: 'short',
                                                      year: 'numeric',
                                                  })
                                                : '-'}
                                        </p>
                                    </div>
                                </div>

                                <div className="border-app bg-surface flex items-center gap-3 rounded-xl border p-4">
                                    <TrendingUp size={18} className="shrink-0 text-purple-500" />

                                    <div>
                                        <p className="text-muted text-xs">Last Updated</p>

                                        <p className="text-app text-sm font-medium">
                                            {lead?.updatedAt
                                                ? new Date(lead.updatedAt).toLocaleDateString('en-IN', {
                                                      day: '2-digit',
                                                      month: 'short',
                                                      year: 'numeric',
                                                  })
                                                : '-'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* =====================================================
                MESSAGE
            ===================================================== */}

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
            )}

            {/* =====================================================
                OVERVIEW
            ===================================================== */}

            {active === 'overview' && (
                <div className="mx-auto max-w-4xl space-y-4 px-2 py-5 md:py-10">
                    <BasicInfo form={form} handleChange={handleChange} />

                    <CompanyInfo form={form} handleChange={handleChange} />

                    <DealInfo form={form} handleChange={handleChange} users={users} usersLoading={usersLoading} />

                    <CampaignInfo form={form} handleChange={handleChange} />

                    <Description form={form} handleChange={handleChange} />
                </div>
            )}

            {/* =====================================================
                MEETINGS
            ===================================================== */}

            {active === 'meeting' && <Meetings leadId={id} users={users} usersLoading={usersLoading} />}

            {/* =====================================================
                NOTES
            ===================================================== */}

            {active === 'notes' && (
                <div className="mx-auto max-w-4xl space-y-4 px-2 py-5 md:py-10">
                    <Notes notes={lead?.notes || []} leadId={id} getLead={getLead} />
                </div>
            )}

            {/* =====================================================
                ACTIVITIES
            ===================================================== */}

            {active === 'activities' && (
                <div className="mx-auto max-w-4xl space-y-4 px-2 py-5 md:py-10">
                    <Activities activities={lead?.activities || []} />
                </div>
            )}

            {/* =====================================================
                CALLS
            ===================================================== */}

            {active === 'calls' && (
                <div className="mx-auto max-w-4xl space-y-4 px-2 py-5 md:py-10">
                    <Call />
                </div>
            )}

            {/* =====================================================
                STAGE
            ===================================================== */}

            {active === 'stage' && (
                <div className="mx-auto max-w-4xl space-y-4 px-2 py-5 md:py-10">
                    <Stage stage={lead?.stageHistory || []} />
                </div>
            )}

            {/* =====================================================
                TASKS
            ===================================================== */}

            {active === 'task' && (
                <div className="mx-auto max-w-4xl space-y-4 px-2 py-5 md:py-10">
                    <Task lead={lead} getLead={getLead} users={users} usersLoading={usersLoading} />
                </div>
            )}
        </div>
    );
}
