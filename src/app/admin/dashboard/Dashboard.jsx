import React from "react";

export default function Dashboard() {
    return (
        <div className="space-y-6 text-gray-700">
            <h1 className="text-3xl font-bold">Dashboard</h1>

            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
                {["Users", "Orders", "Revenue", "Products"].map((item) => (
                    <div
                        key={item}
                        className="bg-white rounded-2xl shadow-sm border border-gray-300 p-6"
                    >
                        <p className="text-gray-500">{item}</p>
                        <h2 className="text-3xl font-bold mt-2">0</h2>
                    </div>
                ))}
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-300 h-[450px] flex items-center justify-center text-gray-400">
                Charts / Tables Here
            </div>
        </div>
    );
}