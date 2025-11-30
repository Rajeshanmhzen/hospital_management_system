import { SuperAdminRepository } from "../repository/superAdmin.repository";
import { TenantRepository } from "../repository/tenant.repository";
import { hashPassword } from "../utils/password.util";

function santizeDbName(subdomain:string):string{
  return subdomain
  .toLowerCase()
  .replace(/[^a-z0-9]/g, '_')
  .replace(/_{2,}/g, '_')
  .replace(/^_|_$/g, '');
};


export class SuperAdminService {
    private superAdminRepo = new SuperAdminRepository;
    private tenantrepo = new TenantRepository;
 
  async createSuperAdmin(data:{
    email:string;
    password:string;
    name:string;
  } ) {
    const existing = await this.superAdminRepo.findByEmail(data.email);
    if(existing) throw new Error("Super admin already exists!");

    const hashedPassword = await hashPassword(data.password);
    return await this.superAdminRepo.createSuperAdmin({
        ...data,
        password:hashedPassword
    });
  };

  async deleteSuperAdmin(id:string){
    const superAdmin = await this.superAdminRepo.findById(id);
    if(!superAdmin) throw new Error("Super admin not found!");
    return await this.superAdminRepo.deleteSuperAdmin(id);
  };

  async updateSuperAdmin(id:string, data:any){
    const superAdmin = await this.superAdminRepo.findById(id);
    if(!superAdmin) throw new Error("Super admin not found!");
    return await this.superAdminRepo.updateSuperAdmin(id, data);
  };

  async createTenant(tenantData:{
      name:string;
      subdomain:string;
      ownerName:string;
      ownerEmail:string;
    }){
      const existinguser = await this.tenantrepo.findByEmail(tenantData.ownerEmail);
      if(existinguser) throw new Error("Tenant already exists!");

      const existingBySubdomain = await this.tenantrepo.findTenantBySubdomain(tenantData.subdomain);
      if(existingBySubdomain) throw new Error("Subdomain already exists!");

      const sanitizeName = santizeDbName(tenantData.subdomain);
      const dbName = `medFlow-tenant-${sanitizeName}`;
  
      const payload = {
        name:tenantData.name,
        subdomain:tenantData.subdomain,
        ownerName:tenantData.ownerName,
        ownerEmail:tenantData.ownerEmail,
        dbName:dbName
      };
  
      const tenant = await this.tenantrepo.createTenant(payload);
      return tenant;
  };

  async updateTenant(id:string, data:any){
    const tenant = await this.tenantrepo.findTenantById(id);
    if(!tenant) throw new Error("Tenant not found!");
    return await this.tenantrepo.updateTenant(id, data);
  };

  async deleteTenant(id:string){
    const tenant = await this.tenantrepo.findTenantById(id);
    if(!tenant) throw new Error("Tenant not found!");
    return await this.tenantrepo.deleteTenant(id);
  };

  async getAllTenants(){
    return await this.tenantrepo.getAllTenants();
  };

};
