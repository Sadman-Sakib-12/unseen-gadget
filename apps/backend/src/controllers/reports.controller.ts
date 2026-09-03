import { Request, Response } from "express";
import * as reportsService from "../services/reports.service";
import { ApiResponseUtil } from "../utils/api-response";
import { asyncHandler } from "../utils/async-handler";

export const getSalesReport = asyncHandler(async (_req: Request, res: Response) => {
  const data = await reportsService.getSalesReport();
  ApiResponseUtil.success(res, data);
});

export const getPurchaseReport = asyncHandler(async (_req: Request, res: Response) => {
  const data = await reportsService.getPurchaseReport();
  ApiResponseUtil.success(res, data);
});

export const getProfitReport = asyncHandler(async (_req: Request, res: Response) => {
  const data = await reportsService.getProfitReport();
  ApiResponseUtil.success(res, data);
});

export const getExpenseReport = asyncHandler(async (_req: Request, res: Response) => {
  const data = await reportsService.getExpenseReport();
  ApiResponseUtil.success(res, data);
});

export const ReportsController = {
  getSalesReport,
  getPurchaseReport,
  getProfitReport,
  getExpenseReport,
};

export default ReportsController;
