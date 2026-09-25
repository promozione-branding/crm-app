// src/app/admin/dashboard/Dashboard.jsx

import React from 'react';

export default function Dashboard() {
    return (
        <div className="space-y-6 text-gray-700">
            <h1 className="text-3xl font-bold">Dashboard</h1>

            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
                {['Users', 'Orders', 'Revenue', 'Products'].map((item) => (
                    <div key={item} className="rounded-2xl border border-gray-300 bg-white p-6 shadow-sm">
                        <p className="text-gray-500">{item}</p>
                        <h2 className="mt-2 text-3xl font-bold">0</h2>
                    </div>
                ))}
            </div>
            

            <div className="flex h-[450px] items-center justify-center rounded-2xl border border-gray-300 bg-white text-gray-400 shadow-sm">
                Charts / Tables Here
            </div>
        </div>
    );
}
