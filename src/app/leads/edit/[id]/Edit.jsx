import BasicInfo from '@/components/user/leads/form/BasicInfo';
import CampaignInfo from '@/components/user/leads/form/CampaignInfo';
import CompanyInfo from '@/components/user/leads/form/CompanyInfo';
import DealInfo from '@/components/user/leads/form/DealInfo';
import Description from '@/components/user/leads/form/Description';
import { Activity, ArrowLeft, ClipboardCheck, Clock3, FileText, LaptopMinimalCheck, Phone, TrendingUp, User } from 'lucide-react';
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { useParams } from "next/navigation";
import axios from 'axios';
import Notes from '@/components/user/leads/form/Notes';
import Activities from '@/components/user/leads/form/Activities';
import Call from '@/components/user/leads/form/Call';
import Stage from '@/components/user/leads/form/Stage';
import Task from '@/components/user/leads/form/Task';
import toast from 'react-hot-toast';
import Meetings from '@/components/user/leads/form/Meetings';

export default function Edit() {
  const { id } = useParams();
  const [active, setActive] = useState("overview");
  const [loading, setLoading] = useState(false);
  const [lead, setLead] = useState(null);
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

  const getLead = async () => {
    const res = await axios.get(`/api/user/lead/${id}`, { withCredentials: true, });
    const data = res.data.data;
    setLead(data);
    setForm({
      name: data.name || "",
      email: data.email || "",
      phone: data.phone || "",
      place: data.place || "",
      source: data.source || "",

      companyName: data.companyName || "",
      gstNumber: data.gstNumber || "",

      assignedTo: data.assignedTo?._id || "",
      stage: data.stage || "new",
      priceRange: data.priceRange || "",
      dealValue: data.dealValue || "",
      expectedClosureDate: data.expectedClosureDate
        ? data.expectedClosureDate.slice(0, 10)
        : "",

      campaignId: data.campaignId || "",
      campaignName: data.campaignName || "",

      product: data.product || "",
      message: data.message || "",
    });
  };

  useEffect(() => {
    if (id) {
      getLead();
    }
  }, [id]);

  const tabs = [
    { id: "overview", label: "Overview", icon: User, },
    { id: "meeting", label: "Meetings", icon: LaptopMinimalCheck, badge: lead?.meetingCount || "0" },
    { id: "notes", label: "Notes", icon: FileText, badge: lead?.notes?.length || "0" },
    { id: "activities", label: "Activities", icon: Activity, badge: lead?.activities?.length || "0", },
    { id: "calls", label: "Call History", icon: Phone, badge: lead?.call?.length || "0" },
    { id: "stage", label: "Stage History", icon: TrendingUp, badge: lead?.stageHistory?.length || "0" },
    { id: "task", label: "Tasks", icon: ClipboardCheck, badge: lead?.taskCount || "0" },
  ];

  const handleEdit = async () => {
    const toastId = toast.loading("Updating lead...");

    try {
      setLoading(true)
      const res = await axios.put(`/api/user/lead/${id}`, form, { withCredentials: true, });
      toast.success(res.data.message, { id: toastId, });
      getLead()
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update lead", { id: toastId, });
    } finally {
      setLoading(false)
    }
  }
  // console.log(lead)

  return (
    <div className="bg-surface min-h-screen">
      <div className="h-16 top-16 sticky z-40 bg-surface border-b border-app flex items-center justify-between md:px-8 px-1">
        <div className="flex items-center md:gap-2 gap-1">
          <Link href="/leads" className="p-2 rounded-xl border bg-app border-app hover-app text-app">
            <ArrowLeft size={20} />
          </Link>

          <h1 className="text-sm font-bold text-app flex flex-col">
            {lead?.name || "-"}
            <span className='text-muted text-xs flex items-center gap-1'>
              <User size={12} /> {lead?.assignedTo?.name}
            </span>
          </h1>
        </div>

        <div className="flex md:gap-2 gap-1 text-sm">
          <Link href="/leads" className="px-3 h-8 rounded-lg flex items-center border bg-app border-app hover-app text-app">
            Cancel
          </Link>

          <button disabled={loading} onClick={handleEdit} className="px-3 h-8 rounded-lg btn-primary">
            {loading ? "Editing" : "Edit Lead"}
          </button>
        </div>
      </div>

      <div className='h-10 top-32 sticky z-40 bg-surface border-b border-app flex items-center gap-2 justify-between md:px-8 px-1 overflow-x-auto overflow-y-hidden'>
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = active === tab.id;

          return (
            <button key={tab.id} onClick={() => setActive(tab.id)}
              className={`
                        relative flex items-center justify-center gap-2
                        px-5 h-11 min-w-max
                        text-sm font-medium whitespace-nowrap
                        transition-all duration-200
                        border-b-2
                        ${isActive
                  ? "border-blue-600 text-blue-600 dark:text-blue-400 bg-blue-500/10"
                  : "border-transparent text-app hover-app"
                }
                    `}
            >
              <Icon size={16} />
              <span>{tab.label}</span>

              {tab.badge && (
                <span className={`flex items-center justify-center min-w-5 h-5 rounded-full text-[10px]
                                ${isActive ? "bg-blue-600 text-white" : "bg-app border border-app text-app"}`}>
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {active === "overview" &&
        <div className="max-w-4xl mx-auto md:py-10 py-5 px-2 space-y-4">
          <BasicInfo form={form} handleChange={handleChange} />
          <CompanyInfo form={form} handleChange={handleChange} />
          <DealInfo form={form} handleChange={handleChange} />
          <CampaignInfo form={form} handleChange={handleChange} />
          <Description form={form} handleChange={handleChange} />
        </div>}

      {active == "meeting" &&
        <Meetings
          leadId={id}
        />}

      {active === "notes" &&
        <div className="max-w-4xl mx-auto md:py-10 py-5 px-2 space-y-4">
          <Notes notes={lead?.notes || []} leadId={id} getLead={getLead} />
        </div>}

      {active === "activities" &&
        <div className="max-w-4xl mx-auto md:py-10 py-5 px-2 space-y-4">
          <Activities activities={lead?.activities || []} />
        </div>}

      {active === "calls" &&
        <div className="max-w-4xl mx-auto md:py-10 py-5 px-2 space-y-4">
          <Call />
        </div>}

      {active === "stage" &&
        <div className="max-w-4xl mx-auto md:py-10 py-5 px-2 space-y-4">
          <Stage stage={lead?.stageHistory || []} />
        </div>}

      {active === "task" &&
        <div className="max-w-4xl mx-auto md:py-10 py-5 px-2 space-y-4">
          <Task lead={lead} getLead={getLead} />
        </div>}

    </div>
  )
}