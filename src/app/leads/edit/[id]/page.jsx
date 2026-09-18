// src/app/leads/edit/[id]/page.jsx

'use client';

import Navbar from '@/components/user/Navbar';
import Sidebar from '@/components/user/Sidebar';
import Edit from './Edit';
import Stickyfooter from '@/components/user/Stickyfooter';

export default function page() {
    return (
        <div className="flex">
            <Sidebar />

            <div className="flex-1 overflow-hidden md:overflow-visible">
                <Navbar />

                <main className="">
                    <Edit />
                </main>

                <Stickyfooter />
            </div>
        </div>
    );
}
