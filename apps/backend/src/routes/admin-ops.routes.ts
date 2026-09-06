import { Router } from "express";
import * as procurement from "../controllers/admin-procurement.controller";
import * as ordersOps from "../controllers/admin-orders-ops.controller";
import * as system from "../controllers/admin-system.controller";
import * as paymentController from "../controllers/payment.controller";
import { authenticateAdmin } from "../middlewares/auth";
import { requirePermission, requireRole } from "../middlewares/authorize";
import {
  validateBody,
  validateParams,
} from "../middlewares/validate";
import {
  idParamsSchema,
  supplierCreateSchema,
  supplierUpdateSchema,
  supplierTransactionCreateSchema,
  purchaseCreateSchema,
  purchaseUpdateSchema,
  inventoryUpdateSchema,
  stockMovementCreateSchema,
  reviewStatusSchema,
  returnStatusSchema,
  deliveryUpdateSchema,
  expenseCreateSchema,
  expenseUpdateSchema,
  notificationCreateSchema,
  promotionCreateSchema,
  promotionUpdateSchema,
  posSessionCreateSchema,
  posSessionSaleSchema,
  posSessionCloseSchema,
  settingUpsertSchema,
  adminCreateSchema,
  adminUpdateSchema,
  roleCreateSchema,
  roleUpdateSchema,
} from "../validations/ops.validations";

const router = Router();

router.use(authenticateAdmin);

// ---------- Suppliers ----------
router.get("/suppliers", requirePermission("manage_products"), procurement.listSuppliers);
router.get("/suppliers/:id", validateParams(idParamsSchema), procurement.getSupplier);
router.post(
  "/suppliers",
  requirePermission("manage_products"),
  validateBody(supplierCreateSchema),
  procurement.createSupplier,
);
router.put(
  "/suppliers/:id",
  requirePermission("manage_products"),
  validateParams(idParamsSchema),
  validateBody(supplierUpdateSchema),
  procurement.updateSupplier,
);
router.delete(
  "/suppliers/:id",
  requirePermission("manage_products"),
  validateParams(idParamsSchema),
  procurement.deleteSupplier,
);
router.get("/suppliers/:id/transactions", validateParams(idParamsSchema), procurement.listSupplierTransactions);
router.post(
  "/suppliers/:id/transactions",
  requirePermission("manage_products"),
  validateParams(idParamsSchema),
  validateBody(supplierTransactionCreateSchema),
  procurement.createSupplierTransaction,
);

// ---------- Purchases ----------
router.get("/purchases", requirePermission("view_orders"), procurement.listPurchases);
router.get("/purchases/:id", validateParams(idParamsSchema), procurement.getPurchase);
router.post(
  "/purchases",
  requirePermission("manage_orders"),
  validateBody(purchaseCreateSchema),
  procurement.createPurchase,
);
router.put(
  "/purchases/:id",
  requirePermission("manage_orders"),
  validateParams(idParamsSchema),
  validateBody(purchaseUpdateSchema),
  procurement.updatePurchase,
);
router.delete(
  "/purchases/:id",
  requirePermission("manage_orders"),
  validateParams(idParamsSchema),
  procurement.deletePurchase,
);

// ---------- Inventory ----------
router.get("/inventory", procurement.listInventory);
router.get("/inventory/stock-movements", procurement.listStockMovements);
router.post(
  "/inventory/stock-movements",
  requirePermission("manage_products"),
  validateBody(stockMovementCreateSchema),
  procurement.createStockMovement,
);
router.get("/stock-movements", procurement.listStockMovements);
router.post(
  "/stock-movements",
  requirePermission("manage_products"),
  validateBody(stockMovementCreateSchema),
  procurement.createStockMovement,
);
router.get("/inventory/:id", validateParams(idParamsSchema), procurement.getInventoryItem);
router.put(
  "/inventory/:id",
  requirePermission("manage_products"),
  validateParams(idParamsSchema),
  validateBody(inventoryUpdateSchema),
  procurement.updateInventoryItem,
);

// ---------- Payments ----------
router.get("/payments", paymentController.adminGetPaymentsList);
router.get("/payments/:id", paymentController.adminGetPaymentDetail);
router.patch("/payments/:id/approve", paymentController.adminApprovePayment);
router.patch("/payments/:id/reject", paymentController.adminRejectPayment);

// ---------- Reviews ----------
router.get("/reviews", ordersOps.listAdminReviews);
router.get("/reviews/:id", validateParams(idParamsSchema), ordersOps.getAdminReview);
router.patch(
  "/reviews/:id/status",
  validateParams(idParamsSchema),
  validateBody(reviewStatusSchema),
  ordersOps.updateAdminReviewStatus,
);
router.delete("/reviews/:id", validateParams(idParamsSchema), ordersOps.deleteAdminReview);

