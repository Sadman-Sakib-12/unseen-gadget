import { Router } from "express";
import * as orderController from "../controllers/order.controller";
import { authenticateCustomer, optionalAuth } from "../middlewares/auth";
import { validateBody } from "../middlewares/validate";
import { orderCreateSchema } from "@unseen-gadget/validations";

const router = Router();

router.post("/checkout", optionalAuth, validateBody(orderCreateSchema), orderController.checkout);
router.get("/", authenticateCustomer, orderController.listOrders);
router.get("/:orderId", authenticateCustomer, orderController.getOrder);
router.post("/:orderId/cancel", authenticateCustomer, orderController.cancelOrder);

export default router;
