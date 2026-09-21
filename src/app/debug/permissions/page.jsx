// src/app/debug/permissions/page.jsx

'use client';

import { useState } from 'react';
import { usePermissions, hasPermission, getScope } from '@/lib/permissions';
import { PERMISSION_MODULES, PERMISSION_ACTIONS } from '@/constants/permissions';

export default function DebugPermissionsPage() {
    const { user, role, permissions, loading } = usePermissions();

    // For the interactive tester
    const [testModule, setTestModule] = useState('leads');
    const [testAction, setTestAction] = useState('access');

    if (loading) {
        return (
            <div className="bg-surface text-app flex min-h-screen items-center justify-center">
                <div className="text-sm opacity-70">Loading permissions...</div>
            </div>
        );
    }

    // ============================================
    // SUMMARY STATS
    // ============================================

    const totalModules = PERMISSION_MODULES.length;
    const grantedModules = permissions.length;

    const totalAllowedActions = permissions.reduce(
        (sum, p) => sum + (Array.isArray(p.actions) ? p.actions.length : 0),
        0
    );

    const isAllowed = hasPermission(permissions, testModule, testAction);

    return (
        <div className="bg-surface text-app min-h-screen p-4 md:p-8">
            <div className="mx-auto max-w-5xl space-y-6">
                {/* ============================================ */}
                {/* HEADER + BADGE                                */}
                {/* ============================================ */}

                <div className="bg-app border-app rounded-2xl border p-5">
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <div>
                            <h1 className="text-lg font-bold">🔐 Permissions Debug</h1>
                            <p className="text-muted mt-1 text-xs">Live from /api/user/auth/permissions</p>
                        </div>

                        {/* ============ BADGE ============ */}
                        <div className="border-app bg-surface flex flex-wrap items-center gap-2 rounded-xl border px-3 py-2 text-xs">
                            <span className="font-semibold">{role?.name || 'No role'}</span>

                            <span className="opacity-30">•</span>

                            <span className="opacity-70">{user?.name || '—'}</span>

                            <span className="opacity-30">•</span>

                            <span className="rounded-full bg-blue-500/10 px-2 py-0.5 font-mono text-blue-500">
                                {grantedModules}/{totalModules} modules
                            </span>

                            <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 font-mono text-emerald-500">
                                {totalAllowedActions} actions
                            </span>
                        </div>
                    </div>
                </div>

                {/* ============================================ */}
                {/* USER + ROLE                                   */}
                {/* ============================================ */}

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="bg-app border-app rounded-2xl border p-5">
                        <h2 className="mb-3 text-sm font-semibold">👤 User</h2>
                        <pre className="bg-surface border-app overflow-auto rounded-lg border p-3 text-xs">
                            {JSON.stringify(user, null, 2)}
                        </pre>
                    </div>

                    <div className="bg-app border-app rounded-2xl border p-5">
                        <h2 className="mb-3 text-sm font-semibold">🎭 Role</h2>
                        <pre className="bg-surface border-app overflow-auto rounded-lg border p-3 text-xs">
                            {JSON.stringify(role, null, 2)}
                        </pre>
                    </div>
                </div>

                {/* ============================================ */}
                {/* INTERACTIVE TESTER                            */}
                {/* ============================================ */}

                <div className="bg-app border-app rounded-2xl border p-5">
                    <h2 className="mb-3 text-sm font-semibold">🧪 Interactive Tester</h2>

                    <p className="text-muted mb-3 text-xs">
                        Pick any module + action → see instantly if the current user is allowed.
                    </p>

                    <div className="flex flex-wrap items-center gap-2">
                        <select
                            value={testModule}
                            onChange={(e) => setTestModule(e.target.value)}
                            className="border-app bg-surface h-9 rounded-lg border px-3 text-xs outline-none"
                        >
                            {PERMISSION_MODULES.map((m) => (
                                <option key={m.key} value={m.key}>
                                    {m.name}
                                </option>
                            ))}
                        </select>

                        <span className="opacity-40">.</span>

                        <select
                            value={testAction}
                            onChange={(e) => setTestAction(e.target.value)}
                            className="border-app bg-surface h-9 rounded-lg border px-3 text-xs outline-none"
                        >
                            {PERMISSION_ACTIONS.map((a) => (
                                <option key={a.key} value={a.key}>
                                    {a.label}
                                </option>
                            ))}
                        </select>

                        <span className="opacity-40">→</span>

                        <div
                            className={`rounded-lg px-3 py-1.5 text-xs font-semibold ${
                                isAllowed
                                    ? 'border border-emerald-500/30 bg-emerald-500/10 text-emerald-500'
                                    : 'border border-red-500/30 bg-red-500/10 text-red-500'
                            }`}
                        >
                            {isAllowed ? '✅ ALLOWED' : '❌ DENIED'}
                        </div>

                        <code className="text-muted ml-2 text-[11px]">
                            {testModule}.{testAction}
                        </code>
                    </div>
                </div>

                {/* ============================================ */}
                {/* RAW PERMISSIONS                               */}
                {/* ============================================ */}

                <div className="bg-app border-app rounded-2xl border p-5">
                    <h2 className="mb-3 text-sm font-semibold">📦 Raw Permissions Array</h2>
                    <pre className="bg-surface border-app overflow-auto rounded-lg border p-3 text-xs">
                        {JSON.stringify(permissions, null, 2)}
                    </pre>
                </div>

                {/* ============================================ */}
                {/* GRID: every module × every action             */}
                {/* ============================================ */}

                <div className="bg-app border-app rounded-2xl border p-5">
                    <h2 className="mb-3 text-sm font-semibold">✅ What You Can / Cannot Do</h2>

                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse text-xs">
                            <thead>
                                <tr className="border-app border-b">
                                    <th className="p-2 text-left">Module</th>
                                    <th className="p-2 text-left">Scope</th>
                                    {PERMISSION_ACTIONS.map((a) => (
                                        <th key={a.key} className="p-2 text-center">
                                            {a.label}
                                        </th>
                                    ))}
                                </tr>
                            </thead>

                            <tbody>
                                {PERMISSION_MODULES.map((mod) => {
                                    const scope = getScope(permissions, mod.key);

                                    return (
                                        <tr key={mod.key} className="border-app border-b">
                                            <td className="p-2 font-medium">
                                                {mod.name}
                                                <div className="text-[10px] opacity-50">{mod.key}</div>
                                            </td>

                                            <td className="p-2">
                                                {scope ? (
                                                    <span className="rounded-full bg-blue-500/10 px-2 py-0.5 text-blue-500">
                                                        {scope}
                                                    </span>
                                                ) : (
                                                    <span className="text-muted">—</span>
                                                )}
                                            </td>

                                            {PERMISSION_ACTIONS.map((act) => {
                                                const available = mod.actions.includes(act.key);
                                                const allowed = available && hasPermission(permissions, mod.key, act.key);

                                                return (
                                                    <td key={act.key} className="p-2 text-center">
                                                        {!available ? (
                                                            <span className="opacity-20">·</span>
                                                        ) : allowed ? (
                                                            <span className="text-emerald-500">✓</span>
                                                        ) : (
                                                            <span className="text-red-500/60">✗</span>
                                                        )}
                                                    </td>
                                                );
                                            })}
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>

                    <div className="text-muted mt-3 text-[11px]">
                        ✓ = allowed &nbsp;·&nbsp; ✗ = not allowed &nbsp;·&nbsp; · = not applicable for that module
                    </div>
                </div>

                {/* ============================================ */}
                {/* QUICK TEST                                    */}
                {/* ============================================ */}

                <div className="bg-app border-app rounded-2xl border p-5">
                    <h2 className="mb-3 text-sm font-semibold">⚡ Quick Tests</h2>

                    <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
                        {[
                            ['leads', 'access'],
                            ['leads', 'add'],
                            ['leads', 'edit'],
                            ['leads', 'delete'],
                            ['tasks', 'access'],
                            ['reports', 'access'],
                            ['team_management', 'access'],
                            ['settings', 'access'],
                        ].map(([mod, act]) => {
                            const ok = hasPermission(permissions, mod, act);

                            return (
                                <div
                                    key={`${mod}.${act}`}
                                    className={`rounded-lg border p-2 text-xs ${
                                        ok
                                            ? 'border-emerald-500/30 bg-emerald-500/5'
                                            : 'border-red-500/30 bg-red-500/5'
                                    }`}
                                >
                                    <div className="font-mono">
                                        {mod}.{act}
                                    </div>
                                    <div className={ok ? 'text-emerald-500' : 'text-red-500'}>
                                        {ok ? 'ALLOWED' : 'DENIED'}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}