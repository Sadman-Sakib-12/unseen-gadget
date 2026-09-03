import { DEFAULT_PAGE_SIZE, MAX_PAGE_SIZE } from "../constants";
import { BadRequestError } from "./errors";

export interface PaginationParams {
  page: number;
  limit: number;
  skip: number;
  take: number;
}

export function parsePagination(
  query: { page?: unknown; limit?: unknown },
): PaginationParams {
  const rawPage = Number(query.page);
  const rawLimit = Number(query.limit);

  const page = Number.isInteger(rawPage) && rawPage > 0 ? rawPage : 1;
  const requestedLimit = Number.isInteger(rawLimit) && rawLimit > 0 ? rawLimit : DEFAULT_PAGE_SIZE;
  const limit = Math.min(requestedLimit, MAX_PAGE_SIZE);

  if (page < 1 || limit < 1) {
    throw new BadRequestError("Invalid pagination parameters");
  }

  return { page, limit, skip: (page - 1) * limit, take: limit };
}

export function normalizeLimit(limit: number): number {
  if (!Number.isInteger(limit) || limit < 1) return DEFAULT_PAGE_SIZE;
  return Math.min(limit, MAX_PAGE_SIZE);
}

export function normalizePage(page: number): number {
  return Number.isInteger(page) && page > 0 ? page : 1;
}

export const Pagination = {
  parse: parsePagination,
  normalizeLimit,
  normalizePage,
};

export default Pagination;