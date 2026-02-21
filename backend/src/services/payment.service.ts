import { PaymentRepository } from "@/repository/payment.repository";
import { getPaginationMeta, getPaginationParams } from "@/utils/pagination.util";
import { PaymentGateway, PaymentStatus } from "@prisma/master-client";


export class PaymentService {
    private paymentRepo = new PaymentRepository;
    async initiatePayment(data: {
        subscriptionId: string;
        amount: number;
        currency: string;
        gateway: PaymentGateway;
        gatewayReference: string;
        metadata?: any;
    }) {
        return await this.paymentRepo.createPayment({
            ...data,
            status: PaymentStatus.PENDING
        });
    };

    async verifyPayment(gatewayReference: string, transactionId: string, status: PaymentStatus, metadata?: any) {
        const payment = await this.paymentRepo.findPaymentByReference(gatewayReference);
        if (!payment) throw new Error("Payment not found!");

        return await this.paymentRepo.updatePayment(payment.id, {
            status,
            transactionId,
            metadata,
            paidAt: status === PaymentStatus.COMPLETED ? new Date() : undefined,
            failureReason: status === PaymentStatus.FAILED ? "Payment failed" : undefined
        });
    };

    async listPayments(query: any) {
        const { skip, take, page, limit } = getPaginationParams(query);
        const data = await this.paymentRepo.listAllPayments(skip, take);
        const totalCount = await this.paymentRepo.countAllPayments();

        return {
            data,
            meta: getPaginationMeta(totalCount, page, limit)
        };
    };
};