import type { Request, Response } from "express";
import { prisma } from "@unseen-gadget/database";
import { ApiResponseUtil } from "../utils/api-response";
import { asyncHandler } from "../utils/async-handler";
import { NotFoundError } from "../utils/errors";

export const listCustomers = asyncHandler(async (_req: Request, res: Response) => {
  const customers = await prisma.user.findMany({
    select: {
      id: true,
      email: true,
      name: true,
      phone: true,
      status: true,
      avatar: true,
      createdAt: true,
      _count: {
        select: { orders: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  const customersWithStats = customers.map((c) => ({
    id: c.id,
    email: c.email,
    name: c.name,
    phone: c.phone,
    status: c.status,
    avatar: c.avatar,
    createdAt: c.createdAt,
    orderCount: c._count.orders,
  }));

  ApiResponseUtil.success(res, customersWithStats);
});

export const getCustomer = asyncHandler(async (req: Request, res: Response) => {
  const { customerId } = req.params;

  const customer = await prisma.user.findUnique({
    where: { id: customerId },
    select: {
      id: true,
      email: true,
      name: true,
      phone: true,
      status: true,
      avatar: true,
      createdAt: true,
      orders: {
        select: {
          id: true,
          total: true,
          status: true,
          createdAt: true,
        },
        orderBy: { createdAt: "desc" },
        take: 10,
      },
    },
  });

  if (!customer) {
    throw new NotFoundError("Customer not found");
  }

  ApiResponseUtil.success(res, customer);
});

export const updateCustomer = asyncHandler(async (req: Request, res: Response) => {
  const { customerId } = req.params;
  const { name, phone, status } = req.body;

  const existing = await prisma.user.findUnique({ where: { id: customerId } });
  if (!existing) {
    throw new NotFoundError("Customer not found");
  }

  let formattedStatus = undefined;
  if (status) {
    const upper = String(status).toUpperCase();
    if (upper === "ACTIVE" || upper === "BLOCKED" || upper === "INACTIVE") {
      formattedStatus = upper as any;
    }
  }

  const updated = await prisma.user.update({
    where: { id: customerId },
    data: {
      ...(name !== undefined ? { name } : {}),
      ...(phone !== undefined ? { phone } : {}),
      ...(formattedStatus !== undefined ? { status: formattedStatus } : {}),
    },
    select: {
      id: true,
      email: true,
      name: true,
      phone: true,
      status: true,
      avatar: true,
      createdAt: true,
    },
  });

  ApiResponseUtil.success(res, updated, "Customer updated successfully");
});

export const deleteCustomer = asyncHandler(async (req: Request, res: Response) => {
  const { customerId } = req.params;

  const existing = await prisma.user.findUnique({
    where: { id: customerId },
    include: {
      _count: {
        select: { orders: true },
      },
    },
  });

  if (!existing) {
    throw new NotFoundError("Customer not found");
  }

  // If customer has order history, block them to preserve financial integrity
  if (existing._count.orders > 0) {
    await prisma.user.update({
      where: { id: customerId },
      data: { status: "BLOCKED" as any },
    });
    ApiResponseUtil.success(
      res,
      { action: "blocked", customerId },
      "Customer has order history, so their account has been blocked to preserve records."
    );
    return;
  }

  // If no orders, delete related cart, wishlist, addresses, reviews, and user
  await prisma.$transaction(async (tx) => {
    await tx.cart.deleteMany({ where: { userId: customerId } });
    await tx.wishlist.deleteMany({ where: { userId: customerId } });
    await tx.review.deleteMany({ where: { userId: customerId } });
    await tx.address.deleteMany({ where: { userId: customerId } });
    await tx.user.delete({ where: { id: customerId } });
  });

  ApiResponseUtil.success(res, { action: "deleted", customerId }, "Customer deleted successfully");
});

export const AdminCustomerController = {
  listCustomers,
  getCustomer,
  updateCustomer,
  deleteCustomer,
};

export default AdminCustomerController;
