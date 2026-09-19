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
import LeadsFilter, { stageOptions, dateOptions } from './components/LeadsFilter';
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
        render: (lead) => <span className="rounded-full bg-blue-500/10 px-3 py-1 text-xs text-blue-500 capitalize">{lead.stage || '—'}</span>,
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

    // 👇 ARRAY — multi-select
    const [selectedStage, setSelectedStage] = useState([]);

    const [selectedDate, setSelectedDate] = useState('');
    const [customStartDate, setCustomStartDate] = useState('');
    const [customEndDate, setCustomEndDate] = useState('');

    const [filterOpen, setFilterOpen] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const [showImportModal, setShowImportModal] = useState(false);

    // ========================================================
    // REFS
    // ========================================================

    const filterRef = useRef(null);
    const menuRef = useRef(null);

    // ========================================================
    // SELECTED LABELS
    // ========================================================

    const selectedStageLabels = (Array.isArray(selectedStage) ? selectedStage : [])
        .map((val) => stageOptions.find((option) => option.value === val)?.label)
        .filter(Boolean);

    const selectedDateLabel = dateOptions.find((option) => option.value === selectedDate)?.label;

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

            // 👇 append each stage separately
            if (Array.isArray(selectedStage) && selectedStage.length > 0) {
                selectedStage.forEach((stage) => params.append('stage', stage));
            }

            if (selectedDate) {
                params.append('date', selectedDate);
            }

            if (selectedDate === 'custom' && customStartDate && customEndDate) {
                params.append('startDate', customStartDate);
                params.append('endDate', customEndDate);
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
    }, [page, rowsPerPage, search, selectedStage, selectedDate, customStartDate, customEndDate]);

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
        setSelectedStage([]);
        setSelectedDate('');
        setCustomStartDate('');
        setCustomEndDate('');
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

        console.log('Export leads');
    };

    // ========================================================
    // RENDER
    // ========================================================

    return (
        <div className="bg-surface text-app min-h-[calc(100vh-64px)] p-3 sm:p-4 md:p-6">
            {/* HEADER */}
            <div className="mb-5">
                <div className="border-app bg-app w-full rounded-xl border px-2 py-2 shadow-sm sm:rounded-2xl sm:px-4 sm:py-3">
                    <Dashboarddata />
                </div>

                <div className="mt-3 w-full sm:mt-4">
                    <div className="flex w-full items-center gap-2 sm:gap-3">
                        {/* SEARCH */}
                        <div className="relative min-w-0 flex-1">
                            <Search size={17} className="absolute top-1/2 left-3 -translate-y-1/2 opacity-50" />

                            <input
                                type="text"
                                value={search}
                                onChange={(e) => {
                                    setSearch(e.target.value);
                                    setPage(1);
                                }}
                                placeholder="Search all leads..."
                                className="border-app bg-app h-10 w-full rounded-xl border pr-3 pl-10 text-sm transition-all outline-none focus:ring-2 focus:ring-blue-500/30"
                            />
                        </div>

                        {/* ADD LEAD — DESKTOP */}
                        <Link
                            href="/leads/new"
                            className="btn-primary hidden h-10 shrink-0 items-center justify-center gap-2 rounded-xl px-4 text-sm font-medium shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md sm:flex"
                        >
                            <Plus size={17} />
                            Add Lead
                        </Link>

                        {/* ADD LEAD — MOBILE */}
                        <Link
                            href="/leads/new"
                            className="btn-primary flex h-10 w-10 shrink-0 items-center justify-center rounded-xl shadow-sm sm:hidden"
                            aria-label="Add Lead"
                        >
                            <Plus size={18} />
                        </Link>

                        {/* FILTER */}
                        <div ref={filterRef} className="relative shrink-0">
                            <LeadsFilter
                                selectedStage={selectedStage}
                                setSelectedStage={setSelectedStage}
                                selectedDate={selectedDate}
                                setSelectedDate={setSelectedDate}
                                customStartDate={customStartDate}
                                setCustomStartDate={setCustomStartDate}
                                customEndDate={customEndDate}
                                setCustomEndDate={setCustomEndDate}
                                filterOpen={filterOpen}
                                setFilterOpen={setFilterOpen}
                                setPage={setPage}
                            />
                        </div>

                        {/* MORE MENU */}
                        <div className="relative shrink-0" ref={menuRef}>
                            <button
                                type="button"
                                onClick={() => setMenuOpen((prev) => !prev)}
                                className="border-app bg-app flex h-10 w-10 items-center justify-center rounded-xl border shadow-sm transition-all hover:shadow-md"
                                aria-label="More options"
                            >
                                <EllipsisVertical size={18} />
                            </button>

                            {menuOpen && (
                                <div className="border-app bg-app absolute top-12 right-0 z-50 w-44 overflow-hidden rounded-xl border shadow-lg">
                                    <button
                                        type="button"
                                        onClick={handleExport}
                                        className="hover:bg-surface flex w-full items-center gap-3 px-4 py-3 text-left text-sm transition-colors"
                                    >
                                        <Download size={17} className="opacity-70" />
                                        <span>Export Leads</span>
                                    </button>

                                    <button
                                        type="button"
                                        onClick={handleImport}
                                        className="hover:bg-surface flex w-full items-center gap-3 px-4 py-3 text-left text-sm transition-colors"
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

            {/* ACTIVE FILTER */}
            <LeadsActiveFilter
                selectedStage={selectedStage}
                selectedStageLabels={selectedStageLabels}
                selectedDate={selectedDate}
                selectedDateLabel={selectedDateLabel}
                customStartDate={customStartDate}
                customEndDate={customEndDate}
                onClear={clearFilter}
            />

            {/* DESKTOP TABLE */}
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

            {/* MOBILE TABLE */}
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

            {/* IMPORT MODAL */}
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