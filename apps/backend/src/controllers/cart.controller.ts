import { randomBytes } from "node:crypto";
import type { Request, Response } from "express";
import { prisma } from "@unseen-gadget/database";
import * as cartService from "../services/cart.service";
import { ApiResponseUtil } from "../utils/api-response";
import { asyncHandler } from "../utils/async-handler";
import { NotFoundError, UnauthorizedError } from "../utils/errors";
import {
  CART_SESSION_COOKIE_NAME,
} from "../constants";
import { setCartSessionCookie } from "../config/cookies";
import type { AddToCartInput, UpdateCartItemInput } from "@unseen-gadget/validations";

interface CartSessionContext {
  userId?: string;
  sessionId?: string;
}

function resolveCartContext(req: Request): CartSessionContext {
  if (req.user?.id) return { userId: req.user.id };
  const sessionId = req.cookies?.[CART_SESSION_COOKIE_NAME] as string | undefined;
  if (sessionId) return { sessionId };
  return {};
}

function issueSessionIfNeeded(
  _req: Request,
  res: Response,
  ctx: CartSessionContext,
): void {
  if (!ctx.userId && !ctx.sessionId) {
    const sessionId = randomBytes(24).toString("base64url");
    setCartSessionCookie(res, sessionId);
    ctx.sessionId = sessionId;
  }
}

async function resolveCart(req: Request, res: Response) {
  const ctx = resolveCartContext(req);
  issueSessionIfNeeded(req, res, ctx);
  if (ctx.userId) return cartService.getOrCreateUserCart(ctx.userId);
  return cartService.getOrCreateSessionCart(ctx.sessionId!);
}

export const getOrCreateCurrentCart = asyncHandler(async (req: Request, res: Response) => {
  const cart = await resolveCart(req, res);
  ApiResponseUtil.success(res, cart);
});

export const addItemToCurrentCart = asyncHandler(async (req: Request, res: Response) => {
  const input = req.validated.body as AddToCartInput;
  const cart = await resolveCart(req, res);

  // Guest carts are identified by session; ownership check inside service
  // only applies when a userId is bound to the cart.
  const updated = await cartService.addItemToCart(cart.id, input, req.user?.id);
  ApiResponseUtil.success(res, updated, "Item added to cart");
});

export const updateCurrentCartItem = asyncHandler(async (req: Request, res: Response) => {
  const input = req.validated.body as UpdateCartItemInput;
  await assertItemBelongsToCurrentCart(req, req.params.cartItemId);
  const updated = await cartService.updateCartItemQuantity(
    req.params.cartItemId,
    input.quantity,
  );
  ApiResponseUtil.success(res, updated, "Cart item updated");
});

export const removeCurrentCartItem = asyncHandler(async (req: Request, res: Response) => {
  await assertItemBelongsToCurrentCart(req, req.params.cartItemId);
  const updated = await cartService.removeCartItem(req.params.cartItemId);
  ApiResponseUtil.success(res, updated, "Item removed from cart");
});

export const clearCurrentCart = asyncHandler(async (req: Request, res: Response) => {
  const cart = await resolveCart(req, res);
  const updated = await cartService.clearCart(cart.id);
  ApiResponseUtil.success(res, updated, "Cart cleared");
});

// ---------- Legacy authenticated cart endpoints (by cart id) ----------

export const addToCart = asyncHandler(async (req: Request, res: Response) => {
  const input = req.validated.body as AddToCartInput;
  const user = req.user;

  const cart = await cartService.addItemToCart(req.params.cartId, input, user?.id);

  ApiResponseUtil.success(res, cart, "Item added to cart");
});

export const getCart = asyncHandler(async (req: Request, res: Response) => {
  const cart = await cartService.getCartWithItems(req.params.cartId);
  ApiResponseUtil.success(res, cart);
});

export const updateCartItem = asyncHandler(async (req: Request, res: Response) => {
  const input = req.validated.body as UpdateCartItemInput;
  const updated = await cartService.updateCartItemQuantity(
    req.params.cartItemId,
    input.quantity,
  );
  ApiResponseUtil.success(res, updated, "Cart item updated");
});

export const removeCartItem = asyncHandler(async (req: Request, res: Response) => {
  const updated = await cartService.removeCartItem(req.params.cartItemId);
  ApiResponseUtil.success(res, updated, "Item removed from cart");
});

export const clearCart = asyncHandler(async (req: Request, res: Response) => {
  const cart = await cartService.clearCart(req.params.cartId);
  ApiResponseUtil.success(res, cart, "Cart cleared");
});

export const getGuestCart = asyncHandler(async (req: Request, res: Response) => {
  const cart = await cartService.getGuestCart(req.params.sessionId);
  ApiResponseUtil.success(res, cart);
});

async function assertItemBelongsToCurrentCart(req: Request, cartItemId: string) {
  const ctx = resolveCartContext(req);
  if (!ctx.userId && !ctx.sessionId) {
    throw new UnauthorizedError("No cart session");
  }
  const item = await prisma.cartItem.findUnique({
    where: { id: cartItemId },
    include: { cart: true },
  });
  if (!item) throw new NotFoundError("Cart item not found");
  const owns =
    (ctx.userId && item.cart.userId === ctx.userId) ||
    (ctx.sessionId && item.cart.sessionId === ctx.sessionId);
  if (!owns) throw new UnauthorizedError("Cart item does not belong to the current session");
}

export const CartController = {
  addToCart,
  getCart,
  updateCartItem,
  removeCartItem,
  clearCart,
  getGuestCart,
  getOrCreateCurrentCart,
  addItemToCurrentCart,
  updateCurrentCartItem,
  removeCurrentCartItem,
  clearCurrentCart,
};

export default CartController;
