import { TenantPrismaClient } from "../../prisma/tenant/client";
import { UserRole } from "../utils/userRoles";
import { comparePassword } from "../utils/password.util";
import { generateTokens, generateAccessToken, verifyRefreshToken } from "../utils/jwt.util";
import { SuperAdminRepository } from "../repository/superAdmin.repository";
import { TenantRepository } from "../repository/tenant.repository";

export class AuthService {
  private superAdminRepo = new SuperAdminRepository();
  private tenantRepo = new TenantRepository();

  async login(data: { email: string; password: string; userType?: string; tenantId?: string }) {
    const { email, password, userType, tenantId } = data;

    // SuperAdmin login
    if (!userType || userType === "SUPER_ADMIN") {
      const superAdmin = await this.superAdminRepo.findByEmail(email);
      if (superAdmin && superAdmin.isActive) {
        const isMatch = await comparePassword(password, superAdmin.password);
        if (isMatch) {
          const payload = { id: superAdmin.id, email: superAdmin.email, role: "SUPER_ADMIN" };
          const token = await generateTokens(payload);
          return { user: payload, token };
        }
      }
    }

    // Tenant user login
    if (userType && Object.values(UserRole).includes(userType as UserRole)) {
      if (!tenantId) throw new Error("Tenant ID required for tenant users");

      const tenant = await this.tenantRepo.findTenantById(tenantId);
      if (!tenant) throw new Error("Invalid tenant");

      const tenantPrisma = new TenantPrismaClient({
        datasources: { db: { url: tenant.dbUrl } },
      });

      try {
        const user = await tenantPrisma.user.findUnique({
          where: { email },
          include: { role: true },
        });

        if (user && user.isActive) {
          const isMatch = await comparePassword(password, user.password);
          if (isMatch) {
            const userRole = user.role[0]?.role as UserRole;
            const payload = { id: user.id, email: user.email, role: userRole, tenantId };
            const token = await generateTokens(payload);

            // Store refresh token in database for tenant users
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
        await tenantPrisma.$disconnect();
      }
    }

    throw new Error("Invalid credentials");
  }

  async refreshAccessToken(refreshToken: string) {
    try {
      // Verify the refresh token
      const decoded = verifyRefreshToken(refreshToken) as any;

      // For super admin (no tenantId in payload)
      if (decoded.role === "SUPER_ADMIN") {
        const payload = { id: decoded.id, email: decoded.email, role: decoded.role };
        const newAccessToken = await generateAccessToken(payload);
        return { accessToken: newAccessToken, user: payload };
      }

      // For tenant users - verify token exists in database
      if (decoded.tenantId) {
        const tenant = await this.tenantRepo.findTenantById(decoded.tenantId);
        if (!tenant) throw new Error("Invalid tenant");

        const tenantPrisma = new TenantPrismaClient({
          datasources: { db: { url: tenant.dbUrl } },
        });

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
          await tenantPrisma.$disconnect();
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
