// src/components/user/auth/Can.jsx

'use client';

import { hasPermission, usePermissions } from '@/lib/permissions';

export default function Can({ module, action, fallback = null, children }) {
    const { permissions, loading } = usePermissions();

    if (loading) return null;

    if (!hasPermission(permissions, module, action)) {
        return fallback;
    }

    return <>{children}</>;
}