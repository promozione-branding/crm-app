// src/utils/serverPermissions.js

/**
 * Server-side permission check.
 *
 * sessionUser = {
 *   permissions: [{ module, actions, scope }],
 *   companyId: "...",
 *   _id: "...",
 *   teamId: "..."
 * }
 */
export function hasPermission(sessionUser, module, action) {
    if (!sessionUser) return false;

    const permissions = Array.isArray(sessionUser.permissions) ? sessionUser.permissions : [];

    const entry = permissions.find((p) => p?.module === module);

    if (!entry) return false;

    return Array.isArray(entry.actions) && entry.actions.includes(action);
}

/**
 * Returns the scope ('own' | 'team' | 'all') for a module,
 * or null if no access.
 */
export function getScope(sessionUser, module) {
    if (!sessionUser) return null;

    const permissions = Array.isArray(sessionUser.permissions) ? sessionUser.permissions : [];

    const entry = permissions.find((p) => p?.module === module);

    return entry?.scope || null;
}

/**
 * Build a Mongo filter based on the user's scope for a module.
 *
 * Assumes your documents have:
 *   - companyId (always)
 *   - assignedTo (for 'own')
 *   - teamId    (for 'team')
 */
export function buildScopeFilter(sessionUser, module) {
    const scope = getScope(sessionUser, module);

    if (!scope) {
        return { _id: null }; // deny
    }

    const base = { companyId: sessionUser.companyId };

    switch (scope) {
        case 'all':
            return base;

        case 'team':
            return {
                ...base,
                teamId: sessionUser.teamId,
            };

        case 'own':
        default:
            return {
                ...base,
                assignedTo: sessionUser._id,
            };
    }
}
