import React from 'react'

export default function Google() {
    return (
        <div className="space-y-5">
            <div>
                <h2 className="text-base font-semibold text-app">
                    Google
                </h2>

                <p className="text-xs text-muted mt-1">
                    Connect your Google account to manage your Google
                    integrations.
                </p>
            </div>

            <div className="max-w-xl">
                <div className="group bg-app border border-app rounded-2xl p-5 transition-all duration-200 hover:border-blue-500/40 hover:shadow-lg">
                    <div className="flex items-start justify-between gap-4">
                        <div className="flex items-center gap-3 min-w-0">
                            <div className=" w-12 h-12 rounded-xl border border-app bg-surface flex items-center justify-center shrink-0 overflow-hidden">
                                <img
                                    src={"/logos/google.png"}
                                    alt={`${name} logo`}
                                    className="w-8 h-8 object-contain"
                                />
                            </div>

                            <div className="min-w-0">
                                <h3 className="font-semibold text-app text-sm">
                                    Google
                                </h3>

                                <div className="flex items-center gap-1.5 mt-1">
                                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                                    <span className="text-[11px] text-muted">
                                        Available
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <p className="text-xs text-muted leading-5 mt-4 min-h-[40px]">
                        Connect Google to manage leads and customer interactions from Google.
                    </p>

                    <button className="w-full mt-5 h-9 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium transition-colors">
                        Connect
                    </button>
                </div>
            </div>
        </div>
    )
}
