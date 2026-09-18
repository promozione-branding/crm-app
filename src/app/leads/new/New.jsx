// src/app/leads/new/New.jsx

'use client';

import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import BasicInfo from '@/components/user/leads/form/BasicInfo';
import CompanyInfo from '@/components/user/leads/form/CompanyInfo';
import DealInfo from '@/components/user/leads/form/DealInfo';
import CampaignInfo from '@/components/user/leads/form/CampaignInfo';
import Description from '@/components/user/leads/form/Description';

export default function NewLead() {
    const [loading, setLoading] = useState(false);
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

    const handleChange = ({ target: { name, value } }) => {
        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSave = async () => {
        const toastId = toast.loading('Saving...');

        try {
            setLoading(true);
            const { data } = await axios.post('/api/user/lead/create', form, { withCredentials: true });
            toast.success(data.message, { id: toastId });

            setForm({
                name: '',
                email: '',
                phone: '',
                place: '',
                source: '',

                companyName: '',
                gstNumber: '',

                assignedTo: '',
                stage: 'new',
                priceRange: '',
                dealValue: '',
                expectedClosureDate: '',

                campaignId: '',
                campaignName: '',

                product: '',
                message: '',
            });
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to save lead.', { id: toastId });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-surface min-h-screen">
            <div className="bg-surface border-app sticky top-16 z-40 flex h-16 items-center justify-between border-b px-1 md:px-8">
                <div className="flex items-center gap-1 md:gap-2">
                    <Link href="/leads" className="bg-app border-app hover-app text-app rounded-xl border p-2">
                        <ArrowLeft size={20} />
                    </Link>

                    <h1 className="text-app text-sm font-bold">Create New Lead</h1>
                </div>

                <div className="flex gap-1 text-sm md:gap-2">
                    <Link href="/leads" className="bg-app border-app hover-app text-app flex h-8 items-center rounded-lg border px-3">
                        Cancel
                    </Link>

                    <button disabled={loading} onClick={handleSave} className="btn-primary h-8 rounded-lg px-3">
                        {loading ? 'Creating' : 'Create Lead'}
                    </button>
                </div>
            </div>

            <div className="mx-auto max-w-4xl space-y-4 px-2 py-5 md:py-10">
                <BasicInfo form={form} handleChange={handleChange} />
                <CompanyInfo form={form} handleChange={handleChange} />
                <DealInfo form={form} handleChange={handleChange} />
                <CampaignInfo form={form} handleChange={handleChange} />
                <Description form={form} handleChange={handleChange} />
            </div>
        </div>
    );
}
