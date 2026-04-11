import { PricingPlanRepository } from "../repository/pricingPlan.repository";
import { cache } from "../config/cache";

export class PricingPlanService {
    private pricingPlanRepo = new PricingPlanRepository();

    async listPublicPricingPlan() {
        const key = "pricing:public:list";
        const cached = await cache.get(key);
        if (cached) return JSON.parse(cached);
        const data = await this.pricingPlanRepo.listPublicPricingPlan();
        await cache.set(key, JSON.stringify(data), 300);
        return data;
    }

    async detailPricingPlan(id: string) {
        return await this.pricingPlanRepo.detailPricingPlan(id);
    }

    async addPricingPlan(data: any) {
        const result = await this.pricingPlanRepo.addPricingPlan(data);
        await cache.del("pricing:public:list");
        await cache.del("pricing:admin:list");
        return result;
    }

    async editPricingPlan(id: string, data: any) {
        const result = await this.pricingPlanRepo.editPricingPlan(id, data);
        await cache.del("pricing:public:list");
        await cache.del("pricing:admin:list");
        return result;
    }

    async deletePricingPlan(id: string) {
        const result = await this.pricingPlanRepo.deletePricingPlan(id);
        await cache.del("pricing:public:list");
        await cache.del("pricing:admin:list");
        return result;
    }

    async listPricingPlan() {
        const key = "pricing:admin:list";
        const cached = await cache.get(key);
        if (cached) return JSON.parse(cached);
        const data = await this.pricingPlanRepo.listPricingPlan();
        await cache.set(key, JSON.stringify(data), 120);
        return data;
    }
}
