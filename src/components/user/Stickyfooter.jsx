// src/components/user/Stickyfooter.jsx

'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { MOBILE_NAV_ITEMS } from '@/constants/navigation';
import { usePermissionMap } from '@/lib/permissions';

export default function Stickyfooter() {
    const pathname = usePathname();
    const { map, loading } = usePermissionMap();

    const visibleItems = loading
        ? []
        : MOBILE_NAV_ITEMS.filter((item) => map[`${item.module}.access`]);

    // Hide the whole footer if the user has no mobile nav permissions
    if (!loading && visibleItems.length === 0) return null;

    return (
        <nav className="bg-app border-app fixed right-0 bottom-0 left-0 z-50 border-t pb-[env(safe-area-inset-bottom)] shadow-[0_-2px_10px_rgba(0,0,0,0.05)] md:hidden">
            <div className="mx-auto flex h-16 w-full max-w-md items-center justify-between px-1 sm:px-2">
                {visibleItems.map((item) => {
                    const Icon = item.icon;

                    const active = pathname === item.href || pathname.startsWith(item.href + '/');

                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            aria-current={active ? 'page' : undefined}
                            className={`relative flex h-16 min-w-0 flex-1 flex-col items-center justify-center gap-1 rounded-lg px-1 transition-all duration-200 active:scale-95 ${active ? 'text-blue-600' : 'text-muted hover:text-app'} `}
                        >
                            <Icon size={20} strokeWidth={active ? 2.5 : 2} className="shrink-0" />

                            <span
                                className={`xs:text-[11px] max-w-full truncate text-[10px] leading-none font-medium ${active ? 'text-blue-600' : 'text-muted'} `}
                            >
                                {item.name}
                            </span>

                            {active && <span className="absolute bottom-0 left-1/2 h-0.5 w-7 -translate-x-1/2 rounded-full bg-blue-600 sm:w-8" />}
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
}