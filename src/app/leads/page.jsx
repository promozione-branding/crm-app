// src/app/leads/page.jsx

'use client';

import Navbar from '@/components/user/Navbar';
import Sidebar from '@/components/user/Sidebar';
import Leads from './Leads';
import Stickyfooter from '@/components/user/Stickyfooter';

export default function page() {
    return (
        <div className="flex">
            <Sidebar />

            <div className="flex-1 overflow-hidden md:overflow-visible">
                <Navbar />

                <main className="">
                    <Leads />
                </main>

                <Stickyfooter />
            </div>
        </div>
    );
}
