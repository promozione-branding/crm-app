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
import toast from "react-hot-toast";
import { userLogin } from "@/redux/user/userAuthSlice";

export default function Page() {
    const [showPassword, setShowPassword] = useState(false);
    const dispatch = useDispatch();
    const router = useRouter();
    const { loading, error } = useSelector(state => state.userAuth);
    const [form, setForm] = useState({
        email: "",
        password: ""
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        const toastId = toast.loading("Logging in...");
        const result = await dispatch(userLogin(form));

        if (userLogin.fulfilled.match(result)) {
            toast.success("Login successful! Redirecting...", { id: toastId });
            setTimeout(() => { router.push("/dashboard"); }, 500);
        } else {
            toast.error(result.payload || "Login failed", { id: toastId });
        }
    };

    return (
        <>
            {/* Main */}
            <div className="min-h-screen bg-slate-100 flex items-center justify-center">
                <div className="flex items-center justify-center p-4 lg:p-8 bg-white rounded-2xl shadow-lg">
                    <div className="w-full max-w-md">
                        <div className="text-center mb-8">
                            <h2 className="text-3xl font-bold text-gray-900">
                                Welcome to Your CRM
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

                            <button
                                type="submit"
                                className="w-full bg-[#082c62] hover:bg-[#0d376f] text-white py-3 rounded-xl font-semibold transition flex items-center justify-center gap-2 shadow-lg"
                            >
                                Login
                                <ArrowRight size={18} />
                            </button>
                        </form>

                        <p className="text-center mt-4 text-gray-500 text-sm">
                            Don't have an account?

                            <span
                                className="ml-1 font-semibold text-[#082c62] hover:underline cursor-pointer"
                            >
                                Contact Admin <ArrowRight size={15} className="inline-block" />
                            </span>
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}