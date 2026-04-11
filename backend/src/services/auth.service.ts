import { UserRole } from "../utils/userRoles";
import { comparePassword } from "../utils/password.util";
import { generateTokens, generateAccessToken, verifyRefreshToken } from "../utils/jwt.util";
import { SuperAdminRepository } from "../repository/superAdmin.repository";
import { TenantRepository } from "../repository/tenant.repository";
import { cache } from "../config/cache";
import { getTenantPrismaClient } from "../config/tenant-prisma-manager";

export class AuthService {
    private superAdminRepo = new SuperAdminRepository();
    private tenantRepo = new TenantRepository();

    async login(data: { email: string; password: string; userType?: string; tenantId?: string }) {
        const { email, password, tenantId } = data;

        // 1. Try SuperAdmin Login First (Auto-detect)
        const superAdmin = await this.superAdminRepo.findByEmail(email);
        if (superAdmin && superAdmin.isActive) {
            const isMatch = await comparePassword(password, superAdmin.password);
            if (isMatch) {
                return {
                    user: { id: superAdmin.id, email: superAdmin.email, role: "SUPER_ADMIN" },
                    token: await generateTokens({ id: superAdmin.id, email: superAdmin.email, role: "SUPER_ADMIN" })
                };
            }
        }

        // 2. If not SuperAdmin, proceed with Tenant User Login
        let targetTenantId = tenantId;
        let targetTenant: any = null;
        const emailTenantCacheKey = `login:tenant-email:${email.toLowerCase()}`;

        // If tenantId is provided, just check that specific tenant
        if (targetTenantId) {
            targetTenant = await this.tenantRepo.detailTenant(targetTenantId);
            if (!targetTenant) throw new Error("Invalid tenant");
        }
        // If no tenantId, search ALL tenants for this user (Fallback for Email-Only Login)
        else {
            const cachedTenantId = await cache.get(emailTenantCacheKey);
            if (cachedTenantId) {
                targetTenant = await this.tenantRepo.detailTenant(cachedTenantId);
                if (targetTenant) {
                    targetTenantId = targetTenant.id;
                }
            }

            if (!targetTenantId || !targetTenant) {
                const allTenants = await this.tenantRepo.listTenant();

                // Fallback scan, cached after first hit
                for (const tenant of allTenants) {
                    const tenantPrisma = getTenantPrismaClient(tenant.dbUrl);

                    try {
                        const user = await tenantPrisma.user.findUnique({ where: { email } });
                        if (user) {
                            targetTenant = tenant;
                            targetTenantId = tenant.id;
                            await cache.set(emailTenantCacheKey, tenant.id, 3600);
                            break;
                        }
                    } catch (err) {
                        // Ignore connection errors for individual tenants during search
                    }
                }
            }

            if (!targetTenant || !targetTenantId) {
                throw new Error("Invalid credentials");
            }
        }

        // 3. Proceed with Login on the identified Tenant
        const tenantPrisma = getTenantPrismaClient(targetTenant.dbUrl);

        try {
            const user = await tenantPrisma.user.findUnique({
                where: { email },
                include: { role: true },
            });

            if (user && user.isActive) {
                const isMatch = await comparePassword(password, user.password);
                if (isMatch) {
                    const userRole = (user.role as any)[0]?.role as UserRole;
                    const payload = { id: user.id, email: user.email, role: userRole, tenantId: targetTenantId };
                    const token = await generateTokens(payload);

                    // Store refresh token
                    await tenantPrisma.refreshToken.create({
                        data: {
                            userId: user.id,
                            token: token.refreshToken,
                        },
                    });

                    return { user: payload, token };
                }
            }
        } finally {
            // shared client, no per-request disconnect
        }

        throw new Error("Invalid credentials");
    }

    async logout(refreshToken: string, tenantId?: string) {
        if (!tenantId) return; // Super admin logout handled by clearing cookies in controller

        const tenant = await this.tenantRepo.detailTenant(tenantId);
        if (!tenant) return;

        const tenantPrisma = getTenantPrismaClient(tenant.dbUrl);

        try {
            await tenantPrisma.refreshToken.deleteMany({
                where: { token: refreshToken },
            });
        } finally {
            // shared client, no per-request disconnect
        }
    }

    async refreshAccessToken(refreshToken: string) {
        try {
            const decoded = verifyRefreshToken(refreshToken) as any;

            if (decoded.role === "SUPER_ADMIN") {
                const payload = { id: decoded.id, email: decoded.email, role: decoded.role };
                const newAccessToken = await generateAccessToken(payload);
                return { accessToken: newAccessToken, user: payload };
            }

            if (decoded.tenantId) {
                const tenant = await this.tenantRepo.detailTenant(decoded.tenantId);
                if (!tenant) throw new Error("Invalid tenant");

                const tenantPrisma = getTenantPrismaClient(tenant.dbUrl);

                try {
                    const storedToken = await tenantPrisma.refreshToken.findFirst({
                        where: {
                            userId: decoded.id,
                            token: refreshToken,
                        },
                    });

                    if (!storedToken) {
                        throw new Error("Invalid refresh token");
                    }

                    const payload = {
                        id: decoded.id,
                        email: decoded.email,
                        role: decoded.role,
                        tenantId: decoded.tenantId
                    };
                    const newAccessToken = await generateAccessToken(payload);
                    return { accessToken: newAccessToken, user: payload };
                } finally {
                    // shared client, no per-request disconnect
                }
            }

            throw new Error("Invalid token payload");
        } catch (error: any) {
            if (error.message.includes("jwt expired")) {
                throw new Error("Please login!");
            }
            throw error;
        }
    }
}
