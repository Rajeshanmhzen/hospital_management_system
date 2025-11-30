import { SuperAdminRepository } from "../repository/superAdmin.repository";
import { generateTokens } from "../utils/jwt.util";
import { comparePassword } from "../utils/password.util";

export class AuthService {
    private superAdminRepo = new SuperAdminRepository();

    async login(data: { email: string; password: string; userType?: string }) {
        const { email, password, userType } = data;
        
        // Try SuperAdmin first (or if userType specified)
        if (!userType || userType === 'SUPER_ADMIN') {
                const superAdmin = await this.superAdminRepo.findByEmail(email);
                if (superAdmin && superAdmin.isActive) {
                    const isMatch = await comparePassword(password, superAdmin.password);
                    if (isMatch) {
                        const payload = {
                            id: superAdmin.id,
                            email: superAdmin.email,
                            role: 'SUPER_ADMIN'
                        };
                        const token = await generateTokens(payload);
                        return { user: payload, token };
                    };
                }
            
        }

        // if (!userType || userType === 'TENANT_ADMIN' || userType === 'DOCTOR' || userType === 'NURSE') {
        //     // Try tenant database authentication
        // }

        throw new Error("Invalid credentials");
    }
}