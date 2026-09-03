import { Request, Response, NextFunction } from "express";
import { prisma } from "@unseen-gadget/database";
import {
  createPaymentValidation,
  validateApproveRejectValidation,
} from "../validations/payment.validations";
import {
  createPayment,
  getPayment,
  getPayments,
  approvePayment,
  rejectPayment,
  validateTransactionId,
} from "../services/payment.service";

export async function customerCreatePayment(req: Request, res: Response, next: NextFunction) {
  try {
    createPaymentValidation()(req, res, async () => {
      const { orderId, customerName, amount, method, transactionId } = req.validated.body as {
        orderId: string;
        customerName: string;
        amount: number;
        method: "bKash" | "Nagad";
        transactionId: string;
      };

      await validateTransactionId(method, transactionId);

      const payment = await createPayment({
        orderId,
        customerName,
        amount,
        method,
      });

      const updatedPayment = await prisma.payment.update({
        where: { id: payment.id },
        data: { transactionId },
      });

      res.status(201).json({
        success: true,
        data: updatedPayment,
        message: "Payment record created. Please submit the transaction ID.",
      });
    });
  } catch (error) {
    next(error);
  }
}

export async function customerGetPayment(req: Request, res: Response, next: NextFunction) {
  try {
    const paymentId = req.params.id;
    const payment = await getPayment(paymentId, req.user?.id);
    res.status(200).json({ success: true, data: payment });
  } catch (error) {
    next(error);
  }
}

export async function customerGetOrderPayment(req: Request, res: Response, next: NextFunction) {
  try {
    const orderId = req.params.orderId;

    if (!req.user?.id) {
      throw new Error("Unauthenticated");
    }

    const payment = await prisma.payment.findFirst({
      where: { orderId },
      include: {
        order: {
          select: {
            id: true,
            customerName: true,
            status: true,
            total: true,
            userId: true,
          },
        },
      },
    });

    if (!payment) {
      return res.status(404).json({
        success: false,
        error: "Payment not found for this order",
      });
    }

    if (payment.order?.userId !== req.user.id) {
      throw new Error("Access denied: payment belongs to another order");
    }

    res.status(200).json({ success: true, data: payment });
  } catch (error) {
    next(error);
  }
}

export async function adminGetPaymentsList(req: Request, res: Response, next: NextFunction) {
  try {
    const filters: Record<string, unknown> = {};
    if (req.query.status) filters.status = req.query.status as string;
    if (req.query.method) filters.method = req.query.method as string;
    if (req.query.customerName) filters.customerName = req.query.customerName as string;

    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const result = await getPayments(filters, page, limit);
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
}

export async function adminGetPaymentDetail(req: Request, res: Response, next: NextFunction) {
  try {
    const paymentId = req.params.id;
    const payment = await getPayment(paymentId);
    res.status(200).json({ success: true, data: payment });
  } catch (error) {
    next(error);
  }
}

export async function adminApprovePayment(req: Request, res: Response, next: NextFunction) {
  try {
    validateApproveRejectValidation()(req, res, async () => {
      const paymentId = req.params.id;
      const result = await approvePayment(paymentId, req.adminUser!.id);
      res.status(200).json({
        success: true,
        data: result.updatedPayment,
        message: "Payment approved successfully",
      });
    });
  } catch (error) {
    next(error);
  }
}

export async function adminRejectPayment(req: Request, res: Response, next: NextFunction) {
  try {
    validateApproveRejectValidation()(req, res, async () => {
      const paymentId = req.params.id;
      const result = await rejectPayment(paymentId, req.adminUser!.id);
      res.status(200).json({
        success: true,
        data: result.rejectedPayment,
        message: "Payment rejected successfully",
      });
    });
  } catch (error) {
    next(error);
  }
}
