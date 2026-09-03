import type { Request, Response } from "express";
import { prisma } from "@unseen-gadget/database";
import { ApiResponseUtil } from "../utils/api-response";
import { BadRequestError, NotFoundError } from "../utils/errors";
import { asyncHandler } from "../utils/async-handler";
import type { z } from "zod";
import type {
  reviewStatusSchema,
  returnStatusSchema,
  returnCreateSchema,
  deliveryUpdateSchema,
} from "../validations/ops.validations";

type ReviewStatus = z.infer<typeof reviewStatusSchema>;
type ReturnStatusInput = z.infer<typeof returnStatusSchema>;
type ReturnCreate = z.infer<typeof returnCreateSchema>;
type DeliveryUpdate = z.infer<typeof deliveryUpdateSchema>;

// ===================== Reviews (admin) =====================

const REVIEW_INCLUDE = {
  user: { select: { id: true, name: true, email: true } },
  product: { select: { id: true, name: true, slug: true, images: true } },
} as const;

export const listAdminReviews = asyncHandler(async (req: Request, res: Response) => {
  const status = req.query.status as string | undefined;
  const reviews = await prisma.review.findMany({
    where: status ? { status: status as never } : undefined,
    include: REVIEW_INCLUDE,
    orderBy: { createdAt: "desc" },
  });
  ApiResponseUtil.success(res, reviews);
});

export const getAdminReview = asyncHandler(async (req: Request, res: Response) => {
  const review = await prisma.review.findUnique({
    where: { id: req.params.id },
    include: REVIEW_INCLUDE,
  });
  if (!review) throw new NotFoundError("Review not found");
  ApiResponseUtil.success(res, review);
});

async function recalcProductRating(productId: string) {
  const agg = await prisma.review.aggregate({
    where: { productId, status: "APPROVED" },
    _avg: { rating: true },
    _count: { rating: true },
  });
  await prisma.product.update({
    where: { id: productId },
    data: {
      rating: agg._avg.rating ? Math.round(agg._avg.rating * 10) / 10 : null,
      ratingCount: agg._count.rating,
    },
  });
}

export const updateAdminReviewStatus = asyncHandler(async (req: Request, res: Response) => {
  const { status } = req.validated.body as ReviewStatus;
  const review = await prisma.review.findUnique({ where: { id: req.params.id } });
  if (!review) throw new NotFoundError("Review not found");

  const updated = await prisma.$transaction(async (tx) => {
    const saved = await tx.review.update({
      where: { id: review.id },
      data: { status },
      include: REVIEW_INCLUDE,
    });
    await recalcProductRating(review.productId);
    return saved;
  });
  ApiResponseUtil.success(res, updated, `Review ${status.toLowerCase()}`);
});

export const deleteAdminReview = asyncHandler(async (req: Request, res: Response) => {
  const review = await prisma.review.findUnique({ where: { id: req.params.id } });
  if (!review) throw new NotFoundError("Review not found");
  await prisma.$transaction(async (tx) => {
    await tx.review.delete({ where: { id: review.id } });
    await recalcProductRating(review.productId);
  });
  ApiResponseUtil.success(res, { deleted: true }, "Review deleted");
});

// ===================== Returns =====================

const RETURN_INCLUDE = {
  order: {
    select: {
      id: true,
      customerName: true,
      customerPhone: true,
      customerEmail: true,
      status: true,
      total: true,
      userId: true,
    },
  },
} as const;

export const listReturns = asyncHandler(async (_req: Request, res: Response) => {
  const returns = await prisma.return.findMany({
    include: RETURN_INCLUDE,
    orderBy: { requestDate: "desc" },
  });
  ApiResponseUtil.success(res, returns);
});

export const getReturn = asyncHandler(async (req: Request, res: Response) => {
  const ret = await prisma.return.findUnique({
    where: { id: req.params.id },
    include: RETURN_INCLUDE,
  });
  if (!ret) throw new NotFoundError("Return not found");
  ApiResponseUtil.success(res, ret);
});

