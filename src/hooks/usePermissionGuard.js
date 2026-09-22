// src/hooks/usePermissionGuard.js

'use client';

import { hasPermission, usePermissions } from '@/lib/permissions';

export function usePermissionGuard(module, action = 'access') {
    const { permissions, user, role, loading } = usePermissions();

    return {
        user,
        role,
        permissions,
        loading,
        allowed: hasPermission(permissions, module, action),
        can: (mod, act) => hasPermission(permissions, mod, act),
    };
}
