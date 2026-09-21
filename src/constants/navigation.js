// src/constants/navigation.js

import {
    LayoutDashboard,
    Users,
    ClipboardList,
    BarChart3,
    PhoneCall,
    Settings,
} from 'lucide-react';

/**
 * Client app navigation.
 *
 * module = key from PERMISSION_MODULES
 * Every item requires `${module}.access`
 */
export const NAV_ITEMS = [
    {
        module: 'dashboard',
        name: 'Dashboard',
        href: '/dashboard',
        icon: LayoutDashboard,
    },
    {
        module: 'leads',
        name: 'Leads',
        href: '/leads',
        icon: Users,
    },
    {
        module: 'tasks',
        name: 'Task',
        href: '/tasks',
        icon: ClipboardList,
    },
    {
        module: 'reports',
        name: 'Reports',
        href: '/reports',
        icon: BarChart3,
    },
    {
        module: 'call_logs',
        name: 'Call Logs',
        href: '/call-logs',
        icon: PhoneCall,
    },
    {
        module: 'settings',
        name: 'Settings',
        href: '/settings',
        icon: Settings,
    },
];

/**
 * Short label for the mobile sticky footer
 * (slightly different from the sidebar).
 */
export const MOBILE_NAV_ITEMS = NAV_ITEMS.filter((item) =>
    ['dashboard', 'leads', 'tasks', 'reports', 'call_logs'].includes(item.module)
);