"use client";

import Navbar from "@/components/user/Navbar";
import Sidebar from "@/components/user/Sidebar";
import OrgSetting from "./OrgSetting";

export default function page() {
    return (
        <div className="flex">
            <Sidebar />

            <div className="flex-1">
                <Navbar />

                <main className="">
                    <OrgSetting />
                </main>
            </div>
        </div>
    );
}