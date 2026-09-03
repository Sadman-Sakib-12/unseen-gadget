import type { Response } from "express";
import type { ApiResponse, PaginatedResponse } from "@unseen-gadget/types";

export function sendSuccess<T>(
  res: Response,
  data?: T,
  message?: string,
  status = 200,
): Response {
  const body: ApiResponse<T> = { success: true };
  if (data !== undefined) body.data = data;
  if (message) body.message = message;
  return res.status(status).json(body);
}

export function sendCreated<T>(res: Response, data?: T, message?: string): Response {
  return sendSuccess(res, data, message, 201);
}

export function sendNoContent(res: Response): Response {
  return res.status(204).send();
}

export function sendError(
  res: Response,
  status: number,
  error: string,
  message?: string,
): Response {
  const body: ApiResponse = { success: false, error };
  if (message) body.message = message;
  return res.status(status).json(body);
}

export function sendPaginated<T>(
  res: Response,
  data: T[],
  total: number,
  page: number,
  limit: number,
): Response {
  const body: PaginatedResponse<T> = {
    success: true,
    data,
    total,
    page,
    limit,
    totalPages: limit > 0 ? Math.ceil(total / limit) : 0,
  };
  return res.status(200).json(body);
}

export const ApiResponseUtil = {
  success: sendSuccess,
  created: sendCreated,
  noContent: sendNoContent,
  error: sendError,
  paginated: sendPaginated,
};

export default ApiResponseUtil;