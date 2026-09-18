// src/app/dashboard/components/StatCard.jsx

'use client';

export default function StatCard({ title, value, icon: Icon, color, loading }) {
    return (
        <div
            className="
                bg-app
                border
                border-app
                rounded-2xl
                p-4
                sm:p-5
                lg:p-6
                shadow-sm
                transition-all
                hover:-translate-y-1
            "
        >
            <div className="flex items-center justify-between gap-3">
                {/* ==================================================
                    CONTENT
                ================================================== */}

                <div className="min-w-0">
                    <p className="text-xs sm:text-sm opacity-70 truncate">{title}</p>

                    <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mt-2 sm:mt-3">
                        {loading ? (
                            <span
                                className="
                                    inline-block
                                    h-8
                                    sm:h-10
                                    w-12
                                    sm:w-16
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

                {/* ==================================================
                    ICON
                ================================================== */}

                <div
                    className="
                        shrink-0
                        w-11
                        h-11
                        sm:w-12
                        sm:h-12
                        lg:w-14
                        lg:h-14
                        rounded-xl
                        bg-surface
                        flex
                        items-center
                        justify-center
                        border
                        border-app
                    "
                >
                    <Icon size={22} className={`${color} sm:hidden`} />

                    <Icon size={28} className={`${color} hidden sm:block`} />
                </div>
            </div>
        </div>
    );
}
