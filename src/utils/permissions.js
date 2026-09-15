export const getPermission = (role, module) => {
    if (!role) return null;

    return role.permissions?.find(
        (permission) =>
            permission.module === module
    ) || null;
};

export const hasPermission = (
    role,
    module,
    action
) => {
    const permission = getPermission(
        role,
        module
    );

    if (!permission) {
        return false;
    }

    return permission.actions.includes(action);
};

export const getPermissionScope = (
    role,
    module
) => {
    const permission = getPermission(
        role,
        module
    );

    return permission?.scope || null;
};