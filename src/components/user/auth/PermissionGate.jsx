// src/components/user/auth/PermissionGate.jsx

'use client';

import { hasPermission, usePermissions } from '@/lib/permissions';
import NoAccess from './NoAccess';

export default function PermissionGate({
    module,
    action = 'access',
    children,
    loading = null, 
    message,
}) {
    const { permissions, loading: permissionsLoading } = usePermissions();

    if (permissionsLoading) {
        return (
            loading ?? (
                <div className="bg-surface text-app flex min-h-[calc(100vh-64px)] items-center justify-center">
                    <div className="text-sm opacity-70">Loading...</div>
                </div>
            )
        );
    }

    if (!hasPermission(permissions, module, action)) {
        return <NoAccess message={message} />;
    }

    return <>{children}</>;
}