import { createTenantDatabase, migrateTenantDatabase } from "../modules/tenant/tenant.provision";
import { TenantRepository } from "../repository/tenant.repository";
import { hashPassword } from "../utils/password.util";
import { getTenantPrismaClient } from "../config/tenant-prisma-manager";
import { UserRole } from "../utils/userRoles";

function sanitizeDbName(subdomain: string): string {
  return subdomain
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "_")
    .replace(/_{2,}/g, "_")
    .replace(/^_|_$/g, "");
}

export interface TenantOnboardingInput {
  name: string;
  subdomain: string;
  ownerName: string;
  ownerEmail: string;
  password?: string;
  planId?: string;
  billingCycle?: string;
}

export interface TenantProvisionProgress {
  percent: number;
  stage: string;
}

export class TenantOnboardingService {
  private tenantRepo = new TenantRepository();

  async onboardTenant(
    tenantData: TenantOnboardingInput,
    onProgress?: (progress: TenantProvisionProgress) => Promise<void> | void
  ) {
    const { name, subdomain, ownerName, ownerEmail, password } = tenantData;
    await onProgress?.({ percent: 5, stage: "Validating tenant input" });

    const existingByEmail = await this.tenantRepo.detailTenantByEmail(ownerEmail);
    if (existingByEmail) throw new Error("Tenant already exists!");

    const existingBySubdomain = await this.tenantRepo.detailTenantBySubdomain(subdomain);
    if (existingBySubdomain) throw new Error("Subdomain already exists!");

    const dbName = `medflow_tenant_${sanitizeDbName(subdomain)}`;
    const tenantDbUrl = `postgresql://postgres:MakeYourOwn%40123%23@localhost:5432/${dbName}`;

    await onProgress?.({ percent: 20, stage: "Creating tenant database" });
    await createTenantDatabase(dbName);
    await onProgress?.({ percent: 45, stage: "Running tenant migrations" });
    await migrateTenantDatabase(tenantDbUrl);

    await onProgress?.({ percent: 65, stage: "Creating tenant record" });
    const tenant = await this.tenantRepo.addTenant({
      name,
      subdomain,
      ownerName,
      ownerEmail,
      dbUrl: tenantDbUrl,
    });

    const tenantPrisma = getTenantPrismaClient(tenantDbUrl) as any;
    const hashedPassword = await hashPassword(password || "TempPassword@123");
    const nameParts = ownerName.trim().split(/\s+/);
    const firstName = nameParts[0] || "Admin";
    const lastName = nameParts.slice(1).join(" ") || "User";

    await onProgress?.({ percent: 80, stage: "Creating tenant admin user" });
    await tenantPrisma.user.create({
      data: {
        email: ownerEmail,
        password: hashedPassword,
        firstName,
        lastName,
        role: {
          create: {
            role: UserRole.ADMIN,
          },
        },
      },
    });

    await tenantPrisma.hospitalProfile.create({
      data: {
        name,
        email: ownerEmail,
      },
    });

    if (tenantData.planId) {
      await onProgress?.({ percent: 92, stage: "Assigning subscription plan" });
      const { SubscriptionService } = await import("./subscription.service");
      const subService = new SubscriptionService();
      await subService.createSubscription({
        tenantId: tenant.id,
        planId: tenantData.planId,
        billingCycle: tenantData.billingCycle || "MONTHLY",
      });
    }

    await onProgress?.({ percent: 100, stage: "Tenant provisioning complete" });
    return tenant;
  }
}
