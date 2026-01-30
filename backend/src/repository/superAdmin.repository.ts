import masterPrisma from '../config/master-prisma';

export class SuperAdminRepository {
   async addSuperAdmin(data: {
      email: string;
      password: string;
      name: string;
   }) {
      return await masterPrisma.superAdmin.create({ data });
   };

   async findByEmail(email: string) {
      return await masterPrisma.superAdmin.findUnique({ where: { email } });
   };

   async detailSuperAdmin(id: string) {
      return await masterPrisma.superAdmin.findUnique({ where: { id } });
   };

   async editSuperAdmin(id: string, data: any) {
      return await masterPrisma.superAdmin.update({ where: { id }, data });
   };

   async deleteSuperAdmin(id: string) {
      return await masterPrisma.superAdmin.delete({ where: { id } });
   };

};