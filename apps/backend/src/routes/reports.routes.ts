import { Router } from "express";
import * as reportsController from "../controllers/reports.controller";
import { authenticateAdmin } from "../middlewares/auth";
import { requireRole } from "../middlewares/authorize";

const router = Router();

router.use(authenticateAdmin);
router.use(requireRole("SUPER_ADMIN", "STAFF"));

router.get("/sales", reportsController.getSalesReport);
router.get("/purchases", reportsController.getPurchaseReport);
router.get("/profit", reportsController.getProfitReport);
router.get("/expenses", reportsController.getExpenseReport);

export default router;
