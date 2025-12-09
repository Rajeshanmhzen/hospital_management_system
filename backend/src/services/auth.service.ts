import { SuperAdminRepository } from "../repository/superAdmin.repository";
import { TenantRepository } from "../repository/tenant.repository";
import { generateTokens } from "../utils/jwt.util";
import { comparePassword } from "../utils/password.util";
import { PrismaClient } from '../../node_modules/.prisma/tenant-client';

export class AuthService {
    private superAdminRepo = new SuperAdminRepository();
    private tenantRepo = new TenantRepository();

    async login(data: { email: string; password: string; userType?: string; tenantId?: string }) {
        const { email, password, userType, tenantId } = data;
        
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
                }
            }
        }

        // Tenant user authentication
        if (userType && ['TENANT_ADMIN', 'DOCTOR', 'NURSE', 'RECEPTIONIST', 'PATIENT'].includes(userType)) {
            if (!tenantId) {
                throw new Error("Tenant ID required for tenant users");
            }

            // Get tenant info to construct database URL
            const tenant = await this.tenantRepo.findTenantById(tenantId);
            if (!tenant) {
                throw new Error("Invalid tenant");
            }

            // Connect to tenant database
            const tenantPrisma = new PrismaClient({
                datasources: {
                    db: {
                        url: `${process.env.TENANT_DATABASE_URL}_${tenantId}`
                    }
                }
            });

            try {
                const user = await tenantPrisma.user.findUnique({
                    where: { email }
                });

                if (user && user.isActive) {
                    const isMatch = await comparePassword(password, user.password);
                    if (isMatch) {
                        const payload = {
                            id: user.id,
                            email: user.email,
                            role: user.role,
                            tenantId: tenantId
                        };
                        const token = await generateTokens(payload);
                        return { user: payload, token };
                    }
                }
            } finally {
                await tenantPrisma.$disconnect();
            }
        }

        throw new Error("Invalid credentials");
    };
};