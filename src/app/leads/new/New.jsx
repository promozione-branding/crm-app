"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import BasicInfo from "@/components/user/leads/form/BasicInfo";
import CompanyInfo from "@/components/user/leads/form/CompanyInfo";
import DealInfo from "@/components/user/leads/form/DealInfo";
import CampaignInfo from "@/components/user/leads/form/CampaignInfo";
import Description from "@/components/user/leads/form/Description";

export default function NewLead() {
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({
        // Basic
        name: "",
        email: "",
        phone: "",
        place: "",
        source: "",

        // Company
        companyName: "",
        gstNumber: "",

        // Deal
        assignedTo: "",
        stage: "new",
        priceRange: "",
        dealValue: "",
        expectedClosureDate: "",

        // Campaign
        campaignId: "",
        campaignName: "",

        // Description
        product: "",
        message: "",
    });

    const handleChange = ({ target: { name, value } }) => {
        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSave = async () => {
        const toastId = toast.loading("Saving...");

        try {
            setLoading(true);
            const { data } = await axios.post("/api/user/lead/create", form, { withCredentials: true, });
            toast.success(data.message, { id: toastId, });

            setForm({
                name: "",
                email: "",
                phone: "",
                place: "",
                source: "",

                companyName: "",
                gstNumber: "",

                assignedTo: "",
                stage: "new",
                priceRange: "",
                dealValue: "",
                expectedClosureDate: "",

                campaignId: "",
                campaignName: "",

                product: "",
                message: "",
            });
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to save lead.", { id: toastId, });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-surface min-h-screen">
            <div className="h-16 top-16 sticky z-40 bg-surface border-b border-app flex items-center justify-between md:px-8 px-1">
                <div className="flex items-center md:gap-2 gap-1">
                    <Link href="/leads" className="p-2 rounded-xl border bg-app border-app hover-app text-app">
                        <ArrowLeft size={20} />
                    </Link>

                    <h1 className="text-sm font-bold text-app">
                        Create New Lead
                    </h1>
                </div>

                <div className="flex md:gap-2 gap-1 text-sm">
                    <Link href="/leads" className="px-3 h-8 rounded-lg flex items-center border bg-app border-app hover-app text-app">
                        Cancel
                    </Link>

                    <button disabled={loading} onClick={handleSave} className="px-3 h-8 rounded-lg btn-primary">
                        {loading ? "Creating" : "Create Lead"}
                    </button>
                </div>
            </div>

            <div className="max-w-4xl mx-auto md:py-10 py-5 px-2 space-y-4">
                <BasicInfo form={form} handleChange={handleChange} />
                <CompanyInfo form={form} handleChange={handleChange} />
                <DealInfo form={form} handleChange={handleChange} />
                <CampaignInfo form={form} handleChange={handleChange} />
                <Description form={form} handleChange={handleChange} />
            </div>
        </div>
    );
}