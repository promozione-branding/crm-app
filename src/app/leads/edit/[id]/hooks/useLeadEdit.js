// src/app/leads/edit/[id]/hooks/useLeadEdit.js
'use client';

import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import axios from 'axios';
import toast from 'react-hot-toast';

const EMPTY_FORM = {
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
};

export default function useLeadEdit() {
    const { id } = useParams();

    const [active, setActive] = useState('Insight');
    const [loading, setLoading] = useState(false);
    const [leadLoading, setLeadLoading] = useState(true);
    const [usersLoading, setUsersLoading] = useState(true);
    const [lead, setLead] = useState(null);
    const [users, setUsers] = useState([]);
    const [form, setForm] = useState(EMPTY_FORM);

    const handleChange = useCallback(({ target: { name, value } }) => {
        setForm((prev) => ({ ...prev, [name]: value }));
    }, []);

    const getUsers = useCallback(async () => {
        try {
            setUsersLoading(true);
            const res = await axios.get('/api/user?limit=100', { withCredentials: true });
            setUsers(res.data?.data || []);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to load users.');
        } finally {
            setUsersLoading(false);
        }
    }, []);

    const getLead = useCallback(async () => {
        if (!id) return;
        try {
            setLeadLoading(true);
            const res = await axios.get(`/api/user/lead/${id}`, { withCredentials: true });
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
            setActive('Insight');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to load lead');
        } finally {
            setLeadLoading(false);
        }
    }, [id]);

    useEffect(() => {
        if (!id) return;
        getLead();
        getUsers();
    }, [id, getLead, getUsers]);

    const handleEdit = useCallback(async () => {
        const toastId = toast.loading('Updating lead...');
        try {
            setLoading(true);
            const res = await axios.put(`/api/user/lead/${id}`, form, { withCredentials: true });
            toast.success(res.data.message, { id: toastId });
            await getLead();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to update lead', { id: toastId });
        } finally {
            setLoading(false);
        }
    }, [id, form, getLead]);

    return {
        id,
        active,
        setActive,
        loading,
        leadLoading,
        usersLoading,
        lead,
        users,
        form,
        handleChange,
        handleEdit,
        getLead,
    };
}
