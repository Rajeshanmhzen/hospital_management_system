import { UserRole } from "../../../../shared/types/role";


const SUPER_ADMIN_DASHBOARD_URL = "http://localhost:3001";
const TENANT_DASHBOARD_URL = "http://localhost:3002";

export const getRoleBasedDashboardUrl = (role: UserRole): string => {
    if (role === UserRole.SUPER_ADMIN) {
        return SUPER_ADMIN_DASHBOARD_URL;
    }
    return TENANT_DASHBOARD_URL;
};

export const navigateToDashboard = (role: UserRole): void => {
    const url = getRoleBasedDashboardUrl(role);
    window.location.href = url;
};
