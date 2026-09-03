import type { Request, Response } from "express";
import * as wishlistService from "../services/wishlist.service";
import { ApiResponseUtil } from "../utils/api-response";
import { asyncHandler } from "../utils/async-handler";

export const getWishlist = asyncHandler(async (req: Request, res: Response) => {
  const wishlist = await wishlistService.getWishlist(req.user!.id);
  ApiResponseUtil.success(res, wishlist);
});

export const addToWishlist = asyncHandler(async (req: Request, res: Response) => {
  const productId = (req.validated.body as unknown as { productId: string }).productId;
  const wishlistItem = await wishlistService.addToWishlist(req.user!.id, productId);
  ApiResponseUtil.success(res, wishlistItem, "Product added to wishlist");
});

export const removeFromWishlist = asyncHandler(async (req: Request, res: Response) => {
  const { productId } = req.params;
  const result = await wishlistService.removeFromWishlist(req.user!.id, productId);
  ApiResponseUtil.success(res, result, "Product removed from wishlist");
});

export const WishlistController = {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
};

export default WishlistController;