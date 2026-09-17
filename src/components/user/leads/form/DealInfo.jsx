// src/components/user/leads/form/DealInfo.jsx

import React, { useEffect, useState } from "react";
import SelectInput from "../../ui/SelectInput";
import Input from "../../ui/Input";
import toast from "react-hot-toast";
import axios from "axios";

export default function DealInfo({ form, handleChange }) {
    const [users, setUsers] = useState([]);
    const [today, setToday] = useState("");

    // Get current date from browser
    useEffect(() => {
        const date = new Date();

        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");

        setToday(`${year}-${month}-${day}`);
    }, []);

    const getUsers = async () => {
        try {
            const res = await axios.get(
                "/api/user?limit=100",
                {
                    withCredentials: true,
                }
            );

            setUsers(res.data.data || []);
        } catch (error) {
            toast.error(
                error.response?.data?.message ||
                    "Failed to load users."
            );
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

                {/* Assigned To */}
                <SelectInput
                    label="Assigned To"
                    name="assignedTo"
                    value={form.assignedTo}
                    onChange={handleChange}
                    options={[
                        ...users.map((user) => ({
                            label: `${user.name} (${user.roleId?.name})`,
                            value: user._id,
                        })),
                    ]}
                />

                {/* Lead Stage */}
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

                {/* Price Range */}
                <Input
                    label="Price Range (₹)"
                    type="number"
                    name="priceRange"
                    value={form.priceRange}
                    onChange={handleChange}
                    placeholder="Price Range"
                />

                {/* Deal Value */}
                <Input
                    label="Deal Value (₹)"
                    type="number"
                    name="dealValue"
                    value={form.dealValue}
                    onChange={handleChange}
                    placeholder="Enter deal value"
                />

                {/* Expected Closure Date */}
                <Input
                    label="Expected Closure On"
                    type="date"
                    name="expectedClosureDate"
                    value={form.expectedClosureDate}
                    onChange={handleChange}
                    min={today}
                />

            </div>
        </div>
    );
}