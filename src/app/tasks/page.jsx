"use client";

import Navbar from "@/components/user/Navbar";
import Sidebar from "@/components/user/Sidebar";
import Task from "./Task";

export default function page() {
    return (
        <div className="flex">
            <Sidebar />

            <div className="flex-1 overflow-hidden">
                <Navbar />

                <main className="">
                    <Task />
                </main>
            </div>
        </div>
    );
}