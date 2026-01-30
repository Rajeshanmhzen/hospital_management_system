import masterPrisma from '../config/master-prisma';


export class TenantRepository {
    async addTenant(payload: any) {
        return await masterPrisma.tenant.create({ data: payload });
    };

    async detailTenantByEmail(email: string) {
        return await masterPrisma.tenant.findFirst({ where: { ownerEmail: email } });
    };

    async detailTenant(id: string) {
        return await masterPrisma.tenant.findUnique({ where: { id } });
    };

    async detailTenantBySubdomain(subdomain: string) {
        return await masterPrisma.tenant.findUnique({ where: { subdomain } });
    };

    async editTenant(id: string, data: any) {
        return await masterPrisma.tenant.update({ where: { id }, data });
    };

    async deleteTenant(id: string) {
        return await masterPrisma.tenant.delete({ where: { id } });
    };

    async listTenant() {
        return await masterPrisma.tenant.findMany({
            include: {
                subscriptions: true
            }
        });
    };

};