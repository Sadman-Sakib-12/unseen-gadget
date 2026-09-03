import { Router } from "express";
import * as couponController from "../controllers/coupon.controller";

const router = Router();

// POST /api/coupons/validate - Validate a coupon code
router.post("/validate", couponController.validateCoupon);

export default router;
