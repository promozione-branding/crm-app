// src/app/leads/Leads.jsx

'use client';

import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import Link from 'next/link';
import { Search, Plus, EllipsisVertical, Upload, Download } from 'lucide-react';
import { useRouter } from 'next/navigation';

import DynamicTable from '@/components/user/ui/DynamicTable';
import ImportLeadsModal from '@/components/user/leads/main/ImportLeadsModal';

import MobileLeadsTable from './components/MobileLeadsTable';
import LeadsActiveFilter from './components/LeadsActiveFilter';
import LeadsFilter, { stageOptions } from './components/LeadsFilter';
import Dashboarddata from '../dashboard/components/Dashboarddata';

// ============================================================
// DESKTOP TABLE COLUMNS
// ============================================================

const columns = [
    {
        key: 'assignedTo.name',
        label: 'Assigned To',
        sortable: true,
    },
    {
        key: 'name',
        label: 'Contact Name',
        sortable: true,
    },
    {
        key: 'phone',
        label: 'Phone',
        sortable: true,
    },
    {
        key: 'stage',
        label: 'Stage',
        sortable: true,
        render: (lead) => <span className="px-3 py-1 rounded-full text-xs bg-blue-500/10 text-blue-500 capitalize">{lead.stage || '—'}</span>,
    },
    {
        key: 'dealValue',
        label: 'Deal Value',
        sortable: true,
    },
    {
        key: 'source',
        label: 'Lead Source',
        sortable: true,
    },
    {
        key: 'createdAt',
        type: 'date',
        label: 'Created At',
        sortable: true,
    },
    {
        key: 'updatedAt',
        type: 'date',
        label: 'Last Modified',
        sortable: true,
    },
];

// ============================================================
// MAIN COMPONENT
// ============================================================

