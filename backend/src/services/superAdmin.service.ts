import { createTenantDatabase, dropTenantDatabase, migrateTenantDatabase } from "../modules/tenant/tenant.provision";
import { SuperAdminRepository } from "../repository/superAdmin.repository";
import { TenantRepository } from "../repository/tenant.repository";
import { hashPassword } from "../utils/password.util";
import { TenantPrismaClient } from "../../prisma/tenant/client";
import { UserRole } from "../utils/userRoles";

function santizeDbName(subdomain: string): string {
  return subdomain
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '_')
    .replace(/_{2,}/g, '_')
    .replace(/^_|_$/g, '');
};


export class SuperAdminService {
  private superAdminRepo = new SuperAdminRepository;
  private tenantrepo = new TenantRepository;

  async createSuperAdmin(data: {
    email: string;
    password: string;
    name: string;
  }) {
    const existing = await this.superAdminRepo.findByEmail(data.email);
    if (existing) throw new Error("Super admin already exists!");

    const hashedPassword = await hashPassword(data.password);
    return await this.superAdminRepo.createSuperAdmin({
      ...data,
      password: hashedPassword
    });
  };

  async deleteSuperAdmin(id: string) {
    const superAdmin = await this.superAdminRepo.findById(id);
    if (!superAdmin) throw new Error("Super admin not found!");
    return await this.superAdminRepo.deleteSuperAdmin(id);
  };

  async updateSuperAdmin(id: string, data: any) {
    const superAdmin = await this.superAdminRepo.findById(id);
    if (!superAdmin) throw new Error("Super admin not found!");
    return await this.superAdminRepo.updateSuperAdmin(id, data);
  };

  async createTenant(tenantData: {
    name: string;
    subdomain: string;
    ownerName: string;
    ownerEmail: string;
    password?: string;
  }) {
    const { name, subdomain, ownerName, ownerEmail, password } = tenantData;
    const existinguser = await this.tenantrepo.findByEmail(ownerEmail);
    if (existinguser) throw new Error("Tenant already exists!");

    const existingBySubdomain = await this.tenantrepo.findTenantBySubdomain(tenantData.subdomain);
    if (existingBySubdomain) throw new Error("Subdomain already exists!");

    const sanitizeName = santizeDbName(tenantData.subdomain);
    const dbName = `medflow_tenant_${sanitizeName}`;

    // Use regular connection string pattern - ensure password encoding if needed
    const tenantDbUrl = `postgresql://postgres:MakeYourOwn%40123%23@localhost:5432/${dbName}`;
    let dbCreated = false;

    try {
      await createTenantDatabase(dbName);
      dbCreated = true;

      await migrateTenantDatabase(tenantDbUrl);

      const payload = {
        name: name,
        subdomain: subdomain,
        ownerName: ownerName,
        ownerEmail: ownerEmail,
        dbUrl: tenantDbUrl
      };

      const tenant = await this.tenantrepo.createTenant(payload);

      // Create initial Admin user in the tenant database
      const tenantPrisma = new TenantPrismaClient({
        datasources: { db: { url: tenantDbUrl } },
      }) as any;

      try {
        const hashedPassword = await hashPassword(password || "TempPassword@123");

        const nameParts = ownerName.trim().split(/\s+/);
        const firstName = nameParts[0] || "Admin";
        const lastName = nameParts.slice(1).join(" ") || "User";

        await tenantPrisma.user.create({
          data: {
            email: ownerEmail,
            password: hashedPassword,
            firstName: firstName,
            lastName: lastName,
            role: {
              create: {
                role: UserRole.ADMIN
              }
            }
          }
        });

        // Seed Hospital Profile
        await tenantPrisma.hospitalProfile.create({
          data: {
            name: name,
            email: ownerEmail,
          }
        });
      } finally {
        await tenantPrisma.$disconnect();
      }

      return tenant;
    } catch (error) {
      if (dbCreated) {
        await dropTenantDatabase(dbName);
      }
      throw error;
    };
  };

  async updateTenant(id: string, data: any) {
    const tenant = await this.tenantrepo.findTenantById(id);
    if (!tenant) throw new Error("Tenant not found!");
    return await this.tenantrepo.updateTenant(id, data);
  };

  async deleteTenant(id: string) {
    const tenant = await this.tenantrepo.findTenantById(id);
    if (!tenant) throw new Error("Tenant not found!");

    // Extract dbName from dbUrl
    const dbUrlMatch = tenant.dbUrl.match(/\/([^/?]+)(?:\?|$)/);
    const dbName = dbUrlMatch ? dbUrlMatch[1] : null;

    if (dbName) {
      try {
        await dropTenantDatabase(dbName);
      } catch (error: any) {
        console.error(`Failed to drop database ${dbName}:`, error.message);
        throw error;
      }
    }

    return await this.tenantrepo.deleteTenant(id);
  };

  async getAllTenants() {
    return await this.tenantrepo.getAllTenants();
  };

  async getTenantById(id: string) {
    return await this.tenantrepo.findTenantById(id);
  };

  async getDashboardStats() {
    const totalTenants = await this.tenantrepo.getAllTenants();
    const activeTenants = totalTenants.filter(t => t.status === 'ACTIVE');
    const pendingTenants = totalTenants.filter(t => t.status === 'PENDING');

    // Aggregate subscription distribution
    const planCounts: Record<string, number> = {};
    totalTenants.forEach(tenant => {
      const planName = tenant.subscriptions?.planName || 'BASIC';
      planCounts[planName] = (planCounts[planName] || 0) + 1;
    });

    // Generate monthly growth data (last 6 months)
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const currentMonth = new Date().getMonth();
    const last6Months = [];
    for (let i = 5; i >= 0; i--) {
      const monthIdx = (currentMonth - i + 12) % 12;
      last6Months.push(months[monthIdx]);
    }

    // Mock distribution/revenue data based on real counts for now
    // In a real app, you'd aggregate this from the database
    const barChartData = last6Months.map(month => ({
      name: month,
      enterprise: Math.floor(activeTenants.length * 0.3),
      standard: Math.floor(activeTenants.length * 0.5),
      basic: Math.floor(activeTenants.length * 0.2),
    }));

    const areaChartData = last6Months.map((month, idx) => ({
      name: month,
      total: activeTenants.length * 1000 + (idx * 500),
      enterprise: activeTenants.length * 600 + (idx * 300),
    }));

    return {
      stats: {
        totalTenants: totalTenants.length,
        activeTenants: activeTenants.length,
        pendingTenants: pendingTenants.length,
        revenueGrowth: activeTenants.length * 150, // Simple mock
      },
      charts: {
        barChartData,
        areaChartData,
      }
    };
  };

};
