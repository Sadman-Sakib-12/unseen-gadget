import { z } from "zod";
import { ValidationError } from "../utils/errors";
import type { Request, Response, NextFunction } from "express";

export const createPaymentSchema = z.object({
  orderId: z.string().min(1, "Order ID is required"),
  customerName: z.string().min(1, "Customer name is required").max(100),
  amount: z.number().int("Amount must be an integer").positive("Amount must be positive"),
  method: z.enum(["bKash", "Nagad"]),
  transactionId: z.string().min(1, "Transaction ID is required").max(100),
});

export const approveRejectPaymentSchema = z.object({
  reason: z.string().optional(),
});

export function createPaymentValidation() {
  return (req: Request, _res: Response, next: NextFunction) => {
    const result = createPaymentSchema.safeParse(req.body);

    if (!result.success) {
      next(
        new ValidationError(
          "Validation failed",
          result.error.issues.map((issue) => ({
            field: issue.path.join(".") || "root",
            message: issue.message,
          }))
        )
      );
      return;
    }

    req.validated = { ...req.validated, body: result.data };
    next();
  };
}

export function validateApproveRejectValidation() {
  return (req: Request, _res: Response, next: NextFunction) => {
    const result = approveRejectPaymentSchema.safeParse(req.body);

    if (!result.success) {
      next(
        new ValidationError(
          "Validation failed",
          result.error.issues.map((issue) => ({
            field: issue.path.join(".") || "root",
            message: issue.message,
          }))
        )
      );
      return;
    }

    req.validated = { ...req.validated, body: result.data };
    next();
  };
}