export default function Leads() {
    const router = useRouter();

    // ========================================================
    // STATE
    // ========================================================

    const [leads, setLeads] = useState([]);
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(false);

    const [search, setSearch] = useState('');
    const [rowsPerPage, setRowsPerPage] = useState(25);
    const [selectedStage, setSelectedStage] = useState('');

    const [filterOpen, setFilterOpen] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const [showImportModal, setShowImportModal] = useState(false);

    // ========================================================
    // REFS
    // ========================================================

    const filterRef = useRef(null);
    const menuRef = useRef(null);

    // ========================================================
    // SELECTED STAGE LABEL
    // ========================================================

    const selectedStageLabel = stageOptions.find((option) => option.value === selectedStage)?.label;

    // ========================================================
    // GET LEADS
    // ========================================================

    const getLeads = async () => {
        try {
            setLoading(true);

            const params = new URLSearchParams({
                page: page.toString(),
                limit: rowsPerPage.toString(),
                search: search,
            });

            if (selectedStage) {
                params.append('stage', selectedStage);
            }

            const res = await axios.get(`/api/user/lead/all?${params.toString()}`, {
                withCredentials: true,
            });

            setLeads(res.data?.leads || []);
            setTotal(res.data?.pagination?.total || 0);
        } catch (error) {
            console.error('Get leads error:', error);

            toast.error(error.response?.data?.message || 'Failed to load leads');
        } finally {
            setLoading(false);
        }
    };

    // ========================================================
    // FETCH LEADS
    // ========================================================

    useEffect(() => {
        const timer = setTimeout(() => {
            getLeads();
        }, 500);

        return () => clearTimeout(timer);
    }, [page, rowsPerPage, search, selectedStage]);

    // ========================================================
    // CLOSE DROPDOWNS
    // ========================================================

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (filterRef.current && !filterRef.current.contains(event.target)) {
                setFilterOpen(false);
            }

            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setMenuOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // ========================================================
    // CLEAR FILTER
    // ========================================================

    const clearFilter = () => {
        setSelectedStage('');
        setPage(1);
        setFilterOpen(false);
    };

    // ========================================================
    // IMPORT
    // ========================================================

    const handleImport = () => {
        setMenuOpen(false);
        setShowImportModal(true);
    };

    // ========================================================
    // EXPORT
    // ========================================================

    const handleExport = () => {
        setMenuOpen(false);

        // Add your existing export logic here.
        console.log('Export leads');
    };

    // ========================================================
    // RENDER
    // ========================================================

    return (
        <div
            className="
                min-h-[calc(100vh-64px)]
                bg-surface
                text-app
                p-3
                sm:p-4
                md:p-6
            "
        >
            {/* ==================================================
                HEADER
            =================================================== */}

            <div className="mb-5">
                {/* ==================================================
                    ROW 1 — STATS
                =================================================== */}

                <div
                    className="
                        w-full
                        rounded-xl
                        sm:rounded-2xl
                        border
                        border-app
                        bg-app
                        shadow-sm
                        px-2
                        py-2
                        sm:px-4
                        sm:py-3
                    "
                >
                    <Dashboarddata />
                </div>

                {/* ==================================================
                    ROW 2 — SEARCH + ACTIONS
                =================================================== */}

                <div className="mt-3 sm:mt-4 w-full">
                    <div className="flex items-center gap-2 sm:gap-3 w-full">
                        {/* ==========================================
                            SEARCH
                        =========================================== */}

                        <div className="relative flex-1 min-w-0">
                            <Search
                                size={17}
                                className="
                                    absolute
                                    left-3
                                    top-1/2
                                    -translate-y-1/2
                                    opacity-50
                                "
                            />

                            <input
                                type="text"
                                value={search}
                                onChange={(e) => {
                                    setSearch(e.target.value);
                                    setPage(1);
                                }}
                                placeholder="Search all leads..."
                                className="
                                    h-10
                                    w-full
                                    rounded-xl
                                    border
                                    border-app
                                    bg-app
                                    pl-10
                                    pr-3
                                    text-sm
                                    outline-none
                                    transition-all
                                    focus:ring-2
                                    focus:ring-blue-500/30
                                "
                            />
                        </div>

                        {/* ==========================================
                            ADD LEAD — DESKTOP
                        =========================================== */}

                        <Link
                            href="/leads/new"
                            className="
                                hidden
                                sm:flex
                                shrink-0
                                h-10
                                px-4
                                rounded-xl
                                btn-primary
                                items-center
                                justify-center
                                gap-2
                                text-sm
                                font-medium
                                shadow-sm
                                transition-all
                                hover:-translate-y-0.5
                                hover:shadow-md
                            "
                        >
                            <Plus size={17} />
                            Add Lead
                        </Link>

                        {/* ==========================================
                            ADD LEAD — MOBILE
                        =========================================== */}

                        <Link
                            href="/leads/new"
                            className="
                                sm:hidden
                                shrink-0
                                h-10
                                w-10
                                rounded-xl
                                btn-primary
                                flex
                                items-center
                                justify-center
                                shadow-sm
                            "
                            aria-label="Add Lead"
                        >
                            <Plus size={18} />
                        </Link>

                        {/* ==========================================
                            FILTER
                        =========================================== */}

                        <div ref={filterRef} className="relative shrink-0">
                            <LeadsFilter
                                selectedStage={selectedStage}
                                setSelectedStage={setSelectedStage}
                                filterOpen={filterOpen}
                                setFilterOpen={setFilterOpen}
                                setPage={setPage}
                            />
                        </div>

                        {/* ==========================================
                            MORE MENU
                        =========================================== */}

                        <div className="relative shrink-0" ref={menuRef}>
                            <button
                                type="button"
                                onClick={() => setMenuOpen((prev) => !prev)}
                                className="
                                    h-10
                                    w-10
                                    rounded-xl
                                    border
                                    border-app
                                    bg-app
                                    flex
                                    items-center
                                    justify-center
                                    shadow-sm
                                    transition-all
                                    hover:shadow-md
                                "
                                aria-label="More options"
                            >
                                <EllipsisVertical size={18} />
                            </button>

                            {menuOpen && (
                                <div
                                    className="
                                        absolute
                                        right-0
                                        top-12
                                        z-50
                                        w-44
                                        rounded-xl
                                        border
                                        border-app
                                        bg-app
                                        shadow-lg
                                        overflow-hidden
                                    "
                                >
                                    {/* EXPORT */}
                                    <button
                                        type="button"
                                        onClick={handleExport}
                                        className="
                                            w-full
                                            flex
                                            items-center
                                            gap-3
                                            px-4
                                            py-3
                                            text-sm
                                            text-left
                                            transition-colors
                                            hover:bg-surface
                                        "
                                    >
                                        <Download size={17} className="opacity-70" />

                                        <span>Export Leads</span>
                                    </button>

                                    {/* IMPORT */}
                                    <button
                                        type="button"
                                        onClick={handleImport}
                                        className="
                                            w-full
                                            flex
                                            items-center
                                            gap-3
                                            px-4
                                            py-3
                                            text-sm
                                            text-left
                                            transition-colors
                                            hover:bg-surface
                                        "
                                    >
                                        <Upload size={17} className="opacity-70" />

                                        <span>Import Leads</span>
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* ==================================================
                ACTIVE FILTER
            =================================================== */}

            <LeadsActiveFilter selectedStage={selectedStage} selectedStageLabel={selectedStageLabel} onClear={clearFilter} />

            {/* ==================================================
                DESKTOP TABLE
            =================================================== */}

            <div className="hidden md:block">
                <DynamicTable
                    loading={loading}
                    columns={columns}
                    data={leads}
                    page={page}
                    setPage={setPage}
                    total={total}  
                    rowsPerPage={rowsPerPage}
                    setRowsPerPage={setRowsPerPage}
                    onAction={(lead) => {
                        router.push(`/leads/edit/${lead._id}`);
                    }}
                />
            </div>

            {/* ==================================================
                MOBILE TABLE
            =================================================== */}

            <div className="md:hidden">
                <MobileLeadsTable
                    loading={loading}
                    leads={leads}
                    router={router}
                    page={page}
                    setPage={setPage}
                    total={total}
                    rowsPerPage={rowsPerPage}
                    setRowsPerPage={setRowsPerPage}
                />
            </div>

            {/* ==================================================
                IMPORT MODAL
            =================================================== */}

            <ImportLeadsModal
                open={showImportModal}
                setOpen={setShowImportModal}
                onSuccess={() => {
                    getLeads();
                }}
            />
        </div>
    );
}
