import { PaymentController } from "@/controllers/payment.controller";
import { Router } from "express";

const router = Router();
const controller = new PaymentController();

router.post("/webhook/khalti", controller.handleKhaltiCallback);
router.post("/webhook/stripe", controller.handleStripWebhook);

export default router;
