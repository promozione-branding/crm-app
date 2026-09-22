// src/lib/permissions.js

'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';

// ============================================================
// CONSTANTS
// ============================================================

const PERMISSIONS_UPDATED_EVENT = 'permissions:updated';

// ============================================================
// PURE HELPERS
// ============================================================

/**
 * Can the given permissions do module.action?
 */
export function hasPermission(permissions, module, action) {
    if (!Array.isArray(permissions)) return false;

    const entry = permissions.find((p) => p?.module === module);

    if (!entry) return false;

    return Array.isArray(entry.actions) && entry.actions.includes(action);
}

/**
 * What scope does the user have on this module?
 * Returns 'own' | 'team' | 'all' | null
 */
export function getScope(permissions, module) {
    if (!Array.isArray(permissions)) return null;

    const entry = permissions.find((p) => p?.module === module);

    return entry?.scope || null;
}

/**
 * Convenience: get the whole permission entry for a module.
 */
export function getModulePermission(permissions, module) {
    if (!Array.isArray(permissions)) return null;

    return permissions.find((p) => p?.module === module) || null;
}

// ============================================================
// CACHE
// ============================================================

let cachedData = null;
let cachedPromise = null;

export function clearPermissionCache() {
    cachedData = null;
    cachedPromise = null;
}

// ============================================================
// EVENT BUS — for live refresh after role/permission changes
// ============================================================

export function notifyPermissionsUpdated() {
    if (typeof window === 'undefined') return;

    clearPermissionCache();

    window.dispatchEvent(new Event(PERMISSIONS_UPDATED_EVENT));
}

// ============================================================
// MAIN HOOK
// ============================================================

export function usePermissions() {
    const [data, setData] = useState(cachedData);
    const [loading, setLoading] = useState(!cachedData);

    // ---------------------------------------
    // FETCH (initial + on cache clear)
    // ---------------------------------------

    const fetchPermissions = () => {
        setLoading(true);

        cachedPromise = axios
            .get('/api/user/auth/permissions', { withCredentials: true })
            .then((res) => {
                const payload = {
                    user: res.data?.data?.user || null,
                    role: res.data?.data?.role || null,
                    permissions: res.data?.data?.permissions || [],
                };

                // 👇 LOG EVERYTHING so you can inspect from any page
                console.log('============================================');
                console.log('🔐 PERMISSIONS DATA');
                console.log('👤 USER:', payload.user);
                console.log('🎭 ROLE:', payload.role);
                console.log('📦 PERMISSIONS:', payload.permissions);
                console.log('============================================');

                return payload;
            })
            .catch((err) => {
                console.error('[usePermissions] FAILED:', err?.response?.status, err?.response?.data || err?.message);

                return { user: null, role: null, permissions: [] };
            });

        cachedPromise.then((result) => {
            cachedData = result;

            setData(result);
            setLoading(false);
        });
    };

    // ---------------------------------------
    // EFFECT
    // ---------------------------------------

    useEffect(() => {
        let mounted = true;

        if (cachedData) {
            setData(cachedData);
            setLoading(false);
        } else {
            fetchPermissions();
        }

        // Listen for manual refresh
        const handleRefresh = () => {
            if (!mounted) return;

            cachedData = null;
            cachedPromise = null;

            fetchPermissions();
        };

        window.addEventListener(PERMISSIONS_UPDATED_EVENT, handleRefresh);

        return () => {
            mounted = false;
            window.removeEventListener(PERMISSIONS_UPDATED_EVENT, handleRefresh);
        };

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // ---------------------------------------
    // RETURN
    // ---------------------------------------

    return {
        user: data?.user || null,
        role: data?.role || null,
        permissions: data?.permissions || [],
        loading,
    };
}

// ============================================================
// CONVENIENCE HOOKS
// ============================================================

/**
 * { can: (module, action) => boolean, ... }
 * Handy for inline checks without importing hasPermission.
 */
export function useCan(module, action) {
    const { permissions, loading } = usePermissions();

    return {
        can: hasPermission(permissions, module, action),
        loading,
    };
}

/**
 * Flat lookup: { 'leads.access': true, 'leads.edit': false, ... }
 *
 * Use for quick UI decisions:
 *   const map = usePermissionMap()
 *   if (map['leads.add']) { ... }
 */
export function usePermissionMap() {
    const { permissions, loading } = usePermissions();

    const map = {};

    if (Array.isArray(permissions)) {
        permissions.forEach((entry) => {
            if (!entry?.module || !Array.isArray(entry.actions)) return;

            entry.actions.forEach((action) => {
                map[`${entry.module}.${action}`] = true;
            });
        });
    }

    return { map, permissions, loading };
}
