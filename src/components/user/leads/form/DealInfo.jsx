import React, { useEffect, useState } from 'react'
import SelectInput from '../../ui/SelectInput'
import Input from '../../ui/Input'
import toast from 'react-hot-toast';
import axios from 'axios';

export default function DealInfo({ form, handleChange }) {
    const [users, setUsers] = useState([])
    const getUsers = async () => {
        try {
            const res = await axios.get("/api/user?limit=100", { withCredentials: true, });
            setUsers(res.data.data || []);
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to load users.");
        }
    };

    useEffect(() => {
        getUsers();
    }, []);

    return (
        <div className="bg-card border border-app rounded-2xl p-5 mt-6">
            <h3 className="uppercase tracking-widest text-xs font-semibold text-muted">
                Deal Information
            </h3>

            <div className="border-b border-app my-4" />

            <div className="grid md:grid-cols-2 gap-3">
                <SelectInput
                    label="Assigned To"
                    name="assignedTo"
                    value={form.assignedTo}
                    onChange={handleChange}
                    options={[
                        ...users.map((user) => ({ label: `${user.name} (${user.roleId?.name})`, value: user._id, })),
                    ]}
                />

                <SelectInput
                    label="Lead Stage"
                    name="stage"
                    value={form.stage}
                    onChange={handleChange}
                    options={[
                        { label: "New", value: "new" },
                        { label: "Contacted", value: "contacted" },
                        { label: "Qualified", value: "qualified" },
                        { label: "Proposal Sent", value: "proposal_sent" },
                        { label: "Negotiation", value: "negotiation" },
                        { label: "Won", value: "won" },
                        { label: "Lost", value: "lost" },
                    ]}
                />

                <Input
                    label="Price Range (₹)"
                    type="number"
                    name="priceRange"
                    value={form.priceRange}
                    onChange={handleChange}
                    placeholder="Price Range"
                />

                <Input
                    label="Deal Value (₹)"
                    type="number"
                    name="dealValue"
                    value={form.dealValue}
                    onChange={handleChange}
                    placeholder="Enter deal value"
                />

                <Input
                    label="Expected Closure On"
                    type="date"
                    name="expectedClosureDate"
                    value={form.expectedClosureDate}
                    onChange={handleChange}
                />

            </div>
        </div>
    )
}
