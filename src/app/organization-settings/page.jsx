// src/app/organization-settings/page.jsx

"use client";

import Navbar from "@/components/user/Navbar";
import Sidebar from "@/components/user/Sidebar";
import OrgSetting from "./OrgSetting";
import Stickyfooter from "@/components/user/Stickyfooter";

export default function page() {
    return (
        <div className="flex">
            <Sidebar />

            <div className="flex-1">
                <Navbar />

                <main className="">
                    <OrgSetting />
                </main>

                <Stickyfooter />
            </div>
        </div>
    );
}