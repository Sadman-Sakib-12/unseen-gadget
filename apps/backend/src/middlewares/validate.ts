import type { NextFunction, Request, RequestHandler, Response } from "express";
import { ZodError, type ZodSchema } from "zod";
import { ValidationError } from "../utils/errors";

export type ValidationSource = "body" | "query" | "params";

export interface FieldError {
  field: string;
  message: string;
}

export function formatZodError(error: ZodError): FieldError[] {
  return error.issues.map((issue) => ({
    field: issue.path.join(".") || "root",
    message: issue.message,
  }));
}

export function validate(
  schema: ZodSchema,
  source: ValidationSource = "body",
): RequestHandler {
  return (req: Request, _res: Response, next: NextFunction) => {
    const raw = (req as unknown as Record<string, unknown>)[source];
    const result = schema.safeParse(raw);

    if (!result.success) {
      next(new ValidationError("Validation failed", formatZodError(result.error)));
      return;
    }

    req.validated = { ...req.validated, [source]: result.data };
    next();
  };
}

export const validateBody = (schema: ZodSchema): RequestHandler =>
  validate(schema, "body");

export const validateQuery = (schema: ZodSchema): RequestHandler =>
  validate(schema, "query");

export const validateParams = (schema: ZodSchema): RequestHandler =>
  validate(schema, "params");

export default validate;
