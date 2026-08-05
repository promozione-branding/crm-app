"use client";

import Navbar from "@/components/user/Navbar";
import Sidebar from "@/components/user/Sidebar";
import CallLog from "./CallLog";

export default function page() {
    return (
        <div className="flex">
            <Sidebar />

            <div className="flex-1 overflow-hidde">
                <Navbar />

                <main className="">
                    <CallLog />
                </main>
            </div>
        </div>
    );
}