// src/app/profile/page.jsx
//

'use client';

import Navbar from '@/components/user/Navbar';
import Sidebar from '@/components/user/Sidebar';
import Profile from './Profile';
import Stickyfooter from '@/components/user/Stickyfooter';

export default function page() {
    return (
        <div className="flex">
            <Sidebar />

            <div className="flex-1">
                <Navbar />

                <main className="">
                    <Profile />
                </main>

                <Stickyfooter />
            </div>
        </div>
    );
}
