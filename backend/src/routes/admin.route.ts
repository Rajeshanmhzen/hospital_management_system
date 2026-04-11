import { Router } from "express";
import { AdminController } from "../controllers/admin.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { tenantResolverMiddleware } from "../middlewares/tenantResolver.middleware";
import { rbac } from "../middlewares/rbac.middleware";

const adminRouter = Router();
const controller = new AdminController();

// Secure all admin routes
adminRouter.use(authMiddleware());
adminRouter.use(tenantResolverMiddleware);
adminRouter.use(rbac(["ADMIN"]));

// User management routes
adminRouter.post("/users/add", controller.createUser);
adminRouter.get("/users/list", controller.listUser);
adminRouter.get("/users/role/:role", controller.listUserByRole);
adminRouter.get("/users/detail/:id", controller.detailUser);
adminRouter.put("/users/edit/:id", controller.editUser);
adminRouter.patch("/users/role/:id", controller.editRole);
adminRouter.delete("/users/delete/:id", controller.deleteUser);

export default adminRouter;
