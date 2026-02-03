import { Router } from "express";
import superAdminRoute from "./superAdmin.route";
import authRoute from "./auth.routes";
import pricingRoute from "./pricing.routes";
import subscriptionRoute from "./subscription.route";

const routes = Router();

routes.use("/auth", authRoute);
routes.use("/super-admin", superAdminRoute);
routes.use("/pricing-plans", pricingRoute);
routes.use("/subscriptions", subscriptionRoute);

export default routes;