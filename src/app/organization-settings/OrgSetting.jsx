// src/app/organization-settings/OrgSetting.jsx

import BasicInfo from '@/components/user/org/BasicInfo';
import BusinessInfo from '@/components/user/org/BusinessInfo';
import axios from 'axios';
import { ArrowLeft, Building2 } from 'lucide-react';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

export default function OrgSetting() {
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({
        name: '',
        email: '',
        phone: '',
        website: '',
        gst: '',
        address: '',
        state: '',
        country: 'India',
    });

    const handleChange = (e) => {
        setForm((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const getCompany = async () => {
        try {
            const res = await axios.get('/api/user/company', { withCredentials: true });
            const company = res.data.data;
            setForm({
                name: company.name || '',
                email: company.email || '',
                phone: company.phone || '',
                website: company.website || '',
                gst: company.gst || '',
                address: company.address || '',
                state: company.state || '',
                country: company.country || 'India',
            });
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        getCompany();
    }, []);

    const handleSave = async () => {
        const toastId = toast.loading('Saving...');
        try {
            setLoading(true);
            const res = await axios.put('/api/user/company/update', form, { withCredentials: true });
            toast.success(res.data.message, { id: toastId });
        } catch (error) {
            toast.error(error.response?.data?.message || 'Update failed', { id: toastId });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-surface min-h-screen">
            <div className="bg-surface border-app sticky top-16 z-40 flex h-16 items-center justify-between border-b px-1 md:px-8">
                <div className="flex items-center gap-1 md:gap-2">
                    <Link href="/settings" className="bg-app border-app hover-app text-app rounded-xl border p-2">
                        <ArrowLeft size={20} />
                    </Link>

                    {/* <div className={`p-2 rounded-xl flex items-center justify-center bg-blue-500 text-white`}>
            <Building2 size={18} />
          </div> */}

                    <h1 className="text-app text-sm font-bold">Organization</h1>
                </div>

                <div className="flex items-center gap-1 text-sm md:gap-2">
                    <Link href="/settings" className="bg-app border-app hover-app text-app flex h-8 items-center rounded-lg border px-3">
                        Cancel
                    </Link>

                    <button disabled={loading} onClick={handleSave} className="btn-primary h-8 rounded-lg px-3">
                        {loading ? 'Saving' : 'Save'}
                    </button>
                </div>
            </div>

            <div className="mx-auto max-w-4xl space-y-4 px-2 py-5 md:py-10">
                <BasicInfo form={form} handleChange={handleChange} />

                <BusinessInfo form={form} handleChange={handleChange} />
            </div>
        </div>
    );
}
