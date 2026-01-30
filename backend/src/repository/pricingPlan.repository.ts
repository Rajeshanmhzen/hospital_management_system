import masterPrisma from '../config/master-prisma';
import { PricingPlan } from '@prisma/master-client';

export class PricingPlanRepository {
    async addPricingPlan(data: Omit<PricingPlan, 'id' | 'createdAt' | 'updatedAt' | 'subscriptions'>) {
        return await masterPrisma.pricingPlan.create({ data: data as any });
    }

    async findMany(where: any = {}) {
        return await masterPrisma.pricingPlan.findMany({
            where,
            orderBy: { displayOrder: 'asc' },
        });
    }

    async listPricingPlan() {
        return this.findMany();
    }

    async listPublicPricingPlan() {
        return this.findMany({
            isActive: true,
            isPublic: true
        });
    }

    async detailPricingPlan(id: string) {
        return await masterPrisma.pricingPlan.findUnique({ where: { id } });
    }

    async findByName(name: string) {
        return await masterPrisma.pricingPlan.findUnique({ where: { name } });
    }

    async editPricingPlan(id: string, data: Partial<PricingPlan>) {
        return await masterPrisma.pricingPlan.update({ where: { id }, data: data as any });
    }

    async deletePricingPlan(id: string) {
        return await masterPrisma.pricingPlan.delete({ where: { id } });
    }
}