// ---------- Returns ----------
router.get("/returns", ordersOps.listReturns);
router.get("/returns/:id", validateParams(idParamsSchema), ordersOps.getReturn);
router.patch(
  "/returns/:id/status",
  validateParams(idParamsSchema),
  validateBody(returnStatusSchema),
  ordersOps.updateReturnStatus,
);

// ---------- Deliveries ----------
router.get("/deliveries", ordersOps.listDeliveries);
router.get("/deliveries/:id", validateParams(idParamsSchema), ordersOps.getDelivery);
router.patch(
  "/deliveries/:id/status",
  requirePermission("manage_orders"),
  validateParams(idParamsSchema),
  validateBody(deliveryUpdateSchema),
  ordersOps.updateDelivery,
);

// ---------- Expenses ----------
router.get("/expenses", requireRole("SUPER_ADMIN"), system.listExpenses);
router.get("/expenses/:id", requireRole("SUPER_ADMIN"), validateParams(idParamsSchema), system.getExpense);
router.post("/expenses", requireRole("SUPER_ADMIN"), validateBody(expenseCreateSchema), system.createExpense);
router.put(
  "/expenses/:id",
  requireRole("SUPER_ADMIN"),
  validateParams(idParamsSchema),
  validateBody(expenseUpdateSchema),
  system.updateExpense,
);
router.delete("/expenses/:id", requireRole("SUPER_ADMIN"), validateParams(idParamsSchema), system.deleteExpense);

// ---------- Notifications ----------
router.get("/notifications", system.listNotifications);
router.post("/notifications", validateBody(notificationCreateSchema), system.createNotification);
router.patch("/notifications/read-all", system.markAllNotificationsRead);
router.patch(
  "/notifications/:id/read",
  validateParams(idParamsSchema),
  system.markNotificationRead,
);
router.put(
  "/notifications/:id",
  validateParams(idParamsSchema),
  system.updateNotification,
);
router.delete("/notifications/clear-all", system.clearAllNotifications);
router.delete(
  "/notifications/:id",
  validateParams(idParamsSchema),
  system.deleteNotification,
);

// ---------- Promotions ----------
router.get("/promotions", system.listAdminPromotions);
router.get("/promotions/:id", validateParams(idParamsSchema), system.getAdminPromotion);
router.post(
  "/promotions",
  validateBody(promotionCreateSchema),
  system.createAdminPromotion,
);
router.put(
  "/promotions/:id",
  validateParams(idParamsSchema),
  validateBody(promotionUpdateSchema),
  system.updateAdminPromotion,
);
router.delete(
  "/promotions/:id",
  validateParams(idParamsSchema),
  system.deleteAdminPromotion,
);

// ---------- POS ----------
router.get("/pos/sessions", system.listPosSessions);
router.post("/pos/sessions", validateBody(posSessionCreateSchema), system.createPosSession);
router.get("/pos/sessions/:id", validateParams(idParamsSchema), system.getPosSession);
router.patch(
  "/pos/sessions/:id/sale",
  validateParams(idParamsSchema),
  validateBody(posSessionSaleSchema),
  system.recordPosSale,
);
router.patch(
  "/pos/sessions/:id/close",
  validateParams(idParamsSchema),
  validateBody(posSessionCloseSchema),
  system.closePosSession,
);

// ---------- Settings ----------
router.get("/settings", system.getAllSettings);
router.put(
  "/settings/:key",
  requireRole("SUPER_ADMIN"),
  validateBody(settingUpsertSchema),
  system.upsertSetting,
);

// ---------- Admin management ----------
router.get("/admins", requireRole("SUPER_ADMIN"), system.listAdmins);
router.post("/admins", requireRole("SUPER_ADMIN"), validateBody(adminCreateSchema), system.createAdminUser);
router.put("/admins/:id", requireRole("SUPER_ADMIN"), validateParams(idParamsSchema), validateBody(adminUpdateSchema), system.updateAdminUser);
router.delete("/admins/:id", requireRole("SUPER_ADMIN"), validateParams(idParamsSchema), system.deleteAdminUser);

router.get("/roles", requireRole("SUPER_ADMIN"), system.listRoles);
router.post("/roles", requireRole("SUPER_ADMIN"), validateBody(roleCreateSchema), system.createRole);
router.put("/roles/:id", requireRole("SUPER_ADMIN"), validateParams(idParamsSchema), validateBody(roleUpdateSchema), system.updateRole);
router.delete("/roles/:id", requireRole("SUPER_ADMIN"), validateParams(idParamsSchema), system.deleteRole);

export default router;
