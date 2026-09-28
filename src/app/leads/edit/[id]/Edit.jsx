// src/app/leads/edit/[id]/Edit.jsx
'use client';

import BasicInfo from '@/components/user/leads/form/BasicInfo';
import CampaignInfo from '@/components/user/leads/form/CampaignInfo';
import CompanyInfo from '@/components/user/leads/form/CompanyInfo';
import DealInfo from '@/components/user/leads/form/DealInfo';
import Description from '@/components/user/leads/form/Description';
import Notes from '@/components/user/leads/form/Notes';
import Activities from '@/components/user/leads/form/Activities';
import Call from '@/components/user/leads/form/Call';
import Stage from '@/components/user/leads/form/Stage';
import Task from '@/components/user/leads/form/Task';
import Meetings from '@/components/user/leads/form/Meetings';

import useLeadEdit from './hooks/useLeadEdit';
import EditHeader from './components/EditHeader';
import InsightTab from './components/InsightTab';

const Wrap = ({ children }) => (
    <div className="mx-auto max-w-4xl space-y-4 px-2 py-5 md:py-10">{children}</div>
);

export default function Edit() {
    const {
        id, active, setActive, loading, leadLoading, usersLoading,
        lead, users, form, handleChange, handleEdit, getLead,
    } = useLeadEdit();

    if (leadLoading) {
        return (
            <div className="bg-surface text-app flex min-h-screen items-center justify-center">
                <div className="text-sm opacity-70">Loading lead...</div>
            </div>
        );
    }

    return (
        <div className="bg-surface min-h-screen">
            <EditHeader
                lead={lead}
                loading={loading}
                onEdit={handleEdit}
                active={active}
                setActive={setActive}
            />

            {active === 'Insight' && (
                <InsightTab lead={lead} onSchedule={() => setActive('meeting')} />
            )}

            {active === 'overview' && (
                <Wrap>
                    <BasicInfo form={form} handleChange={handleChange} />
                    <CompanyInfo form={form} handleChange={handleChange} />
                    <DealInfo form={form} handleChange={handleChange} users={users} usersLoading={usersLoading} />
                    <CampaignInfo form={form} handleChange={handleChange} />
                    <Description form={form} handleChange={handleChange} />
                </Wrap>
            )}

            {active === 'meeting' && <Meetings leadId={id} users={users} usersLoading={usersLoading} />}

            {active === 'notes' && (
                <Wrap><Notes notes={lead?.notes || []} leadId={id} getLead={getLead} /></Wrap>
            )}

            {active === 'activities' && (
                <Wrap><Activities activities={lead?.activities || []} /></Wrap>
            )}

            {active === 'calls' && (
                <Wrap><Call leadId={id} /></Wrap>
            )}

            {active === 'stage' && (
                <Wrap><Stage stage={lead?.stageHistory || []} /></Wrap>
            )}

            {active === 'task' && (
                <Wrap>
                    <Task lead={lead} getLead={getLead} users={users} usersLoading={usersLoading} />
                </Wrap>
            )}
        </div>
    );
}