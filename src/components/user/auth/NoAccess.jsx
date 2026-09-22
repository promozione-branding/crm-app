// src/components/user/auth/NoAccess.jsx

'use client';

import Link from 'next/link';
import { ShieldAlert } from 'lucide-react';

export default function NoAccess({ message = 'You do not have access to this page.' }) {
    return (
        <div className="bg-surface text-app flex min-h-[calc(100vh-64px)] items-center justify-center p-6">
            <div className="bg-app border-app flex max-w-md flex-col items-center gap-3 rounded-2xl border p-8 text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-red-500/10 text-red-500">
                    <ShieldAlert size={26} />
                </div>

                <h2 className="text-app text-base font-semibold">Access Denied</h2>

                <p className="text-muted text-sm">{message}</p>

                <Link href="/dashboard" className="btn-primary mt-2 rounded-lg px-4 py-2 text-sm">
                    Back to Dashboard
                </Link>
            </div>
        </div>
    );
}
