// src/app/tasks/components/TaskUtils.js

// ============================================================
// FORMAT DUE DATE
// ============================================================

export function formatDueDate(date) {
    if (!date) return '-';

    const parsedDate = new Date(date);
    if (Number.isNaN(parsedDate.getTime())) return '-';

    return parsedDate.toLocaleString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
}

// ============================================================
// IS OVERDUE
// ============================================================

export function isOverdue(dueDate, status) {
    if (!dueDate) return false;

    const doneStatuses = ['completed', 'done', 'cancelled', 'canceled'];
    if (doneStatuses.includes(String(status).toLowerCase())) return false;

    const due = new Date(dueDate);
    if (Number.isNaN(due.getTime())) return false;

    return due < new Date();
}

// ============================================================
// SORT TASKS
// ============================================================

/**
 * Sort modes:
 *   - ''                  → default: overdue first, then API order
 *   - 'leadCreatedAtAsc'  → pure lead creation date, oldest first (NO overdue pin)
 *   - 'leadCreatedAtDesc' → pure lead creation date, newest first (NO overdue pin)
 *   - 'dueDate'           → overdue first, then earliest due
 *
 * Note: only DEFAULT and 'dueDate' pin overdue to the top.
 * The lead-creation-date options sort the whole list purely by that field
 * so the user gets exactly what they asked for.
 */
export function sortTasks(tasks = [], sortBy) {
    if (!Array.isArray(tasks)) return [];

    const sorted = [...tasks];

    // ── Pure lead-creation-date sorts (no overdue pin) ──
    if (sortBy === 'leadCreatedAtAsc') {
        sorted.sort((a, b) => {
            const aDate = new Date(a?.leadId?.createdAt || 0).getTime();
            const bDate = new Date(b?.leadId?.createdAt || 0).getTime();
            return aDate - bDate;
        });

        return sorted;
    }

    if (sortBy === 'leadCreatedAtDesc') {
        sorted.sort((a, b) => {
            const aDate = new Date(a?.leadId?.createdAt || 0).getTime();
            const bDate = new Date(b?.leadId?.createdAt || 0).getTime();
            return bDate - aDate;
        });

        return sorted;
    }

    // ── Default + dueDate: overdue first, then sort ──
    sorted.sort((a, b) => {
        // 1. Overdue always wins
        const aOverdue = isOverdue(a?.dueDate, a?.status) ? 0 : 1;
        const bOverdue = isOverdue(b?.dueDate, b?.status) ? 0 : 1;

        if (aOverdue !== bOverdue) return aOverdue - bOverdue;

        // 2. Then apply due-date sort if requested
        if (sortBy === 'dueDate') {
            const aDate = new Date(a?.dueDate || 0).getTime();
            const bDate = new Date(b?.dueDate || 0).getTime();
            return aDate - bDate;
        }

        // 3. Default: keep incoming order
        return 0;
    });

    return sorted;
}
