import { Router } from "express";
import { SubscriptionController } from "../controllers/subscription.controller";
import { authMiddleware } from "@/middlewares/auth.middleware";

const router = Router();
const subscriptionController = new SubscriptionController();

router.use(authMiddleware('SUPER_ADMIN'));

router.post("/add", subscriptionController.addSubscription);
router.post("/edit/:id", subscriptionController.editSubscription);
router.delete("/delete/:id", subscriptionController.deleteSubscription);
router.get("/detail/:id", subscriptionController.detailSubscription);
router.get("/list", subscriptionController.listSubscription);

export default router;