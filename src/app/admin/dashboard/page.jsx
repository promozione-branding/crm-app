// src/app/admin/dashboard/page.jsx

import Sidebar from '@/components/admin/Sidebar';
import Dashboard from './Dashboard';

export default function Page() {
    return (
        <div className="flex min-h-screen bg-gray-100">
            <Sidebar />

            <main className="flex-1 px-4 pt-15 md:p-6">
                <Dashboard />
            </main>
        </div>
    );
}
