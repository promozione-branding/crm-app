// src/app/settings/page.jsx

'use client';

import Navbar from '@/components/user/Navbar';
import Sidebar from '@/components/user/Sidebar';
import Setting from './Setting';
import Stickyfooter from '@/components/user/Stickyfooter';

export default function page() {
    return (
        <div className="flex">
            <Sidebar />

            <div className="flex-1">
                <Navbar />

                <main className="">
                    <Setting />
                </main>

                <Stickyfooter />
            </div>
        </div>
    );
}
