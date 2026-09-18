// src/app/dashboard/components/StatCard.jsx

'use client';

export default function StatCard({ title, value, icon: Icon, color, loading }) {
    return (
        <div className="bg-app border-app rounded-xl border p-3 shadow-sm transition-all hover:-translate-y-0.5 sm:rounded-2xl sm:p-4 lg:p-6">
            <div className="flex items-center justify-between gap-2 sm:gap-3">
                {/* DATA */}
                <div className="min-w-0 flex-1">
                    <p className="truncate text-[11px] opacity-70 sm:text-sm">{title}</p>

                    <h2 className="mt-1 text-xl font-bold sm:mt-2 sm:text-2xl lg:text-4xl">
                        {loading ? <span className="bg-surface inline-block h-6 w-10 animate-pulse rounded-md sm:h-8 sm:w-12 lg:h-10 lg:w-16" /> : value}
                    </h2>
                </div>

                {/* ICON */}
                <div className="bg-surface border-app flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border sm:h-11 sm:w-11 sm:rounded-xl lg:h-14 lg:w-14">
                    <Icon size={18} className={`${color} sm:hidden`} />

                    <Icon size={22} className={`${color} hidden sm:block lg:hidden`} />

                    <Icon size={28} className={`${color} hidden lg:block`} />
                </div>
            </div>
        </div>
    );
}
