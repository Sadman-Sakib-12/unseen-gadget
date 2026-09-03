import { Router } from "express";
import {
  changePasswordSchema,
  forgotPasswordSchema,
  loginSchema,
  registerSchema,
  resendOtpSchema,
  resetPasswordSchema,
  verifyEmailSchema,
} from "@unseen-gadget/validations";
import * as authController from "../controllers/auth.controller";
import { authenticateCustomer } from "../middlewares/auth";
import { authRateLimiter } from "../middlewares/rate-limit";
import { validateBody } from "../middlewares/validate";

const router = Router();

router.post("/register", authRateLimiter, validateBody(registerSchema), authController.register);
router.post("/verify-email", validateBody(verifyEmailSchema), authController.verifyEmail);
router.post("/login", authRateLimiter, validateBody(loginSchema), authController.login);
router.post("/resend-otp", authRateLimiter, validateBody(resendOtpSchema), authController.resendOtp);
router.post("/refresh", authController.refresh);
router.get("/me", authenticateCustomer, authController.me);
router.post("/logout", authenticateCustomer, authController.logout);
router.post("/forgot-password", authRateLimiter, validateBody(forgotPasswordSchema), authController.forgotPassword);
router.post("/reset-password", validateBody(resetPasswordSchema), authController.resetPassword);
router.post(
  "/change-password",
  authenticateCustomer,
  validateBody(changePasswordSchema),
  authController.changePassword,
);
router.patch("/profile", authenticateCustomer, authController.updateProfile);

export default router;