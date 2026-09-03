import { prisma } from "@unseen-gadget/database";
import { NotFoundError, BadRequestError, ConflictError } from "../utils/errors";
import { randomBytes } from "crypto";

export interface CreatePaymentInput {
  orderId: string;
  customerName: string;
  amount: number;
  method: "bKash" | "Nagad";
}

export interface PaymentFilters {
  status?: string;
  method?: string;
  customerName?: string;
}

export async function createPayment(input: CreatePaymentInput) {
  const { orderId, customerName, amount, method } = input;

  // Validate method
  if (method !== "bKash" && method !== "Nagad") {
    throw new BadRequestError("Invalid payment method");
  }

  // Authoritative Order lookup from database
  const order = await prisma.order.findFirst({
    where: { id: orderId },
  });

  if (!order) {
    throw new NotFoundError("Order not found");
  }

  // Strict security check: prevent user from sending lower/tampered amount
  if (amount !== undefined && order.total !== amount) {
    throw new BadRequestError(
      `Amount mismatch: order total is ${order.total}, received ${amount}`,
    );
  }

  // Payment amount is ALWAYS authoritatively taken from order.total
  const authoritativeAmount = order.total;

  // Map method string to PaymentMethod enum
  const methodMap: Record<
    "bKash" | "Nagad",
    "CARD" | "MOBILE_BANKING" | "CASH_ON_DELIVERY" | "BANK_TRANSFER"
  > = {
    bKash: "MOBILE_BANKING",
    Nagad: "BANK_TRANSFER",
  };

  const prismaMethod = methodMap[method];

  // Check if payment already exists for this order
  const existing = await prisma.payment.findFirst({
    where: { orderId },
  });

  if (existing) {
    if (existing.status === "PAID") {
      throw new ConflictError("Payment already completed for this order");
    }
    // Update existing pending payment with authoritative order.total and method
    const updated = await prisma.payment.update({
      where: { id: existing.id },
      data: {
        amount: authoritativeAmount,
        method: prismaMethod,
        customerName: customerName || existing.customerName,
      },
    });
    return updated;
  }

  const txnId = `${method.toUpperCase()}-${randomBytes(8).toString("hex")}`;

  const payment = await prisma.payment.create({
    data: {
      orderId,
      customerName,
      amount: authoritativeAmount,
      method: prismaMethod,
      status: "PENDING",
      transactionId: txnId,
    },
  });

  return payment;
}

export async function getPayment(paymentId: string, userId?: string) {
  const payment = await prisma.payment.findFirst({
    where: { id: paymentId },
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
    throw new NotFoundError("Payment not found");
  }

  if (userId && payment.order?.userId !== userId) {
    throw new NotFoundError("Payment not found or access denied");
  }

  return payment;
}

export async function getPayments(filters: PaymentFilters = {}, page = 1, limit = 10) {
  const where: Record<string, unknown> = {};

  if (filters.status) {
    where.status = filters.status;
  }

  if (filters.method) {
    where.method = filters.method;
  }

  if (filters.customerName) {
    where.customerName = {
      contains: filters.customerName,
      mode: "insensitive" as const,
    };
  }

  const skip = (page - 1) * limit;

  const [payments, total] = await Promise.all([
    prisma.payment.findMany({
      where,
      include: {
        order: {
          select: {
            id: true,
            customerName: true,
            status: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    }),
    prisma.payment.count({ where }),
  ]);

  return {
    payments,
    total,
    page,
    pages: Math.ceil(total / limit),
  };
}

export async function approvePayment(paymentId: string, _adminId?: string) {
  // Use Prisma transaction for atomicity
  const result = await prisma.$transaction(async (tx) => {
    // Get the payment with order info
    const payment = await tx.payment.findFirst({
      where: { id: paymentId },
      include: {
        order: {
          select: {
            id: true,
            paymentStatus: true,
            status: true,
            userId: true,
          },
        },
      },
    });

    if (!payment) {
      throw new NotFoundError("Payment not found");
    }

    // Prevent modifying already approved/rejected payment
    if (payment.status !== "PENDING") {
      throw new BadRequestError(
        `Cannot ${payment.status.toLowerCase()} an already ${payment.status.toLowerCase()} payment`,
      );
    }

    // Approve the payment
    const updatedPayment = await tx.payment.update({
      where: { id: paymentId },
      data: { status: "APPROVED" as const },
    });

    // Update order paymentStatus to PAID and mark as confirmed
    const updatedOrder = await tx.order.update({
      where: { id: payment.orderId },
      data: {
        paymentStatus: "PAID",
        status: "CONFIRMED",
      },
    });

    // Create status log for payment approval
    await tx.orderStatusLog.create({
      data: {
        orderId: payment.orderId,
        status: "CONFIRMED",
        note: "Payment approved",
      },
    });

    return { updatedPayment, updatedOrder };
  });

  return result;
}

export async function rejectPayment(paymentId: string, _adminId?: string, _reason?: string) {
  const result = await prisma.$transaction(async (tx) => {
    // Get the payment with order info
    const payment = await tx.payment.findFirst({
      where: { id: paymentId },
      include: {
        order: {
          select: {
            id: true,
            paymentStatus: true,
            status: true,
          },
        },
      },
    });

    if (!payment) {
      throw new NotFoundError("Payment not found");
    }

    // Prevent modifying already approved/rejected payment
    if (payment.status !== "PENDING") {
      throw new BadRequestError(
        `Cannot reject an already ${payment.status.toLowerCase()} payment`,
      );
    }

    // Reject the payment
    const updatedPayment = await tx.payment.update({
      where: { id: paymentId },
      data: { status: "REJECTED" as const },
    });

    // Order paymentStatus stays PENDING, no change needed

    return { rejectedPayment: updatedPayment };
  });

  return result;
}

export async function validateTransactionId(method: string, transactionId: string) {
  if (!transactionId || transactionId.trim() === "") {
    throw new BadRequestError("Transaction ID is required");
  }

  // Basic format validation
  if (method === "bKash" && !transactionId.startsWith("BKASH")) {
    throw new BadRequestError("Invalid bKash transaction ID format");
  }

  if (method === "Nagad" && !transactionId.startsWith("NAGAD")) {
    throw new BadRequestError("Invalid Nagad transaction ID format");
  }

  // Check for duplicate transaction ID
  const existing = await prisma.payment.findFirst({
    where: { transactionId },
  });

  if (existing) {
    throw new ConflictError("Transaction ID already exists");
  }

  return true;
}