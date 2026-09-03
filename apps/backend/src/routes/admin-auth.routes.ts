import { Router } from "express";
import {
  adminLoginSchema,
  adminRegisterSchema,
  changePasswordSchema,
} from "@unseen-gadget/validations";
import * as adminAuthController from "../controllers/admin-auth.controller";
import { authenticateAdmin } from "../middlewares/auth";
import { authRateLimiter } from "../middlewares/rate-limit";
import { validateBody } from "../middlewares/validate";

const router = Router();

router.post("/register", authRateLimiter, validateBody(adminRegisterSchema), adminAuthController.register);
router.post("/login", authRateLimiter, validateBody(adminLoginSchema), adminAuthController.login);
router.post("/refresh", adminAuthController.refresh);
router.get("/me", authenticateAdmin, adminAuthController.me);
router.post("/logout", authenticateAdmin, adminAuthController.logout);
router.post(
  "/change-password",
  authenticateAdmin,
  validateBody(changePasswordSchema),
  adminAuthController.changePassword,
);

export default router;