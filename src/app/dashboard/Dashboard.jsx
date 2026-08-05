"use client";

import {
    Users,
    UserPlus,
    Phone,
    ClipboardList,
} from "lucide-react";

const stats = [
    {
        title: "Users",
        value: 0,
        icon: Users,
        color: "text-blue-500",
    },
    {
        title: "Leads",
        value: 0,
        icon: UserPlus,
        color: "text-green-500",
    },
    {
        title: "Calls",
        value: 0,
        icon: Phone,
        color: "text-purple-500",
    },
    {
        title: "Tasks",
        value: 0,
        icon: ClipboardList,
        color: "text-orange-500",
    },
];

export default function Dashboard() {
    return (
        <div className="bg-surface text-app min-h-screen p-6">

            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold">
                    Dashboard
                </h1>

                <p className="text-sm opacity-70 mt-1">
                    Welcome to your CRM dashboard.
                </p>
            </div>

            {/* Stats */}
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">

                {stats.map((item) => {
                    const Icon = item.icon;

                    return (
                        <div
                            key={item.title}
                            className="bg-app border border-app rounded-2xl p-6 shadow-sm hover:-translate-y-1 transition-all"
                        >
                            <div className="flex items-center justify-between">

                                <div>

                                    <p className="text-sm opacity-70">
                                        {item.title}
                                    </p>

                                    <h2 className="text-4xl font-bold mt-3">
                                        {item.value}
                                    </h2>

                                </div>

                                <div className="w-14 h-14 rounded-xl bg-surface flex items-center justify-center border border-app">
                                    <Icon
                                        size={28}
                                        className={item.color}
                                    />
                                </div>

                            </div>
                        </div>
                    );
                })}

            </div>

            {/* Charts */}
            <div className="mt-8 bg-app border border-app rounded-2xl h-[420px] flex items-center justify-center">

                <div className="text-center">

                    <h2 className="text-xl font-semibold">
                        Analytics
                    </h2>

                    <p className="opacity-60 mt-2">
                        Charts and reports will appear here.
                    </p>

                </div>

            </div>

        </div>
    );
}