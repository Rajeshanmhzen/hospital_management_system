import { PaymentService } from "@/services/payment.service";
import { PaymentStatus } from "@prisma/master-client";
import { Request, Response } from "express";
import { asyncHandler } from "@/utils/asyncHandler.utils";

export class PaymentController {
    private paymentService = new PaymentService();

    handleKhaltiCallback = asyncHandler(async (req: Request, res: Response) => {
        const { pidx, transactionId, status } = req.body;
        const paymentStatus = status === 'completed' ? PaymentStatus.COMPLETED : PaymentStatus.FAILED;
        await this.paymentService.verifyPayment(pidx, transactionId, paymentStatus, req.body);
        return res.status(200).json({ message: "Payment processed successfully" });
    });

    handleStripWebhook = asyncHandler(async (req: Request, res: Response) => {
        const sig = req.headers['stripe-signature'];
        let event;
        // try {
        //     event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
        // } catch (err:any) {
        //     return res.status(400).send(`Webhook Error: ${err.message}`);
        // }
    });
}