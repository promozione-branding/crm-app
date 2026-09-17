// src/app/call-logs/page.jsx

"use client";

import Navbar from "@/components/user/Navbar";
import Sidebar from "@/components/user/Sidebar";
import CallLog from "./CallLog";
import Stickyfooter from "@/components/user/Stickyfooter";

export default function page() {
    return (
        <div className="flex">
            <Sidebar />

            <div className="flex-1 overflow-hidde">
                <Navbar />

                <main className="">
                    <CallLog />
                </main>

                <Stickyfooter />
            </div>
        </div>
    );
}