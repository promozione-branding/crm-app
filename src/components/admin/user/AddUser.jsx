"use client";

import React, { useState } from "react";
import Modal from "../Modal";
import {
    User,
    Mail,
    Phone,
    Lock,
    Building2,
    Globe,
    Shield,
    NotepadText,
} from "lucide-react";
import Input from "../Input";
import SelectInput from "../SelectInput";
import axios from "axios";
import toast from "react-hot-toast";

export default function AddUser({ userAdd, setUserAdd, getCompanies }) {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        // User
        userName: "",
        userEmail: "",
        userPhone: "",
        password: "",

        // Company
        companyName: "",
        website: "",
        crmDomain: "",
        plan: "free",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async () => {
        const toastId = toast.loading("Creating company...");
        console.log(formData)
        try {
            setLoading(true);
            const res = await axios.post("/api/admin/companies/create", formData);

            if (res.data.success) {
                toast.success("Company and user created successfully!", { id: toastId });
                setUserAdd(false);
                getCompanies()
                setFormData({
                    userName: "",
                    userEmail: "",
                    userPhone: "",
                    password: "",
                    role: "admin",

                    companyName: "",
                    website: "",
                    crmDomain: "",
                    plan: "free",
                });
            } else {
                toast.error(res.data.message || "Something went wrong", { id: toastId });
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to create company", { id: toastId });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal isOpen={userAdd} onClose={() => setUserAdd(false)} size="xl">
            <Modal.Header>Create User</Modal.Header>

            <Modal.Body>
                <div className="grid grid-cols-2 md:grid-cols-2 gap-5">
                    <Input
                        label="User Name"
                        name="userName"
                        value={formData.userName}
                        onChange={handleChange}
                        placeholder="John Doe"
                        icon={User}
                        required
                    />

                    <Input
                        label="User Email"
                        type="email"
                        name="userEmail"
                        value={formData.userEmail}
                        onChange={handleChange}
                        placeholder="john@example.com"
                        icon={Mail}
                        required
                    />

                    <Input
                        label="User Phone"
                        type="tel"
                        name="userPhone"
                        value={formData.userPhone}
                        onChange={handleChange}
                        placeholder="123-456-7890"
                        icon={Phone}
                        required
                    />

                    <Input
                        label="User Password"
                        type="password"
                        name="password"
                        placeholder="••••••••"
                        value={formData.password}
                        onChange={handleChange}
                        icon={Lock}
                        required
                    />

                    <Input
                        label="Company Name"
                        name="companyName"
                        placeholder="XYZ Corporation"
                        value={formData.companyName}
                        onChange={handleChange}
                        icon={Building2}
                        required
                    />

                    <SelectInput
                        label="Plan"
                        name="plan"
                        value={formData.plan}
                        onChange={handleChange}
                        icon={NotepadText}
                        options={[
                            { label: "Free", value: "free" },
                            { label: "Starter", value: "starter" },
                            { label: "Growth", value: "growth" },
                            { label: "Pro", value: "pro" },
                            { label: "Elite", value: "elite" },
                        ]}
                    />

                    <Input
                        label="Website"
                        name="website"
                        value={formData.website}
                        onChange={handleChange}
                        icon={Globe}
                        placeholder="https://example.com"
                        required
                    />
                </div>
            </Modal.Body>

            <Modal.Footer>
                <button
                    onClick={() => setUserAdd(false)}
                    className="px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 hover:bg-gray-200"
                >
                    Cancel
                </button>

                <button
                    onClick={handleSubmit}
                    className="px-5 py-2 rounded-lg bg-[#082c62] hover:bg-[#051f48] text-white"
                    disabled={loading}
                >
                    {loading ? "Creating..." : "Create User"}
                </button>
            </Modal.Footer>
        </Modal>
    );
}