export const updateReturnStatus = asyncHandler(async (req: Request, res: Response) => {
  const body = req.validated.body as ReturnStatusInput;
  const existing = await prisma.return.findUnique({ where: { id: req.params.id } });
  if (!existing) throw new NotFoundError("Return not found");

  const resolved = ["APPROVED", "REFUNDED", "REJECTED"];

  const ret = await prisma.return.update({
    where: { id: existing.id },
    data: {
      status: body.status,
      refundAmount: body.refundAmount ?? existing.refundAmount,
      resolvedDate: resolved.includes(body.status)
        ? (existing.resolvedDate ?? new Date())
        : existing.resolvedDate,
    },
    include: RETURN_INCLUDE,
  });
  ApiResponseUtil.success(res, ret, `Return ${body.status.toLowerCase()}`);
});

export const createCustomerReturn = asyncHandler(async (req: Request, res: Response) => {
  const body = req.validated.body as ReturnCreate;
  const order = await prisma.order.findUnique({
    where: { id: body.orderId },
    include: { items: true },
  });
  if (!order) throw new NotFoundError("Order not found");
  if (order.userId && req.user?.id && order.userId !== req.user.id) {
    throw new BadRequestError("You can only request returns for your own orders");
  }

  const productName =
    body.product ?? (order.items.map((i) => i.productName).join(", ") || "Order items");

  const ret = await prisma.return.create({
    data: {
      orderId: order.id,
      customerName: order.customerName,
      product: productName,
      reason: body.reason,
      status: "PENDING",
      refundAmount: body.refundAmount ?? 0,
      requestDate: new Date(),
    },
    include: RETURN_INCLUDE,
  });
  ApiResponseUtil.created(res, ret, "Return request submitted");
});

// ===================== Deliveries =====================

const DELIVERY_INCLUDE = {
  order: {
    select: {
      id: true,
      customerName: true,
      customerPhone: true,
      shippingAddress: true,
      city: true,
      status: true,
      total: true,
    },
  },
} as const;

export const listDeliveries = asyncHandler(async (_req: Request, res: Response) => {
  const deliveries = await prisma.delivery.findMany({
    include: DELIVERY_INCLUDE,
    orderBy: { createdAt: "desc" },
  });
  ApiResponseUtil.success(res, deliveries);
});

export const getDelivery = asyncHandler(async (req: Request, res: Response) => {
  const delivery = await prisma.delivery.findUnique({
    where: { id: req.params.id },
    include: DELIVERY_INCLUDE,
  });
  if (!delivery) throw new NotFoundError("Delivery not found");
  ApiResponseUtil.success(res, delivery);
});

export const updateDelivery = asyncHandler(async (req: Request, res: Response) => {
  const body = req.validated.body as DeliveryUpdate;
  const existing = await prisma.delivery.findUnique({ where: { id: req.params.id } });
  if (!existing) throw new NotFoundError("Delivery not found");

  const delivery = await prisma.delivery.update({
    where: { id: existing.id },
    data: {
      ...(body.status !== undefined ? { status: body.status } : {}),
      ...(body.courier !== undefined ? { courier: body.courier } : {}),
      ...(body.trackingNumber !== undefined ? { trackingNumber: body.trackingNumber } : {}),
      ...(body.estimatedDelivery !== undefined
        ? { estimatedDelivery: new Date(body.estimatedDelivery) }
        : {}),
      ...(body.status === "DELIVERED" ? { deliveredAt: existing.deliveredAt ?? new Date() } : {}),
    },
    include: DELIVERY_INCLUDE,
  });

  if (body.status === "DELIVERED" && existing.orderId) {
    try {
      await prisma.order.update({
        where: { id: existing.orderId },
        data: { status: "DELIVERED" },
      });
    } catch {
      // order may have been deleted; delivery state is still updated
    }
  }

  ApiResponseUtil.success(res, delivery, "Delivery updated");
});
