import type { Request, Response } from "express";
import { prisma } from "@unseen-gadget/database";
import { ApiResponseUtil } from "../utils/api-response";
import { asyncHandler } from "../utils/async-handler";

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
    ApiResponseUtil.error(res, 404, "Customer not found");
    return;
  }

  ApiResponseUtil.success(res, customer);
});

export const AdminCustomerController = {
  listCustomers,
  getCustomer,
};

export default AdminCustomerController;
