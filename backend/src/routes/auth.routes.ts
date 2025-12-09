import { Router } from "express";
import { AuthController } from "../controllers/auth.controller";

const router = Router();
const authController = new AuthController();

// Public routes
router.post("/login", authController.login);
router.get("/logout", authController.logout);
router.post("/refresh", authController.refreshToken);

// Backward compatibility
router.post("/super-admin/login", authController.superAdminLogin);

export default router;