"use client";

// ============================================================
// CHART ITEMS
// ============================================================

const chartItems = [
    {
        key: "users",
        label: "Users",
        color: "#3b82f6",
    },
    {
        key: "leads",
        label: "Leads",
        color: "#22c55e",
    },
    {
        key: "calls",
        label: "Calls",
        color: "#a855f7",
    },
    {
        key: "tasks",
        label: "Tasks",
        color: "#f97316",
    },
];

// ============================================================
// COMPONENT
// ============================================================

export default function DashboardAnalytics({
    stats,
    loading,
}) {
    const total =
        Number(stats.users || 0) +
        Number(stats.leads || 0) +
        Number(stats.calls || 0) +
        Number(stats.tasks || 0);

    const radius = 72;

    const circumference =
        2 * Math.PI * radius;

    let accumulated = 0;

    return (
        <section
            className="
                mt-6
                sm:mt-8
                bg-app
                border
                border-app
                rounded-2xl
                p-4
                sm:p-6
            "
        >

            {/* ==================================================
                HEADER
            ================================================== */}

            <div className="mb-5 sm:mb-6">
                <h2 className="text-lg sm:text-xl font-semibold">
                    Analytics
                </h2>

                <p className="text-xs sm:text-sm opacity-60 mt-1">
                    Overview of your CRM data
                </p>
            </div>

            {/* ==================================================
                ANALYTICS CONTENT
            ================================================== */}

            <div
                className="
                    grid
                    grid-cols-1
                    lg:grid-cols-2
                    gap-6
                    lg:gap-10
                    items-center
                "
            >

                {/* ==================================================
                    DONUT CHART
                ================================================== */}

                <div className="flex justify-center">

                    <div
                        className="
                            relative
                            w-[220px]
                            h-[220px]
                            sm:w-[260px]
                            sm:h-[260px]
                        "
                    >

                        {loading ? (
                            <div
                                className="
                                    absolute
                                    inset-0
                                    rounded-full
                                    border-[24px]
                                    sm:border-[28px]
                                    border-surface
                                    animate-pulse
                                "
                            />
                        ) : total === 0 ? (
                            <div
                                className="
                                    absolute
                                    inset-0
                                    rounded-full
                                    border-[24px]
                                    sm:border-[28px]
                                    border-surface
                                "
                            />
                        ) : (
                            <svg
                                viewBox="0 0 200 200"
                                className="
                                    w-full
                                    h-full
                                    -rotate-90
                                "
                            >

                                {/* ==================================================
                                    BACKGROUND
                                ================================================== */}

                                <circle
                                    cx="100"
                                    cy="100"
                                    r={radius}
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="26"
                                    className="text-surface"
                                />

                                {/* ==================================================
                                    DONUT SEGMENTS
                                ================================================== */}

                                {chartItems.map(
                                    (item) => {
                                        const value =
                                            Number(
                                                stats[
                                                    item.key
                                                ] || 0
                                            );

                                        if (
                                            value <=
                                                0 ||
                                            total <=
                                                0
                                        ) {
                                            return null;
                                        }

                                        const percentage =
                                            value /
                                            total;

                                        const segmentLength =
                                            percentage *
                                            circumference;

                                        const dashOffset =
                                            -accumulated;

                                        accumulated +=
                                            segmentLength;

                                        return (
                                            <circle
                                                key={
                                                    item.key
                                                }
                                                cx="100"
                                                cy="100"
                                                r={
                                                    radius
                                                }
                                                fill="none"
                                                stroke={
                                                    item.color
                                                }
                                                strokeWidth="26"
                                                strokeDasharray={`${segmentLength} ${
                                                    circumference -
                                                    segmentLength
                                                }`}
                                                strokeDashoffset={
                                                    dashOffset
                                                }
                                                strokeLinecap="butt"
                                            />
                                        );
                                    }
                                )}

                            </svg>
                        )}

                        {/* ==================================================
                          CENTER TEXT
                        ================================================== */}

                        <div
                            className="
                                absolute
                                inset-0
                                flex
                                flex-col
                                items-center
                                justify-center
                            "
                        >
                            <span className="text-xs opacity-60">
                                Total
                            </span>

                            <span className="text-2xl sm:text-3xl font-bold mt-1">
                                {loading
                                    ? "—"
                                    : total}
                            </span>

                            <span className="text-xs opacity-50 mt-1">
                                Records
                            </span>
                        </div>

                    </div>
                </div>

                {/* ==================================================
                    LEGEND / DETAILS
                ================================================== */}

                <div className="space-y-3 sm:space-y-4">

                    {chartItems.map(
                        (item) => {
                            const value =
                                Number(
                                    stats[
                                        item.key
                                    ] || 0
                                );

                            const percentage =
                                total > 0
                                    ? (
                                          (value /
                                              total) *
                                          100
                                      ).toFixed(
                                          1
                                      )
                                    : "0.0";

                            return (
                                <div
                                    key={
                                        item.key
                                    }
                                    className="
                                        flex
                                        items-center
                                        justify-between
                                        gap-3
                                        rounded-xl
                                        border
                                        border-app
                                        p-3
                                        sm:p-4
                                    "
                                >

                                    {/* ==================================================
                                        LABEL
                                    ================================================== */}

                                    <div className="flex items-center gap-3 min-w-0">

                                        <span
                                            className="
                                                shrink-0
                                                w-3
                                                h-3
                                                rounded-full
                                            "
                                            style={{
                                                backgroundColor:
                                                    item.color,
                                            }}
                                        />

                                        <span className="text-sm font-medium truncate">
                                            {
                                                item.label
                                            }
                                        </span>

                                    </div>

                                    {/* ==================================================
                                        VALUE
                                    ================================================== */}

                                    <div className="flex items-center gap-3 sm:gap-5 shrink-0">

                                        <span className="text-xs sm:text-sm opacity-60">
                                            {
                                                percentage
                                            }
                                            %
                                        </span>

                                        <span className="font-semibold min-w-[32px] text-right">
                                            {loading
                                                ? "—"
                                                : value}
                                        </span>

                                    </div>

                                </div>
                            );
                        }
                    )}

                </div>

            </div>
        </section>
    );
}