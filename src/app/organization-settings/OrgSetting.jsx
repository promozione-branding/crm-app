import BasicInfo from '@/components/user/org/BasicInfo';
import BusinessInfo from '@/components/user/org/BusinessInfo';
import axios from 'axios';
import { ArrowLeft, Building2 } from 'lucide-react';
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast';

export default function OrgSetting() {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    website: "",
    gst: "",
    address: "",
    state: "",
    country: "India",
  });

  const handleChange = (e) => {

    setForm(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));

  };

  const getCompany = async () => {
    try {
      const res = await axios.get("/api/user/company", { withCredentials: true });
      const company = res.data.data;
      setForm({
        name: company.name || "",
        email: company.email || "",
        phone: company.phone || "",
        website: company.website || "",
        gst: company.gst || "",
        address: company.address || "",
        state: company.state || "",
        country: company.country || "India",
      });

    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getCompany();
  }, []);

  const handleSave = async () => {
    const toastId = toast.loading("Saving...");
    try {
      setLoading(true);
      const res = await axios.put("/api/user/company/update", form, { withCredentials: true });
      toast.success(res.data.message, { id: toastId });
    } catch (error) {
      toast.error(error.response?.data?.message || "Update failed", { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-surface min-h-screen">
      <div className="h-16 top-16 sticky z-40 bg-surface border-b border-app flex items-center justify-between md:px-8 px-1">
        <div className="flex items-center md:gap-2 gap-1">
          <Link href="/settings" className="p-2 rounded-xl border bg-app border-app hover-app text-app">
            <ArrowLeft size={20} />
          </Link>

          {/* <div className={`p-2 rounded-xl flex items-center justify-center bg-blue-500 text-white`}>
            <Building2 size={18} />
          </div> */}

          <h1 className="text-sm font-bold text-app">
            Organization
          </h1>
        </div>

        <div className="flex md:gap-2 items-center gap-1 text-sm">
          <Link href="/settings" className="px-3 h-8 rounded-lg flex items-center border bg-app border-app hover-app text-app">
            Cancel
          </Link>

          <button disabled={loading} onClick={handleSave} className="px-3 h-8 rounded-lg btn-primary">
            {loading ? "Saving" : "Save"}
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto md:py-10 py-5 px-2 space-y-4">
        <BasicInfo
          form={form}
          handleChange={handleChange}
        />

        <BusinessInfo
          form={form}
          handleChange={handleChange}
        />
      </div>
    </div>
  )
}