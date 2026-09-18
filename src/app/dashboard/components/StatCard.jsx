// src/app/dashboard/components/StatCard.jsx

'use client';

export default function StatCard({ title, value, icon: Icon, color, loading }) {
    return (
        <div
            className="
                bg-app
                border
                border-app
                rounded-xl
                sm:rounded-2xl
                p-3
                sm:p-4
                lg:p-6
                shadow-sm
                transition-all
                hover:-translate-y-0.5
            "
        >
            <div className="flex items-center justify-between gap-2 sm:gap-3">
                {/* DATA */}
                <div className="min-w-0 flex-1">
                    <p className="text-[11px] sm:text-sm opacity-70 truncate">{title}</p>

                    <h2 className="text-xl sm:text-2xl lg:text-4xl font-bold mt-1 sm:mt-2">
                        {loading ? (
                            <span
                                className="
                                    inline-block
                                    h-6
                                    sm:h-8
                                    lg:h-10
                                    w-10
                                    sm:w-12
                                    lg:w-16
                                    rounded-md
                                    bg-surface
                                    animate-pulse
                                "
                            />
                        ) : (
                            value
                        )}
                    </h2>
                </div>

                {/* ICON */}
                <div
                    className="
                        shrink-0
                        w-9
                        h-9
                        sm:w-11
                        sm:h-11
                        lg:w-14
                        lg:h-14
                        rounded-lg
                        sm:rounded-xl
                        bg-surface
                        flex
                        items-center
                        justify-center
                        border
                        border-app
                    "
                >
                    <Icon size={18} className={`${color} sm:hidden`} />

                    <Icon size={22} className={`${color} hidden sm:block lg:hidden`} />

                    <Icon size={28} className={`${color} hidden lg:block`} />
                </div>
            </div>
        </div>
    );
}
