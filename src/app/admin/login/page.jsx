"use client";

import { useState } from "react";
import {
    Mail,
    Lock, Eye, EyeOff,
    ArrowRight,
    ShieldCheck,
    BarChart3,
    Users,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { adminLogin } from "@/redux/admin/adminAuthSlice";
import toast from "react-hot-toast";

export default function Page() {
    const [showPassword, setShowPassword] = useState(false);
    const dispatch = useDispatch();
    const router = useRouter();
    const { loading, error } = useSelector(state => state.adminAuth);
    const [form, setForm] = useState({
        email: "",
        password: ""
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        const toastId = toast.loading("Logging in...");
        const result = await dispatch(adminLogin(form));

        if (adminLogin.fulfilled.match(result)) {
            toast.success("Login successful! Redirecting...", { id: toastId });
            setTimeout(() => { router.push("/admin/dashboard"); }, 500);
        } else {
            toast.error(result.payload || "Login failed", { id: toastId });
        }
    };

    return (
        <>
            {/* Navbar */}
            <header className="w-full bg-white border-b shadow-sm">
                <div className="max-w-7xl mx-auto h-20 px-6 flex items-center justify-center">
                    <Image
                        src="/logocheck.webp"
                        alt="InquiryBazaar"
                        width={240}
                        height={70}
                        priority
                    />
                </div>
            </header>

            {/* Main */}
            <div className="min-h-[calc(100vh-80px)] bg-slate-100 flex items-center justify-center p-6">
                <div className="w-full max-w-6xl bg-white rounded-3xl shadow-2xl overflow-hidden grid lg:grid-cols-2">
                    <div className="hidden lg:flex bg-linear-to-br from-[#082c62] via-[#0d376f] to-[#051f48] text-white p-8 flex-col">
                        <div>
                            <div className="flex items-center justify-center mb-4">
                                <Image
                                    src="/logoo.webp"
                                    alt="InquiryBazaar"
                                    width={250}
                                    height={50}
                                    className="rounded-2xl"
                                />
                            </div>

                            <h2 className="text-4xl font-bold leading-tight text-center">
                                Welcome Back!
                            </h2>

                            <p className="text-white/80 text-sm">
                                Manage your InquiryBazaar platform, companies, teams and
                                business.
                            </p>
                        </div>

                        <div className="space-y-6 mt-auto">
                            <div className="flex items-center gap-4">

                                <div className="bg-white/10 border border-white/10 p-3 rounded-xl">
                                    <Users size={22} />
                                </div>

                                <div>

                                    <h3 className="font-semibold">
                                        Company Management
                                    </h3>

                                    <p className="text-white/70 text-sm">
                                        Create and manage client companies with complete control.
                                    </p>

                                </div>

                            </div>

                            <div className="flex items-center gap-4">

                                <div className="bg-white/10 border border-white/10 p-3 rounded-xl">
                                    <BarChart3 size={22} />
                                </div>


                                <div>

                                    <h3 className="font-semibold">
                                        Business Analytics
                                    </h3>

                                    <p className="text-white/70 text-sm">
                                        Track platform growth, performance and activities.
                                    </p>

                                </div>

                            </div>
                        </div>
                    </div>

                    <div className="flex items-center justify-center p-4 lg:p-8">
                        <div className="w-full max-w-md">
                            <div className="lg:hidden flex justify-center mb-6">
                                <Image
                                    src="/logocheck.webp"
                                    alt="InquiryBazaar"
                                    width={180}
                                    height={55}
                                />
                            </div>

                            <div className="text-center mb-8">
                                <h2 className="text-3xl font-bold text-gray-900">
                                    Welcome to InquiryBazaar
                                </h2>

                                <p className="text-gray-500 mt-2">
                                    Login to continue to your dashboard.
                                </p>
                            </div>

                            <form className="space-y-5 text-black" onSubmit={handleSubmit}>
                                <div>
                                    <label className="block mb-2 text-sm font-medium text-gray-700">
                                        Email Address
                                    </label>

                                    <div className="flex items-center rounded-xl border border-gray-300 bg-gray-50 px-4 py-3 transition focus-within:border-[#082c62] focus-within:ring-4 focus-within:ring-[#082c62]/10">

                                        <Mail
                                            size={18}
                                            className="mr-3 text-gray-400"
                                        />

                                        <input
                                            type="email"
                                            placeholder="john@example.com"
                                            className="w-full bg-transparent outline-none"
                                            value={form.email}
                                            onChange={(e) => setForm({ ...form, email: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block mb-2 text-sm font-medium text-gray-700">
                                        Password
                                    </label>

                                    <div className="flex items-center rounded-xl border border-gray-300 bg-gray-50 px-4 py-3 transition focus-within:border-[#082c62] focus-within:ring-4 focus-within:ring-[#082c62]/10">

                                        <Lock
                                            size={18}
                                            className="mr-3 text-gray-400"
                                        />

                                        <input
                                            type={showPassword ? "text" : "password"}
                                            placeholder="••••••••"
                                            className="w-full bg-transparent outline-none"
                                            value={form.password}
                                            onChange={(e) => setForm({ ...form, password: e.target.value })}
                                        />

                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="ml-3 text-gray-400 hover:text-[#082c62] transition"
                                        >
                                            {showPassword ? (
                                                <EyeOff size={20} />
                                            ) : (
                                                <Eye size={20} />
                                            )}
                                        </button>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between text-sm">
                                    <label className="flex items-center gap-2 text-gray-600">
                                        <input type="checkbox" />
                                        Remember me
                                    </label>

                                    <button
                                        type="button"
                                        className="text-[#082c62] hover:underline"
                                    >
                                        Forgot Password?
                                    </button>
                                </div>

                                <button type="submit" disabled={loading}
                                    className="w-full bg-[#082c62] hover:bg-[#0d376f] text-white py-3 rounded-xl font-semibold transition flex items-center justify-center gap-2 shadow-lg">
                                    {loading ? "Logging in..." : "Login"}
                                    <ArrowRight size={18} />
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}