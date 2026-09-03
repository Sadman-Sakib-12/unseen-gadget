import { Router } from "express";
import * as dashboardController from "../controllers/dashboard.controller";
import { authenticateAdmin } from "../middlewares/auth";
import { requireRole } from "../middlewares/authorize";

const router = Router();

router.use(authenticateAdmin);
router.use(requireRole("SUPER_ADMIN", "STAFF"));

router.get("/", dashboardController.getDashboardAll);
router.get("/stats", dashboardController.getDashboardStats);
router.get("/sales-overview", dashboardController.getSalesOverview);
router.get("/sales-trend", dashboardController.getSalesTrend);
router.get("/sales-by-channel", dashboardController.getSalesByChannel);
router.get("/recent-orders", dashboardController.getRecentOrders);
router.get("/top-selling", dashboardController.getTopSellingProducts);
router.get("/low-stock", dashboardController.getLowStockProducts);

export default router;
