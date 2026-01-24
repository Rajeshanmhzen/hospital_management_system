import { UserRole } from "../../../../shared/types/role";

export { UserRole };

export interface User {
    id: string;
    email: string;
    name: string;
    role: UserRole;
    tenantId?: string;
}

export interface AuthTokens {
    accessToken: string;
    refreshToken: string;
}

export interface LoginResponse {
    success: boolean;
    message: string;
    data: {
        user: User;
        token: AuthTokens;
    };
}

export interface ApiError {
    success: false;
    message: string;
}
