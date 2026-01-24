import { Router } from "express";
import { SuperAdminController } from "../controllers/superAdmin.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();
const superAdminController = new SuperAdminController();

// Public route for initial SuperAdmin creation
router.post("/", superAdminController.createSuperAdmin);

// Protected routes - require SuperAdmin authentication
router.use(authMiddleware('SUPER_ADMIN'));


// SuperAdmin Management
router.put("/:id", superAdminController.updateSuperAdmin);
router.delete("/:id", superAdminController.deleteSuperAdmin);

// Tenant Management
router.post("/tenants", superAdminController.createTenant);
router.get("/tenants", superAdminController.getAllTenants);
router.get("/tenants/:id", superAdminController.findTenantById);
router.put("/tenants/:id", superAdminController.updateTenant);
router.delete("/tenants/:id", superAdminController.deleteTenant);

// Dashboard Stats
router.get("/stats", superAdminController.getDashboardStats);

export default router;