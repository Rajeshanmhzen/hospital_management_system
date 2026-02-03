import masterPrisma from "@/config/master-prisma"
import { SubscriptionStatus } from "@/utils/subscription.utils";

export class SubscriptionRepository {
    async findSubscriptionById(id: string) {
        return await masterPrisma.subscription.findUnique({ where: { id } });
    };

    async addSubscription(data: {
        tenantId: string;
        planId: string;
        planName: string;
        planPrice: number;
        billingCycle: string;
        status: SubscriptionStatus;
        maxUsers: number;
        maxPatients: number;
        features: string[];
        startDate: Date;
        endDate: Date;
    }) {
        return await masterPrisma.subscription.create({ data });
    };

    async editSubscription(id: string, data: {
        tenantId?: string;
        planId?: string;
        planName?: string;
        planPrice?: number;
        billingCycle?: string;
        status?: SubscriptionStatus;
        maxUsers?: number;
        maxPatients?: number;
        features?: string[];
        startDate?: Date;
        endDate?: Date;
    }) {
        return await masterPrisma.subscription.update({ where: { id }, data });
    };

    async deleteSubscription(id: string) {
        return await masterPrisma.subscription.delete({ where: { id } });
    };

    async listSubscription(skip?: number, take?: number) {
        return await masterPrisma.subscription.findMany({ skip, take });
    };

    async countSubscription() {
        return await masterPrisma.subscription.count();
    };
}