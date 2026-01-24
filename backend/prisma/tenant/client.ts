import { PrismaClient as TenantPrismaClientOriginal } from "../../node_modules/.prisma/tenant-client";

declare global {
  var tenantPrisma: TenantPrismaClientOriginal | undefined;
}

export const tenantPrisma =
  global.tenantPrisma ?? new TenantPrismaClientOriginal({ log: ["error", "warn"] });

if (process.env.NODE_ENV !== "production") {
  global.tenantPrisma = tenantPrisma;
}

export const TenantPrismaClient = TenantPrismaClientOriginal;