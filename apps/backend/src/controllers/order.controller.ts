import type { Request, Response } from "express";
import * as orderService from "../services/order.service";
import { ApiResponseUtil } from "../utils/api-response";
import { asyncHandler } from "../utils/async-handler";
import { z } from "zod";
import { orderCreateSchema } from "@unseen-gadget/validations";

export const checkout = asyncHandler(async (req: Request, res: Response) => {
  const validated = req.validated.body as z.infer<typeof orderCreateSchema>;
  const { customerName, customerEmail, customerPhone, shippingAddress, paymentMethod, items } = validated;

  const order = await orderService.checkout(req.user?.id, {
    customerName,
    customerEmail,
    customerPhone,
    shippingAddress,
    paymentMethod,
    items,
  });

  ApiResponseUtil.success(res, order, "Order created successfully");
});

export const listOrders = asyncHandler(async (req: Request, res: Response) => {
  const orders = await orderService.listOrders(req.user!.id);
  ApiResponseUtil.success(res, orders);
});

export const getOrder = asyncHandler(async (req: Request, res: Response) => {
  const { orderId } = req.params;
  const order = await orderService.getOrder(req.user!.id, orderId);
  ApiResponseUtil.success(res, order);
});

export const cancelOrder = asyncHandler(async (req: Request, res: Response) => {
  const { orderId } = req.params;
  const order = await orderService.cancelOrder(req.user!.id, orderId);
  ApiResponseUtil.success(res, order, "Order cancelled successfully");
});

export const listAdminOrders = asyncHandler(async (req: Request, res: Response) => {
  // Admin user set by authenticateAdmin middleware
  (req.adminUser!.id);
  const orders = await orderService.listAdminOrders();
  ApiResponseUtil.success(res, orders);
});

export const getAdminOrder = asyncHandler(async (req: Request, res: Response) => {
  const { orderId } = req.params;
  const order = await orderService.getAdminOrder(req.adminUser!.id, orderId);
  ApiResponseUtil.success(res, order);
});

export const updateAdminOrderStatus = asyncHandler(async (req: Request, res: Response) => {
  const { orderId } = req.params;
  const { status, paymentStatus } = req.body;
  const order = await orderService.updateAdminOrderStatus(req.adminUser!.id, orderId, status, paymentStatus);
  ApiResponseUtil.success(res, order, "Order status updated");
});

export const createAdminOrder = asyncHandler(async (req: Request, res: Response) => {
  const order = await orderService.createAdminOrder(req.adminUser!.id, req.body);
  ApiResponseUtil.success(res, order, "Order created successfully", 201);
});

export const deleteAdminOrder = asyncHandler(async (req: Request, res: Response) => {
  const { orderId } = req.params;
  const result = await orderService.deleteAdminOrder(req.adminUser!.id, orderId);
  ApiResponseUtil.success(res, result, "Order deleted successfully");
});

export const OrderController = {
  checkout,
  listOrders,
  getOrder,
  cancelOrder,
  listAdminOrders,
  getAdminOrder,
  createAdminOrder,
  updateAdminOrderStatus,
  deleteAdminOrder,
};

export default OrderController;