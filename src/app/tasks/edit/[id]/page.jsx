// src/app/tasks/edit/[id]/page.jsx

'use client';

import Navbar from '@/components/user/Navbar';
import Sidebar from '@/components/user/Sidebar';
import Edit from './Edit';

export default function Page() {
    return (
        <div className="flex min-h-screen">
            <Sidebar />

            <div className="min-w-0 flex-1">
                <Navbar />

                <main>
                    <Edit />
                </main>
            </div>
        </div>
    );
}
