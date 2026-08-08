"use client";

import Navbar from "@/components/user/Navbar";
import Sidebar from "@/components/user/Sidebar";
import Team from "./Team";

export default function page() {
    return (
        <div className="flex">
            <Sidebar />

            <div className="flex-1">
                <Navbar />

                <main className="">
                    <Team />
                </main>
            </div>
        </div>
    );
}