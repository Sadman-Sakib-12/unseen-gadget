import { Router } from "express";
import { createCustomerReturn } from "../controllers/admin-orders-ops.controller";
import { authenticateCustomer } from "../middlewares/auth";
import { validateBody } from "../middlewares/validate";
import { returnCreateSchema } from "../validations/ops.validations";

const router = Router();

// POST /api/return - customer submits a return request for their order
router.post("/", authenticateCustomer, validateBody(returnCreateSchema), createCustomerReturn);

export default router;
