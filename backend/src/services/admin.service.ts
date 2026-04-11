import { AdminRepository } from "@/repository/admin.repository";
import { getPaginationParams, getPaginationMeta } from "@/utils/pagination.util";
import { UserRole } from "@/utils/userRoles";
import { hashPassword } from "@/utils/password.util";

export class adminService {
    private adminRepo = new AdminRepository();

    async createUser(prisma: any, data: {
        firstName: string;
        lastName: string;
        email: string;
        password: string;
        role: UserRole;
    }) {
        const existingUser = await this.adminRepo.findByEmail(prisma, data.email);
        if (existingUser) {
            throw new Error("User already exists");
        }
        data.password = await hashPassword(data.password);
        return await this.adminRepo.createUser(prisma, data);
    };

    async editUser(prisma: any, userId: string, data: any) {
        const existingUser = await this.adminRepo.findById(prisma, userId);
        if (!existingUser) throw new Error("User not Found");
        if (data.password) {
            data.password = await hashPassword(data.password);
        }
        return await this.adminRepo.editUser(prisma, userId, data);
    };

    async editRole(prisma: any, userId: string, role: UserRole) {
        const existingUser = await this.adminRepo.findById(prisma, userId);
        if (!existingUser) throw new Error("User not Found!");
        return await this.adminRepo.editRole(prisma, userId, role);
    };

    async deleteUser(prisma: any, userId: string) {
        const existingUser = await this.adminRepo.findById(prisma, userId);
        if (!existingUser) throw new Error("User is not Found");
        return await this.adminRepo.deleteUser(prisma, userId);
    };

    async detailUser(prisma: any, userId: string) {
        const existingUser = await this.adminRepo.findById(prisma, userId);
        if (!existingUser) throw new Error("User is not Found");
        return await this.adminRepo.detailUser(prisma, userId);
    };

    async listUser(prisma: any, query: any) {
        const { skip, take, page, limit } = getPaginationParams(query);
        const data = await this.adminRepo.listUser(prisma, skip, take);
        const totalCount = await this.adminRepo.countUsers(prisma);
        const meta = getPaginationMeta(totalCount, page, limit);
        return { data, meta };
    };

    async listUserByRole(prisma: any, role: UserRole) {
        return await this.adminRepo.listUserByRole(prisma, role);
    };

    async countUsers(prisma: any) {
        return await this.adminRepo.countUsers(prisma);
    };
}
