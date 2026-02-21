import { SubscriptionService } from "@/services/subscription.service";
import { sendError, sendSuccess } from "@/utils/apiResponse.util";
import { Request, Response } from "express";
import { asyncHandler } from "@/utils/asyncHandler.utils";

export class SubscriptionController {
    private subscriptionService = new SubscriptionService();

    addSubscription = asyncHandler(async (req: Request, res: Response) => {
        const result = await this.subscriptionService.createSubscription(req.body);
        return sendSuccess(res, "Subscription created successfully", result, 201);
    });

    editSubscription = asyncHandler(async (req: Request, res: Response) => {
        const result = await this.subscriptionService.editSubscription(req.params.id, req.body);
        return sendSuccess(res, "Subscription edited successfully", result, 200);
    });

    deleteSubscription = asyncHandler(async (req: Request, res: Response) => {
        const id = req.params.id;
        if (!id) {
            return sendError(res, "Id is required", 400);
        };
        const result = await this.subscriptionService.deleteSubscription(id);
        return sendSuccess(res, "Subscription deleted successfully", result, 200);
    });

    detailSubscription = asyncHandler(async (req: Request, res: Response) => {
        const id = req.params.id;
        if (!id) {
            return sendError(res, "Id is required", 400);
        };
        const result = await this.subscriptionService.detailSubscription(id);
        return sendSuccess(res, "Subscription detailed successfully", result, 200);
    });

    listSubscription = asyncHandler(async (req: Request, res: Response) => {
        const result = await this.subscriptionService.listSubscription(req.query);
        return sendSuccess(res, "Subscriptions listed successfully", result.data, 200, result.meta);
    });

};