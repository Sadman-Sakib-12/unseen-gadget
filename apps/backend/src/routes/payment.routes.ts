import { Router } from "express";
import {
  customerCreatePayment,
  customerGetPayment,
  customerGetOrderPayment,
} from "../controllers/payment.controller";
import {
  adminGetPaymentsList,
  adminGetPaymentDetail,
  adminApprovePayment,
  adminRejectPayment,
} from "../controllers/payment.controller";
import { authenticateCustomer } from "../middlewares/auth";
import { authenticateAdmin } from "../middlewares/auth";

const router = Router();

// ===================== Customer Payment Routes =====================

// POST /api/payments - Customer creates a payment record
router.post("/", authenticateCustomer, customerCreatePayment);

// GET /api/payments/:id - Customer gets their payment detail
router.get("/:id", authenticateCustomer, customerGetPayment);

// GET /api/orders/:id/payment - Customer gets payment for their order
router.get("/order/:id/payment", authenticateCustomer, customerGetOrderPayment);

// ===================== Admin Payment Routes =====================

// GET /api/admin/payments - Admin lists payments with filters
router.get("/admin", authenticateAdmin, adminGetPaymentsList);

// GET /api/admin/payments/:id - Admin gets payment detail
router.get("/admin/:id", authenticateAdmin, adminGetPaymentDetail);

// PATCH /api/admin/payments/:id/approve - Admin approves payment
router.patch("/admin/:id/approve", authenticateAdmin, adminApprovePayment);

// PATCH /api/admin/payments/:id/reject - Admin rejects payment
router.patch("/admin/:id/reject", authenticateAdmin, adminRejectPayment);

export default router;