import { PricingPlanRepository } from "../repository/pricingPlan.repository";

export class PricingPlanService {
    private pricingPlanRepo = new PricingPlanRepository();

    async listPublicPricingPlan() {
        return await this.pricingPlanRepo.listPublicPricingPlan();
    }

    async detailPricingPlan(id: string) {
        return await this.pricingPlanRepo.detailPricingPlan(id);
    }

    async addPricingPlan(data: any) {
        return await this.pricingPlanRepo.addPricingPlan(data);
    }

    async editPricingPlan(id: string, data: any) {
        return await this.pricingPlanRepo.editPricingPlan(id, data);
    }

    async deletePricingPlan(id: string) {
        return await this.pricingPlanRepo.deletePricingPlan(id);
    }

    async listPricingPlan() {
        return await this.pricingPlanRepo.listPricingPlan();
    }
}
