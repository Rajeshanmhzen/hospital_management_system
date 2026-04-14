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
        const where: any = {};
        const rawStatus = typeof query?.status === "string" ? query.status.toUpperCase() : "";
        const searchStatus = typeof query?.search === "string" ? query.search.trim().toUpperCase() : "";

        const rawSearch = typeof query?.search === "string" ? query.search.trim() : "";
        if (rawSearch) {
            const searchOr: any[] = [
                { planName: { contains: rawSearch, mode: "insensitive" } },
                { billingCycle: { contains: rawSearch, mode: "insensitive" } },
                { tenantId: { contains: rawSearch, mode: "insensitive" } },
                { tenant: { is: { name: { contains: rawSearch, mode: "insensitive" } } } },
                { tenant: { is: { subdomain: { contains: rawSearch, mode: "insensitive" } } } },
            ];

            if (Object.values(SubscriptionStatus).includes(searchStatus as SubscriptionStatus)) {
                searchOr.push({ status: { equals: searchStatus as SubscriptionStatus } });
            }

            where.OR = [
                ...searchOr,
            ];
        }

        if (rawStatus && Object.values(SubscriptionStatus).includes(rawStatus as SubscriptionStatus)) {
            where.status = rawStatus as SubscriptionStatus;
        }

        const sortableFields = ["planName", "planPrice", "billingCycle", "status", "startDate", "endDate", "createdAt"];
        const rawSortBy = typeof query?.sortBy === "string" ? query.sortBy : "createdAt";
        const rawSortOrder = typeof query?.sortOrder === "string" ? query.sortOrder.toLowerCase() : "desc";
        const sortBy = sortableFields.includes(rawSortBy) ? rawSortBy : "createdAt";
        const sortOrder = rawSortOrder === "asc" ? "asc" : "desc";
        const orderBy = { [sortBy]: sortOrder };

        const data = await this.subscriptionRepo.listSubscription(skip, take, where, orderBy);
        const totalCount = await this.subscriptionRepo.countSubscription(where);

        return { data, meta: getPaginationMeta(totalCount, page, limit) };
    };

};