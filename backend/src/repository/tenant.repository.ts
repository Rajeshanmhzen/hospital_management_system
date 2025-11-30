import masterPrisma from '../config/master-prisma';


export class TenantRepository {
    async createTenant(payload:any){
    return await masterPrisma.tenant.create({data: payload});
    };
    
    async findByEmail(email:string){
        return await masterPrisma.tenant.findFirst({where:{ownerEmail: email}});
    };

    async findTenantById(id:string){
    return await masterPrisma.tenant.findUnique({where:{id}});
    };

    async findTenantBySubdomain(subdomain:string){
    return await masterPrisma.tenant.findUnique({where:{subdomain}});
    };

    async updateTenant(id:string, data:any) {
    return await masterPrisma.tenant.update({where:{id}, data});
    };

    async deleteTenant(id:string) {
    return await masterPrisma.tenant.delete({where:{id}});
    };

    async getAllTenants() {
    return await masterPrisma.tenant.findMany();
    };

};