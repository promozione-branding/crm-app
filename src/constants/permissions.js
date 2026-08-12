export const PERMISSION_ACTIONS = [
    {
        key: "access",
        label: "Access",
    },
    {
        key: "add",
        label: "Add",
    },
    {
        key: "edit",
        label: "Edit",
    },
    {
        key: "delete",
        label: "Delete",
    },
    {
        key: "import",
        label: "Import",
    },
    {
        key: "export",
        label: "Export",
    },
    {
        key: "mass_edit",
        label: "Mass Edit",
    },
    {
        key: "customize",
        label: "Customize",
    },
];

export const PERMISSION_MODULES = [
    {
        key: "dashboard",
        name: "Dashboard",
        path: "/dashboard",
        actions: [
            "access",
            "customize",
        ],
    },

    {
        key: "leads",
        name: "Leads",
        path: "/leads",
        actions: [
            "access",
            "add",
            "edit",
            "delete",
            "import",
            "export",
            "mass_edit",
            "customize",
        ],
    },

    {
        key: "clients",
        name: "Clients",
        path: "/clients",
        actions: [
            "access",
            "add",
            "edit",
            "delete",
            "import",
            "export",
            "mass_edit",
            "customize",
        ],
    },

    {
        key: "profile",
        name: "Profile",
        path: "/profile",
        actions: [
            "access",
            "edit",
        ],
    },

    {
        key: "call_logs",
        name: "Call Logs",
        path: "/call-logs",
        actions: [
            "access",
            "export",
        ],
    },

    {
        key: "tasks",
        name: "Tasks",
        path: "/tasks",
        actions: [
            "access",
            "add",
            "edit",
            "delete",
            "mass_edit",
        ],
    },

    {
        key: "reports",
        name: "Reports",
        path: "/reports",
        actions: [
            "access",
            "export",
            "customize",
        ],
    },

    {
        key: "organization_settings",
        name: "Organization Settings",
        path: "/organization-settings",
        actions: [
            "access",
            "edit",
        ],
    },

    {
        key: "team_management",
        name: "Team Management",
        path: "/team-management",
        actions: [
            "access",
            "add",
            "edit",
            "delete",
            "import",
            "export",
            "mass_edit",
        ],
    },

    {
        key: "integration",
        name: "Integration",
        path: "/integration",
        actions: [
            "access",
            "add",
            "edit",
            "delete",
        ],
    },

    {
        key: "settings",
        name: "Settings",
        path: "/settings",
        actions: [
            "access",
            "edit",
            "customize",
        ],
    },
];