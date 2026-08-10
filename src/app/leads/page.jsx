"use client";

import Navbar from "@/components/user/Navbar";
import Sidebar from "@/components/user/Sidebar";
import Leads from "./Leads";

export default function page() {
    return (
        <div className="flex">
            <Sidebar />

            <div className="flex-1 md:overflow-visible overflow-hidden">
                <Navbar />

                <main className="">
                    <Leads />
                </main>
            </div>
        </div>
    );
}