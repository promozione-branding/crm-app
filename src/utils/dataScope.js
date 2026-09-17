// src/utils/dataScope.js

export const applyLeadScope = ({ filter, user, role, }) => {
    const permission = role?.permissions?.find(
        (item) => item.module === "leads"
    );

    if (!permission) {
        throw new Error(
            "You don't have permission to access leads"
        );
    }

    const scope = permission.scope;

    if (scope === "own") {
        filter.assignedTo = user._id;
    }

    if (scope === "team") {
        // Team implementation later
    }

    if (scope === "all") {
        // No assignedTo restriction
    }

    return filter;
};