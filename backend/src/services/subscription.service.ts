import { PricingPlanRepository } from "@/repository/pricingPlan.repository";
import { SubscriptionRepository } from "@/repository/subscription.repository";
import { getPaginationMeta, getPaginationParams } from "@/utils/pagination.util";
import { SubscriptionStatus } from "@/utils/subscription.utils";

export class SubscriptionService {
    private subscriptionRepo = new SubscriptionRepository();
    private planRepo = new PricingPlanRepository();

    async createSubscription(
        data: {
            tenantId: string;
            planId: string;
            billingCycle: string;
        }
    ) {
        const { planId, tenantId, billingCycle } = data;

        const plan = await this.planRepo.detailPricingPlan(planId);
        if (!plan) {
            throw new Error("Pricing plan not found");
        };

        const startDate = new Date();
        const endDate = new Date();
        if (billingCycle === 'YEARLY') {
            endDate.setFullYear(startDate.getFullYear() + 1);
        } else {
            endDate.setMonth(startDate.getMonth() + 1);
        };
        const payload = {
            tenantId,
            planId,
            planName: plan.name,
            planPrice: Number(billingCycle === 'YEARLY' ? plan.yearlyPrice : plan.monthlyPrice),
            billingCycle,
            status: SubscriptionStatus.ACTIVE,
            maxUsers: plan.maxUsers,
            maxPatients: plan.maxPatients,
            features: plan.features as string[],
            startDate,
            endDate
        };
        return await this.subscriptionRepo.addSubscription(payload);
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
        return await this.subscriptionRepo.editSubscription(id, data);
    };

    async deleteSubscription(id: string) {
        const subscription = await this.subscriptionRepo.findSubscriptionById(id);
        if (!subscription) {
            throw new Error("Subscription not found");
        };
        const deleteSubscription = await this.subscriptionRepo.deleteSubscription(id);
        return deleteSubscription;
    };

    async detailSubscription(id: string) {
        const subscription = await this.subscriptionRepo.findSubscriptionById(id);
        if (!subscription) {
            throw new Error("Subscription not found");
        };
        return subscription;
    };

    async listSubscription(query: any) {
        const { skip, take, page, limit } = getPaginationParams(query);
        const data = await this.subscriptionRepo.listSubscription(skip, take);
        const totalCount = await this.subscriptionRepo.countSubscription();

        return { data, meta: getPaginationMeta(totalCount, page, limit) };
    };

};