// src/components/user/auth/PermissionsBadge.jsx

'use client';

import { usePermissions, hasPermission } from '@/lib/permissions';

export default function PermissionsBadge() {
    const { user, role, permissions, loading } = usePermissions();

    if (loading) return null;

    const checks = [
        ['leads', 'access'],
        ['leads', 'add'],
        ['leads', 'edit'],
    ];

    return (
        <div className="border-app bg-app flex items-center gap-2 rounded-lg border px-3 py-1.5 text-xs">
            <span className="font-semibold">{role?.name || 'No role'}</span>
            <span className="opacity-40">·</span>
            <span className="opacity-70">{user?.name || '—'}</span>
            <span className="opacity-40">·</span>

            {checks.map(([m, a]) => {
                const ok = hasPermission(permissions, m, a);

                return (
                    <span key={`${m}.${a}`} className={ok ? 'text-emerald-500' : 'text-red-500/60'}>
                        {m}.{a}
                    </span>
                );
            })}
        </div>
    );
}
