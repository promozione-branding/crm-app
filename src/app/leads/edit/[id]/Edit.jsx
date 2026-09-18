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
            <div
                className="
                    bg-surface
                    min-h-screen
                    flex
                    items-center
                    justify-center
                    text-app
                "
            >
                <div
                    className="
                        text-sm
                        opacity-70
                    "
                >
                    Loading lead...
                </div>
            </div>
        );
    }

    // ============================================================
    // UI
    // ============================================================

    return (
        <div
            className="
                bg-surface
                min-h-screen
            "
        >
            {/* =====================================================
                HEADER
            ===================================================== */}

            <div
                className="
                    h-16
                    top-16
                    sticky
                    z-40
                    bg-surface
                    border-b
                    border-app
                    flex
                    items-center
                    justify-between
                    md:px-8
                    px-1
                "
            >
                <div
                    className="
                        flex
                        items-center
                        md:gap-2
                        gap-1
                    "
                >
                    <Link
                        href="/leads"
                        className="
                            p-2
                            rounded-xl
                            border
                            bg-app
                            border-app
                            hover-app
                            text-app
                        "
                    >
                        <ArrowLeft size={20} />
                    </Link>

                    <h1
                        className="
                            text-sm
                            font-bold
                            text-app
                            flex
                            flex-col
                        "
                    >
                        {lead?.name || '-'}

                        <span
                            className="
                                text-muted
                                text-xs
                                flex
                                items-center
                                gap-1
                            "
                        >
                            <User size={12} />

                            {lead?.assignedTo?.name}
                        </span>
                    </h1>
                </div>

                <div
                    className="
                        flex
                        md:gap-2
                        gap-1
                        text-sm
                    "
                >
                    <Link
                        href="/leads"
                        className="
                            px-3
                            h-8
                            rounded-lg
                            flex
                            items-center
                            border
                            bg-app
                            border-app
                            hover-app
                            text-app
                        "
                    >
                        Cancel
                    </Link>

                    <button
                        disabled={loading}
                        onClick={handleEdit}
                        className="
                            px-3
                            h-8
                            rounded-lg
                            btn-primary
                        "
                    >
                        {loading ? 'Editing' : 'Edit Lead'}
                    </button>
                </div>
            </div>

            {/* =====================================================
                TABS
            ===================================================== */}

            <div
                className="
                    h-10
                    top-32
                    sticky
                    z-40
                    bg-surface
                    border-b
                    border-app
                    flex
                    items-center
                    
                    md:px-4
                    px-1
                    overflow-x-auto
                    overflow-y-hidden
                "
            >
                {tabs.map((tab) => {
                    const Icon = tab.icon;

                    const isActive = active === tab.id;

                    return (
                        <button
                            key={tab.id}
                            onClick={() => setActive(tab.id)}
                            className={`
                                relative
                                flex
                                items-center
                                justify-center
                                gap-2
                                px-5
                                h-11
                                min-w-max
                                text-sm
                                font-medium
                                whitespace-nowrap
                                transition-all
                                duration-200
                                border-b-2

                                ${isActive ? 'border-blue-600 text-blue-600 dark:text-blue-400 bg-blue-500/10' : 'border-transparent text-app hover-app'}
                            `}
                        >
                            <Icon size={16} />

                            <span>{tab.label}</span>

                            {tab.badge && (
                                <span
                                    className={`
                                        flex
                                        items-center
                                        justify-center
                                        min-w-5
                                        h-5
                                        rounded-full
                                        text-[10px]

                                        ${isActive ? 'bg-blue-600 text-white' : 'bg-app border border-app text-app'}
                                    `}
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
                <div className="max-w-5xl mx-auto px-3 sm:px-5 md:px-8 py-5 md:py-8">
                    {/* =====================================================
            LEAD PROFILE
        ===================================================== */}

                    <div className="bg-app border border-app rounded-2xl overflow-hidden">
                        <div className="p-4 sm:p-6">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                {/* PROFILE */}
                                <div className="flex items-center gap-3 min-w-0">
                                    {/* Avatar */}
                                    <div
                                        className="
                                w-14 h-14
                                sm:w-16 sm:h-16
                                rounded-full
                                bg-blue-500/10
                                border border-blue-500/20
                                flex items-center justify-center
                                text-blue-600
                                dark:text-blue-400
                                text-lg
                                font-bold
                                shrink-0
                            "
                                    >
                                        {(lead?.name || 'L')
                                            .split(' ')
                                            .map((word) => word[0])
                                            .slice(0, 2)
                                            .join('')
                                            .toUpperCase()}
                                    </div>

                                    <div className="min-w-0">
                                        <h2
                                            className="
                                    text-lg
                                    sm:text-xl
                                    font-bold
                                    text-app
                                    truncate
                                "
                                        >
                                            {lead?.name || '-'}
                                        </h2>

                                        {lead?.companyName && (
                                            <p
                                                className="
                                        text-sm
                                        text-muted
                                        mt-1
                                        flex
                                        items-center
                                        gap-1.5
                                        truncate
                                    "
                                            >
                                                <Building2 size={14} />

                                                {lead.companyName}
                                            </p>
                                        )}

                                        {lead?.assignedTo?.name && (
                                            <p
                                                className="
                                        text-xs
                                        text-muted
                                        mt-1
                                        flex
                                        items-center
                                        gap-1.5
                                    "
                                            >
                                                <User size={12} />
                                                Assigned to {lead.assignedTo.name}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {/* STAGE + STATUS */}
                                <div className="flex items-center gap-2 flex-wrap">
                                    <span
                                        className="
                                px-3
                                py-1.5
                                rounded-full
                                text-xs
                                font-semibold
                                bg-blue-500/10
                                text-blue-600
                                dark:text-blue-400
                                border
                                border-blue-500/20
                                capitalize
                            "
                                    >
                                        {lead?.stage?.replace(/_/g, ' ') || '-'}
                                    </span>

                                    <span
                                        className={`
                                px-3
                                py-1.5
                                rounded-full
                                text-xs
                                font-semibold
                                capitalize
                                border
                                ${
                                    lead?.status === 'open'
                                        ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
                                        : lead?.status === 'closed'
                                          ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20'
                                          : 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20'
                                }
                            `}
                                    >
                                        {lead?.status || '-'}
                                    </span>

                                    {/* PRODUCT — BESIDE LEAD STATUS */}
                                    {lead?.product && (
                                        <span
                                            className="
                                px-3
                                py-1.5
                                rounded-full
                                text-xs
                                font-semibold
                                bg-purple-500/10
                                text-purple-600
                                dark:text-purple-400
                                border
                                border-purple-500/20
                                truncate
                                max-w-[180px]
                            "
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

                            <div
                                className="
        flex
        flex-nowrap
        justify-evenly
        w-full
        gap-2
        mt-6
    "
                            >
                                {/* CALL */}
                                {lead?.phone && (
                                    <a
                                        href={`tel:${lead.phone}`}
                                        className="
                flex
                items-center
                justify-center
                gap-2
                px-4
                py-2.5
                rounded-xl
                border
                border-app
                bg-surface
                hover-app
                text-sm
                font-medium
                text-app
                transition
            "
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
                                        className="
                flex
                items-center
                justify-center
                gap-2
                px-4
                py-2.5
                rounded-xl
                border
                border-app
                bg-surface
                hover-app
                text-sm
                font-medium
                text-app
                transition
            "
                                    >
                                        <FaWhatsapp size={19} className="text-green-500" />

                                        <span className="hidden sm:inline">WhatsApp</span>
                                    </a>
                                )}

                                {/* EMAIL */}
                                {lead?.email && (
                                    <a
                                        href={`mailto:${lead.email}`}
                                        className="
                flex
                items-center
                justify-center
                gap-2
                px-4
                py-2.5
                rounded-xl
                border
                border-app
                bg-surface
                hover-app
                text-sm
                font-medium
                text-app
                transition
            "
                                    >
                                        <Mail size={17} className="text-orange-500" />

                                        <span className="hidden sm:inline">Email</span>
                                    </a>
                                )}

                                {/* SCHEDULE */}
                                <button
                                    type="button"
                                    onClick={() => setActive('meeting')}
                                    className="
            flex
            items-center
            justify-center
            gap-2
            px-4
            py-2.5
            rounded-xl
            border
            border-app
            bg-surface
            hover-app
            text-sm
            font-medium
            text-app
            transition
        "
                                >
                                    <CalendarDays size={17} className="text-purple-500" />

                                    <span className="hidden sm:inline">Schedule</span>
                                </button>
                            </div>
                        </div>

                        {/* =====================================================
                CONTACT INFORMATION
            ===================================================== */}

                        <div className="border-t border-app p-4 sm:p-6">
                            <div className="flex items-center gap-2 mb-4">
                                <div
                                    className="
                            w-8 h-8
                            rounded-lg
                            bg-blue-500/10
                            text-blue-500
                            flex
                            items-center
                            justify-center
                        "
                                >
                                    <User size={16} />
                                </div>

                                <div>
                                    <h3 className="text-sm font-semibold text-app">Contact Information</h3>

                                    <p className="text-xs text-muted">Lead contact details</p>
                                </div>
                            </div>

                            <div className="space-y-1">
                                {/* PHONE */}
                                <div
                                    className="
                            flex
                            items-center
                            gap-3
                            py-3
                            border-b
                            border-app
                        "
                                >
                                    <Phone size={19} className="text-blue-500 shrink-0" />

                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs text-muted">Phone</p>

                                        {lead?.phone ? (
                                            <a
                                                href={`tel:${lead.phone}`}
                                                className="
                                        text-sm
                                        font-medium
                                        text-app
                                        hover:text-blue-500
                                        transition
                                    "
                                            >
                                                {lead.phone}
                                            </a>
                                        ) : (
                                            <p className="text-sm text-app">-</p>
                                        )}
                                    </div>

                                    {lead?.phone && (
                                        <button
                                            type="button"
                                            onClick={() => navigator.clipboard.writeText(lead.phone)}
                                            className="
                                    p-2
                                    rounded-lg
                                    hover-app
                                    text-muted
                                "
                                            title="Copy phone"
                                        >
                                            <Copy size={15} />
                                        </button>
                                    )}
                                </div>

                                {/* EMAIL */}
                                <div
                                    className="
                            flex
                            items-center
                            gap-3
                            py-3
                            border-b
                            border-app
                        "
                                >
                                    <Mail size={19} className="text-orange-500 shrink-0" />

                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs text-muted">Email</p>

                                        {lead?.email ? (
                                            <a
                                                href={`mailto:${lead.email}`}
                                                className="
                                        text-sm
                                        font-medium
                                        text-app
                                        hover:text-blue-500
                                        break-all
                                    "
                                            >
                                                {lead.email}
                                            </a>
                                        ) : (
                                            <p className="text-sm text-app">-</p>
                                        )}
                                    </div>

                                    {lead?.email && (
                                        <button
                                            type="button"
                                            onClick={() => navigator.clipboard.writeText(lead.email)}
                                            className="
                                    p-2
                                    rounded-lg
                                    hover-app
                                    text-muted
                                "
                                            title="Copy email"
                                        >
                                            <Copy size={15} />
                                        </button>
                                    )}
                                </div>

                                {/* COMPANY */}
                                <div
                                    className="
                            flex
                            items-center
                            gap-3
                            py-3
                            border-b
                            border-app
                        "
                                >
                                    <Building2 size={19} className="text-indigo-500 shrink-0" />

                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs text-muted">Company</p>

                                        <p className="text-sm font-medium text-app">{lead?.companyName || '-'}</p>
                                    </div>
                                </div>

                                {/* PLACE */}
                                <div
                                    className="
                            flex
                            items-center
                            gap-3
                            py-3
                            border-b
                            border-app
                        "
                                >
                                    <MapPin size={19} className="text-red-500 shrink-0" />

                                    <div className="flex-1">
                                        <p className="text-xs text-muted">Location</p>

                                        <p className="text-sm font-medium text-app">{lead?.place || '-'}</p>
                                    </div>
                                </div>

                                {/* PRODUCT */}
                                <div
                                    className="
                            flex
                            items-center
                            gap-3
                            py-3
                            border-b
                            border-app
                        "
                                >
                                    <BriefcaseBusiness size={19} className="text-purple-500 shrink-0" />

                                    <div className="flex-1">
                                        <p className="text-xs text-muted">Product</p>

                                        <p className="text-sm font-medium text-app">{lead?.product || '-'}</p>
                                    </div>
                                </div>

                                {/* GST */}
                                <div
                                    className="
                            flex
                            items-center
                            gap-3
                            py-3
                        "
                                >
                                    <FileText size={19} className="text-cyan-500 shrink-0" />

                                    <div className="flex-1">
                                        <p className="text-xs text-muted">GST Number</p>

                                        <p className="text-sm font-medium text-app">{lead?.gstNumber || '-'}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* =====================================================
                DEAL INFORMATION
            ===================================================== */}

                        <div className="border-t border-app p-4 sm:p-6">
                            <div className="flex items-center gap-2 mb-4">
                                <div
                                    className="
                            w-8 h-8
                            rounded-lg
                            bg-emerald-500/10
                            text-emerald-500
                            flex
                            items-center
                            justify-center
                        "
                                >
                                    <IndianRupee size={16} />
                                </div>

                                <div>
                                    <h3 className="text-sm font-semibold text-app">Deal Information</h3>

                                    <p className="text-xs text-muted">Value and closure details</p>
                                </div>
                            </div>

                            <div
                                className="
                        grid
                        grid-cols-1
                        sm:grid-cols-2
                        gap-3
                    "
                            >
                                {/* DEAL VALUE */}
                                <div
                                    className="
                            rounded-xl
                            border
                            border-app
                            bg-surface
                            p-4
                        "
                                >
                                    <div className="flex items-center gap-2 mb-2">
                                        <IndianRupee size={16} className="text-emerald-500" />

                                        <p className="text-xs text-muted">Deal Value</p>
                                    </div>

                                    <p className="text-lg font-bold text-app">{lead?.dealValue ? `₹${Number(lead.dealValue).toLocaleString('en-IN')}` : '-'}</p>
                                </div>

                                {/* EXPECTED CLOSURE */}
                                <div
                                    className="
                            rounded-xl
                            border
                            border-app
                            bg-surface
                            p-4
                        "
                                >
                                    <div className="flex items-center gap-2 mb-2">
                                        <CalendarDays size={16} className="text-purple-500" />

                                        <p className="text-xs text-muted">Expected Closure</p>
                                    </div>

                                    <p className="text-sm font-semibold text-app">
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
                                <div
                                    className="
                            rounded-xl
                            border
                            border-app
                            bg-surface
                            p-4
                        "
                                >
                                    <div className="flex items-center gap-2 mb-2">
                                        <Tag size={16} className="text-blue-500" />

                                        <p className="text-xs text-muted">Lead Source</p>
                                    </div>

                                    <p className="text-sm font-semibold text-app capitalize">{lead?.source || '-'}</p>
                                </div>

                                {/* PRICE RANGE */}
                                <div
                                    className="
                            rounded-xl
                            border
                            border-app
                            bg-surface
                            p-4
                        "
                                >
                                    <div className="flex items-center gap-2 mb-2">
                                        <IndianRupee size={16} className="text-orange-500" />

                                        <p className="text-xs text-muted">Price Range</p>
                                    </div>

                                    <p className="text-sm font-semibold text-app">
                                        {lead?.priceRange ? `₹${Number(lead.priceRange).toLocaleString('en-IN')}` : '-'}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* =====================================================
                TIMELINE
            ===================================================== */}

                        <div className="border-t border-app p-4 sm:p-6">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div
                                    className="
                            rounded-xl
                            border
                            border-app
                            bg-surface
                            p-4
                            flex
                            items-center
                            gap-3
                        "
                                >
                                    <CalendarDays size={18} className="text-blue-500 shrink-0" />

                                    <div>
                                        <p className="text-xs text-muted">Created Date</p>

                                        <p className="text-sm font-medium text-app">
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

                                <div
                                    className="
                            rounded-xl
                            border
                            border-app
                            bg-surface
                            p-4
                            flex
                            items-center
                            gap-3
                        "
                                >
                                    <TrendingUp size={18} className="text-purple-500 shrink-0" />

                                    <div>
                                        <p className="text-xs text-muted">Last Updated</p>

                                        <p className="text-sm font-medium text-app">
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
                            <div className="border-t border-app p-4 sm:p-6">
                                <div className="flex items-center gap-2 mb-3">
                                    <FileText size={18} className="text-blue-500" />

                                    <h3 className="text-sm font-semibold text-app">Lead Message</h3>
                                </div>

                                <div
                                    className="
                            rounded-xl
                            bg-surface
                            border
                            border-app
                            p-4
                        "
                                >
                                    <p
                                        className="
                                text-sm
                                text-app
                                leading-6
                                whitespace-pre-wrap
                            "
                                    >
                                        {lead.message}
                                    </p>
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
                <div
                    className="
                        max-w-4xl
                        mx-auto
                        md:py-10
                        py-5
                        px-2
                        space-y-4
                    "
                >
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
                <div
                    className="
                        max-w-4xl
                        mx-auto
                        md:py-10
                        py-5
                        px-2
                        space-y-4
                    "
                >
                    <Notes notes={lead?.notes || []} leadId={id} getLead={getLead} />
                </div>
            )}

            {/* =====================================================
                ACTIVITIES
            ===================================================== */}

            {active === 'activities' && (
                <div
                    className="
                        max-w-4xl
                        mx-auto
                        md:py-10
                        py-5
                        px-2
                        space-y-4
                    "
                >
                    <Activities activities={lead?.activities || []} />
                </div>
            )}

            {/* =====================================================
                CALLS
            ===================================================== */}

            {active === 'calls' && (
                <div
                    className="
                        max-w-4xl
                        mx-auto
                        md:py-10
                        py-5
                        px-2
                        space-y-4
                    "
                >
                    <Call />
                </div>
            )}

            {/* =====================================================
                STAGE
            ===================================================== */}

            {active === 'stage' && (
                <div
                    className="
                        max-w-4xl
                        mx-auto
                        md:py-10
                        py-5
                        px-2
                        space-y-4
                    "
                >
                    <Stage stage={lead?.stageHistory || []} />
                </div>
            )}

            {/* =====================================================
                TASKS
            ===================================================== */}

            {active === 'task' && (
                <div
                    className="
                        max-w-4xl
                        mx-auto
                        md:py-10
                        py-5
                        px-2
                        space-y-4
                    "
                >
                    <Task lead={lead} getLead={getLead} users={users} usersLoading={usersLoading} />
                </div>
            )}
        </div>
    );
}
