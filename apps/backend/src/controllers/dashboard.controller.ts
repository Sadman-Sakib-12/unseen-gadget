import { Request, Response } from "express";
import * as dashboardService from "../services/dashboard.service";
import { ApiResponseUtil } from "../utils/api-response";
import { asyncHandler } from "../utils/async-handler";

export const getDashboardAll = asyncHandler(async (_req: Request, res: Response) => {
  const data = await dashboardService.getDashboardAll();
  ApiResponseUtil.success(res, data);
});

export const getDashboardStats = asyncHandler(async (_req: Request, res: Response) => {
  const stats = await dashboardService.getDashboardStats();
  ApiResponseUtil.success(res, stats);
});

export const getSalesOverview = asyncHandler(async (_req: Request, res: Response) => {
  const data = await dashboardService.getSalesOverview();
  ApiResponseUtil.success(res, data);
});

export const getSalesTrend = asyncHandler(async (_req: Request, res: Response) => {
  const data = await dashboardService.getSalesTrend();
  ApiResponseUtil.success(res, data);
});

export const getSalesByChannel = asyncHandler(async (_req: Request, res: Response) => {
  const data = await dashboardService.getSalesByChannel();
  ApiResponseUtil.success(res, data);
});

export const getRecentOrders = asyncHandler(async (_req: Request, res: Response) => {
  const data = await dashboardService.getRecentOrders();
  ApiResponseUtil.success(res, data);
});

export const getTopSellingProducts = asyncHandler(async (_req: Request, res: Response) => {
  const data = await dashboardService.getTopSellingProducts();
  ApiResponseUtil.success(res, data);
});

export const getLowStockProducts = asyncHandler(async (_req: Request, res: Response) => {
  const data = await dashboardService.getLowStockProducts();
  ApiResponseUtil.success(res, data);
});

export const DashboardController = {
  getDashboardAll,
  getDashboardStats,
  getSalesOverview,
  getSalesTrend,
  getSalesByChannel,
  getRecentOrders,
  getTopSellingProducts,
  getLowStockProducts,
};

export default DashboardController;
