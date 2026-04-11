import { UserRole } from "../utils/userRoles";

export class AdminRepository {
    async createUser(prisma: any, data: {
        firstName: string;
        lastName: string;
        email: string;
        password: string;
        role: UserRole;
    }) {
        return await prisma.user.create({
            data: {
                firstName: data.firstName,
                lastName: data.lastName,
                email: data.email,
                password: data.password,
                role: {
                    create: {
                        role: data.role
                    }
                }
            }
        });
    };

    async findByEmail(prisma: any, email: string) {
        return await prisma.user.findUnique({ where: { email } });
    };

    async findById(prisma: any, userId: string) {
        return await prisma.user.findUnique({ where: { id: userId } });
    };

    async findByRole(prisma: any, role: string) {
        return await prisma.user.findMany({
            where: {
                role: {
                    some: {
                        role: role
                    }
                }
            }
        })
    };

    async editRole(prisma: any, userId: string, role: UserRole) {
        return await prisma.user.update({
            where: { id: userId },
            data: {
                role: {
                    update: {
                        role: role
                    }
                }
            }
        })
    };

    async deleteUser(prisma: any, userId: string) {
        return await prisma.user.delete({ where: { id: userId } })
    }

    async editUser(prisma: any, userId: string, data: any) {
        return await prisma.user.update({
            where: { id: userId },
            data: data
        })
    };

    async detailUser(prisma: any, userId: string) {
        return await prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                phone: true,
                avatar: true,
                isActive: true,
                createdAt: true,
                updatedAt: true,
                role: { select: { role: true } }
            }
        })
    };

    async listUser(prisma: any, skip?: number, take?: number) {
        return await prisma.user.findMany({
            skip,
            take,
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                phone: true,
                avatar: true,
                isActive: true,
                createdAt: true,
                role: { select: { role: true } }
            },
            orderBy: { createdAt: "desc" }
        })
    };

    async listUserByRole(prisma: any, role: string, skip?: number, take?: number) {
        return await prisma.user.findMany({
            where: {
                role: {
                    some: {
                        role: role
                    }
                }
            },
            skip,
            take,
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                phone: true,
                avatar: true,
                isActive: true,
                createdAt: true,
                role: { select: { role: true } }
            },
            orderBy: { createdAt: "desc" }
        })
    };
    async countUsers(prisma: any) {
        return await prisma.user.count();
    }

}
