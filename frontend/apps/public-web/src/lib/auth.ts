import { api } from "./api";
import { User, LoginResponse, UserRole } from "../types/types";

const USER_STORAGE_KEY = "medflow_user";

export const authService = {
    login: async (email: string, password: string, userType: UserRole, tenantId?: string) => {
        const response = await api.post<LoginResponse>("/auth/login", {
            email,
            password,
            userType,
            tenantId,
        });
        return response.data;
    },

    logout: async () => {
        try {
            await api.get("/auth/logout");
        } finally {
            localStorage.removeItem(USER_STORAGE_KEY);
        }
    },

    setUser: (user: User) => {
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
    },

    getUser: (): User | null => {
        const userStr = localStorage.getItem(USER_STORAGE_KEY);
        if (!userStr) return null;
        try {
            return JSON.parse(userStr);
        } catch {
            return null;
        }
    },

    clearUser: () => {
        localStorage.removeItem(USER_STORAGE_KEY);
    },
};
