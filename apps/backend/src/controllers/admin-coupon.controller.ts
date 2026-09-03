import type { Request, Response } from "express";
import { prisma } from "@unseen-gadget/database";
import { ApiResponseUtil } from "../utils/api-response";
import { NotFoundError } from "../utils/errors";
import { asyncHandler } from "../utils/async-handler";

export const listCoupons = asyncHandler(async (_req: Request, res: Response) => {
  const coupons = await prisma.coupon.findMany({
    orderBy: { createdAt: "desc" },
  });

  ApiResponseUtil.success(res, coupons);
});

export const createCoupon = asyncHandler(async (req: Request, res: Response) => {
  const { code, discountType, discountValue, minimumOrder, maximumDiscount, usageLimit, expiryDate, status } = req.body;

  const coupon = await prisma.coupon.create({
    data: {
      code,
      discountType,
      discountValue,
      minimumOrder: minimumOrder || 0,
      maximumDiscount,
      usageLimit,
      expiryDate: expiryDate ? new Date(expiryDate) : undefined,
      status: status || "ACTIVE",
    },
  });

  ApiResponseUtil.success(res, coupon, "Coupon created successfully");
});

export const updateCoupon = asyncHandler(async (req: Request, res: Response) => {
  const { couponId } = req.params;
  const { code, discountType, discountValue, minimumOrder, maximumDiscount, usageLimit, expiryDate, status } = req.body;

  const existing = await prisma.coupon.findUnique({
    where: { id: couponId },
  });

  if (!existing) {
    throw new NotFoundError("Coupon not found");
  }

  const coupon = await prisma.coupon.update({
    where: { id: couponId },
    data: {
      ...(code !== undefined && { code }),
      ...(discountType !== undefined && { discountType }),
      ...(discountValue !== undefined && { discountValue }),
      ...(minimumOrder !== undefined && { minimumOrder }),
      ...(maximumDiscount !== undefined && { maximumDiscount }),
      ...(usageLimit !== undefined && { usageLimit }),
      ...(expiryDate !== undefined && { expiryDate: expiryDate ? new Date(expiryDate) : null }),
      ...(status !== undefined && { status }),
    },
  });

  ApiResponseUtil.success(res, coupon, "Coupon updated successfully");
});

export const deleteCoupon = asyncHandler(async (req: Request, res: Response) => {
  const { couponId } = req.params;

  const existing = await prisma.coupon.findUnique({
    where: { id: couponId },
  });

  if (!existing) {
    throw new NotFoundError("Coupon not found");
  }

  await prisma.coupon.delete({
    where: { id: couponId },
  });

  ApiResponseUtil.success(res, { deleted: true });
});

export const AdminCouponController = {
  listCoupons,
  createCoupon,
  updateCoupon,
  deleteCoupon,
};

export default AdminCouponController;
