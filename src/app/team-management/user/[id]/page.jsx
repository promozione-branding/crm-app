// src/app/team-management/user/[id]/page.jsx

'use client';

import Navbar from '@/components/user/Navbar';
import Sidebar from '@/components/user/Sidebar';
import Stickyfooter from '@/components/user/Stickyfooter';
import User from './User';

export default function page() {
    return (
        <div className="flex">
            <Sidebar />

            <div className="flex-1 overflow-hidden md:overflow-visible">
                <Navbar />

                <main className="">
                    <User />
                </main>

                <Stickyfooter />
            </div>
        </div>
    );
}
