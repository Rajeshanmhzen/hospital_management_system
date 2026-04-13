import { Router } from "express";
import { SuperAdminController } from "../controllers/superAdmin.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();
const superAdminController = new SuperAdminController();

// Public route for initial SuperAdmin creation
router.post("/add", superAdminController.addSuperAdmin);

// Protected routes - require SuperAdmin authentication
router.use(authMiddleware('SUPER_ADMIN'));


// SuperAdmin Management
router.put("/edit/:id", superAdminController.editSuperAdmin);
router.delete("/delete/:id", superAdminController.deleteSuperAdmin);

// Tenant Management
router.post("/tenants/add", superAdminController.addTenant);
router.get("/tenants/list", superAdminController.listTenant);
router.get("/tenants/detail/:id", superAdminController.detailTenant);
router.put("/tenants/edit/:id", superAdminController.editTenant);
router.delete("/tenants/delete/:id", superAdminController.deleteTenant);
router.patch("/tenants/:id/status", superAdminController.editTenantStatus);
router.patch("/tenants/bulk-status", superAdminController.bulkEditTenantStatus);
router.get("/tenants/export", superAdminController.exportTenantList);
router.get("/jobs/:jobId", superAdminController.getProvisioningJobStatus);

// Dashboard Stats
router.get("/stats", superAdminController.getDashboardStats);

export default router;
