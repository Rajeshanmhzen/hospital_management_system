import { Router } from "express";
import superAdminRoute from "./superAdmin.route";
import authRoute from "./auth.routes";
import pricingRoute from "./pricing.routes";

const routes = Router();

routes.use("/auth", authRoute);
routes.use("/super-admin", superAdminRoute);
routes.use("/pricing-plans", pricingRoute);

export default routes;