import { Router } from "express";
import * as cartController from "../controllers/cart.controller";
import { authenticateCustomer, optionalAuth } from "../middlewares/auth";
import { addToCartSchema, updateCartItemSchema } from "@unseen-gadget/validations";
import { validateBody, validateParams } from "../middlewares/validate";
import { z } from "zod";

const router = Router();

// ---------- Session-scoped cart (guest cookie or logged-in user) ----------
router.get("/current", optionalAuth, cartController.getOrCreateCurrentCart);
router.post(
  "/session",
  optionalAuth,
  cartController.getOrCreateCurrentCart,
);
router.post(
  "/current/items",
  optionalAuth,
  validateBody(addToCartSchema),
  cartController.addItemToCurrentCart,
);
router.post(
  "/items",
  optionalAuth,
  validateBody(addToCartSchema),
  cartController.addItemToCurrentCart,
);
router.put(
  "/current/items/:cartItemId",
  optionalAuth,
  validateBody(updateCartItemSchema),
  cartController.updateCurrentCartItem,
);
router.delete(
  "/current/items/:cartItemId",
  optionalAuth,
  validateParams(z.object({ cartItemId: z.string().min(1) })),
  cartController.removeCurrentCartItem,
);
router.post("/current/clear", optionalAuth, cartController.clearCurrentCart);

// ---------- Legacy guest lookup (session id in path) ----------
router.get("/guest/:sessionId", optionalAuth, cartController.getGuestCart);

// ---------- Authenticated cart by id ----------
router.post(
  "/:cartId/items",
  authenticateCustomer,
  validateBody(addToCartSchema),
  cartController.addToCart,
);
router.get("/:cartId", authenticateCustomer, cartController.getCart);
router.put(
  "/items/:cartItemId",
  optionalAuth,
  validateBody(updateCartItemSchema),
  cartController.updateCurrentCartItem,
);
router.delete(
  "/items/:cartItemId",
  optionalAuth,
  cartController.removeCurrentCartItem,
);
router.post("/:cartId/clear", optionalAuth, cartController.clearCurrentCart);

export default router;
