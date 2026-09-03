import type { Request, Response } from "express";
import { prisma } from "@unseen-gadget/database";
import { ApiResponseUtil } from "../utils/api-response";
import { BadRequestError, NotFoundError, ConflictError } from "../utils/errors";
import { asyncHandler } from "../utils/async-handler";

export const validateCoupon = asyncHandler(async (req: Request, res: Response) => {
  const { code, amount, items } = req.body;

  if (!code) {
    throw new BadRequestError("Coupon code is required");
  }

  const coupon = await prisma.coupon.findFirst({
    where: { code, status: "ACTIVE" },
  });

  if (!coupon) {
    throw new NotFoundError("Invalid or expired coupon");
  }

  const now = new Date();
  if (coupon.expiryDate && new Date(coupon.expiryDate) < now) {
    throw new ConflictError("Coupon has expired");
  }

  if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
    throw new ConflictError("Coupon usage limit reached");
  }

  if (items && amount !== undefined && coupon.minimumOrder) {
    const subtotal = items.reduce((sum: number, item: any) => sum + item.price * item.quantity, 0);
    if (subtotal < coupon.minimumOrder) {
      throw new ConflictError(`Minimum order amount is BDT ${coupon.minimumOrder}`);
    }
  }

  let discount = 0;
  if (coupon.discountType === "PERCENTAGE") {
    discount = Math.round((coupon.discountValue / 100) * amount);
  } else if (coupon.discountType === "FIXED") {
    discount = coupon.discountValue;
  }

  if (coupon.maximumDiscount != null) {
    discount = Math.min(discount, coupon.maximumDiscount);
  }

  ApiResponseUtil.success(res, {
    valid: true,
    coupon: {
      id: coupon.id,
      code: coupon.code,
      discountType: coupon.discountType,
      discountValue: coupon.discountValue,
      discountAmount: discount,
      minimumOrder: coupon.minimumOrder,
      maximumDiscount: coupon.maximumDiscount,
    },
    conditions: {
      minimumOrderMet: !coupon.minimumOrder || amount >= coupon.minimumOrder,
      notExpired: !coupon.expiryDate || new Date(coupon.expiryDate) >= now,
      usageRemaining: coupon.usageLimit ? coupon.usageLimit - coupon.usedCount : -1,
    },
  });
});
