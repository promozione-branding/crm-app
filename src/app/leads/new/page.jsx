// src/app/leads/new/page.jsx

"use client";

import Navbar from "@/components/user/Navbar";
import Sidebar from "@/components/user/Sidebar";
import New from "./New";
import Stickyfooter from "@/components/user/Stickyfooter";

export default function page() {
    return (
        <div className="flex">
            <Sidebar />

            <div className="flex-1">
                <Navbar />

                <main className="">
                    <New />
                </main>

                <Stickyfooter />
            </div>
        </div>
    );
}