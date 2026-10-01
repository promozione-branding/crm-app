// src/app/notifications/page.jsx

// src/app/reports/page.jsx

'use client';

import Navbar from '@/components/user/Navbar';
import Sidebar from '@/components/user/Sidebar';
import Notifications from './Notifications';
import Stickyfooter from '@/components/user/Stickyfooter';

export default function page() {
    return (
        <div className="flex">
            <Sidebar />

            <div className="flex-1">
                <Navbar />

                <main className="">
                    <Notifications />
                </main>

                <Stickyfooter />
            </div>
        </div>
    );
}
