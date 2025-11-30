import { Router } from "express";
import superAdminRoute from "./superAdmin.route";
import authRoute from "./auth.routes";

const routes = Router();

routes.use("/auth", authRoute);
routes.use("/super-admin", superAdminRoute);

export default routes;