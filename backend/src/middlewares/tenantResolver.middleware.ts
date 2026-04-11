import { Request, Response, NextFunction } from "express";
import { TenantRepository } from "../repository/tenant.repository";
import { getTenantPrismaClient } from "../config/tenant-prisma-manager";
import { cache } from "../config/cache";

const tenantRepo = new TenantRepository();

export const tenantResolverMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const tenantId = req.user?.tenantId || req.headers["x-tenant-id"];

        if (!tenantId) {
            return res.status(400).json({
                success: false,
                message: "Tenant identification missing"
            });
        }

        const tenantCacheKey = `tenant:${tenantId}`;
        const cachedTenant = await cache.get(tenantCacheKey);
        const tenant = cachedTenant
            ? JSON.parse(cachedTenant)
            : await tenantRepo.detailTenant(tenantId as string);

        if (!tenant) {
            return res.status(404).json({
                success: false,
                message: "Tenant not found"
            });
        }

        if (tenant.status !== 'ACTIVE') {
            return res.status(403).json({
                success: false,
                message: `Tenant account is ${tenant.status}. Please contact support.`
            });
        }

        if (!cachedTenant) {
            await cache.set(tenantCacheKey, JSON.stringify(tenant), 120);
        }

        const prisma = getTenantPrismaClient(tenant.dbUrl) as any;

        req.prisma = prisma;
        req.tenantId = tenantId as string;

        next();
    } catch (error) {
        console.error("Tenant Resolution Error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error during tenant validation"
        });
    }
};
