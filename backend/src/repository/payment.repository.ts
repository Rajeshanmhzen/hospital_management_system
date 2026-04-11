import masterPrisma from "@/config/master-prisma";
import { PaymentGateway, PaymentStatus, Prisma } from "@prisma/master-client";

export class PaymentRepository {
    async createPayment(data: {
        subscriptionId: string;
        amount: number;
        currency: string;
        status: PaymentStatus;
        gateway: PaymentGateway;
        gatewayReference?: string;
        metadata?: any;
    }) {
        return await masterPrisma.payment.create({
            data: {
                ...data,
                amount: new Prisma.Decimal(data.amount),
                metadata: data.metadata || Prisma.JsonNull
            }
        });
    };

    async findPaymentById(id: string) {
        return await masterPrisma.payment.findUnique({
            where: { id },
            include: { subscription: true }
        });
    };

    async findPaymentByReference(gatewayReference: string) {
        return await masterPrisma.payment.findFirst({
            where: { gatewayReference },
            include: { subscription: true }
        });
    };

    async updatePayment(id: string, data: {
        status?: PaymentStatus;
        transactionId?: string;
        metadata?: any;
        failureReason?: string;
        paidAt?: Date;
    }) {
        return await masterPrisma.payment.update({
            where: { id },
            data: {
                ...data,
                metadata: data.metadata ? data.metadata : undefined
            }
        });
    };

    async listPaymentsBySubscription(subscriptionId: string) {
        return await masterPrisma.payment.findMany({
            where: { subscriptionId },
            orderBy: { createdAt: 'desc' }
        });
    };

    async listAllPayments(skip: number, take: number) {
        return await masterPrisma.payment.findMany({
            skip,
            take,
            orderBy: { createdAt: 'desc' },
            include: {
                subscription: {
                    include: {
                        tenant: true
                    }
                }
            }
        });
    };

    async countAllPayments() {
        return await masterPrisma.payment.count();
    };
}
