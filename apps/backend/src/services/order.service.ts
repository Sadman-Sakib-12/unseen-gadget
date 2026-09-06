import { prisma } from "@unseen-gadget/database";
import { NotFoundError, BadRequestError, ConflictError } from "../utils/errors";
import { sendMail, renderOrderConfirmationEmail } from "./email.service";

enum StockMovementType {
  IN = "IN",
  OUT = "OUT",
  ADJUSTMENT = "ADJUSTMENT",
}

function mapPaymentMethod(paymentMethod: string): "CARD" | "MOBILE_BANKING" | "CASH_ON_DELIVERY" | "BANK_TRANSFER" {
  switch (paymentMethod) {
    case "COD":
      return "CASH_ON_DELIVERY";
    case "BKASH":
      return "MOBILE_BANKING";
    case "NAGAD":
      return "BANK_TRANSFER";
    case "SSLCOMMERZ":
      return "CARD";
    default:
      return "CASH_ON_DELIVERY";
  }
}

export async function checkout(userId: string | null | undefined, orderData: {
  customerName: string;
  customerEmail?: string;
  customerPhone: string;
  shippingAddress: string;
  paymentMethod: string;
  items: { productId: string; variantId?: string; quantity: number; price: number }[];
  couponCode?: string;
}) {
  const { customerName, customerEmail, customerPhone, shippingAddress, paymentMethod, items, couponCode } = orderData;
  const prismaPaymentMethod = mapPaymentMethod(paymentMethod);

  // Extract unique product IDs and validate
  const productIds = [...new Set(items.map((item) => item.productId))];

  // Find all active products along with their variants
  const products = await prisma.product.findMany({
    where: { id: { in: productIds }, status: "ACTIVE" },
    include: { variants: true },
  });

  if (products.length !== productIds.length) {
    throw new NotFoundError("One or more products not found or not active");
  }

  // Validate existence of variants and requested quantities
  for (const item of items) {
    const product = products.find((p) => p.id === item.productId);
    if (!product) {
      throw new NotFoundError(`Product ${item.productId} not found`);
    }
    if (item.variantId) {
      const variant = product.variants.find((v) => v.id === item.variantId);
      if (!variant) {
        throw new NotFoundError(`Variant ${item.variantId} not found for product "${product.name}"`);
      }
    }
  }

  // Calculate subtotal from authoritative product/variant prices (price snapshots)
  const subtotal = items.reduce((sum, item) => {
    const product = products.find((p) => p.id === item.productId)!;
    const variant = item.variantId ? product.variants.find((v) => v.id === item.variantId) : null;
    const price = variant?.price ?? product.price;
    return sum + price * item.quantity;
  }, 0);

  // Authoritative shipping cost calculation:
  // - Free shipping product -> 0
  // - Paid shipping product -> product.shippingCost
  // - Multiple quantities of the same product -> charged ONCE
  // - Multiple unique paid products -> sum of each unique product's shippingCost
  const uniqueProductShippingMap = new Map<string, number>();
  for (const item of items) {
    const product = products.find((p) => p.id === item.productId)!;
    if (product.shippingType === "PAID" && product.shippingCost > 0) {
      uniqueProductShippingMap.set(product.id, product.shippingCost);
    }
  }
  const baseShippingCost = Array.from(uniqueProductShippingMap.values()).reduce(
    (sum, cost) => sum + cost,
    0
  );

  const isPaid = items.some(
    (item) => products.find((p) => p.id === item.productId)?.shippingType === "PAID"
  );

  let shippingCost = 0;
  if (baseShippingCost > 0 || isPaid) {
    const isOutsideDhaka =
      /outside dhaka/i.test(shippingAddress) ||
      (orderData as any).deliveryZone === "outside-dhaka";

    const base = baseShippingCost > 0 ? baseShippingCost : 60;
    shippingCost = isOutsideDhaka ? base + 50 : base;
  }

  // Coupon verification and discount calculation
  let appliedCoupon: any = null;
  let discountAmount = 0;
  if (couponCode && couponCode.trim()) {
    const trimmedCode = couponCode.trim();
    const coupon = await prisma.coupon.findFirst({
      where: { code: trimmedCode, status: "ACTIVE" },
    });
    if (!coupon) {
      throw new BadRequestError("Invalid or inactive coupon code");
    }
    const now = new Date();
    if (coupon.expiryDate && new Date(coupon.expiryDate) < now) {
      throw new BadRequestError("Coupon has expired");
    }
    if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
      throw new BadRequestError("Coupon usage limit reached");
    }
    if (coupon.minimumOrder && subtotal < coupon.minimumOrder) {
      throw new BadRequestError(
        `Minimum order amount for coupon "${trimmedCode}" is BDT ${coupon.minimumOrder}`
      );
    }
    if (coupon.discountType === "PERCENTAGE") {
      discountAmount = Math.round((coupon.discountValue / 100) * subtotal);
    } else if (coupon.discountType === "FIXED") {
      discountAmount = coupon.discountValue;
    }
    if (coupon.maximumDiscount != null) {
      discountAmount = Math.min(discountAmount, coupon.maximumDiscount);
    }
    discountAmount = Math.min(discountAmount, subtotal);
    appliedCoupon = coupon;
  }

  // Separate and consolidate demand by inventory target:
  // - If variantId is present, the actual inventory source is the ProductVariant
  // - If variantId is absent, the actual inventory source is the Product
  const variantDemands = new Map<string, { productId: string; quantity: number }>();
  const productDemands = new Map<string, number>();

  for (const item of items) {
    if (item.variantId) {
      const existing = variantDemands.get(item.variantId);
      variantDemands.set(item.variantId, {
        productId: item.productId,
        quantity: (existing?.quantity || 0) + item.quantity,
      });
    } else {
      productDemands.set(
        item.productId,
        (productDemands.get(item.productId) || 0) + item.quantity
      );
    }
  }

  // Sort demands deterministically by ID to prevent deadlocks in concurrent multi-item transactions
  const sortedVariantDemands = Array.from(variantDemands.entries()).sort((a, b) =>
    a[0].localeCompare(b[0])
  );
  const sortedProductDemands = Array.from(productDemands.entries()).sort((a, b) =>
    a[0].localeCompare(b[0])
  );

  const order = await prisma.$transaction(async (tx) => {
    // 1. ATOMIC STOCK DEDUCTION (Database-Level Conditional Updates)
    // -------------------------------------------------------------
    // A) For variant items: atomically decrement ProductVariant.stock where stock >= demanded quantity
    for (const [variantId, { productId, quantity }] of sortedVariantDemands) {
      const variantResult = await tx.productVariant.updateMany({
        where: {
          id: variantId,
          productId,
          stock: { gte: quantity },
        },
        data: {
          stock: { decrement: quantity },
        },
      });

      if (variantResult.count === 0) {
        const product = products.find((p) => p.id === productId);
        const variantObj = product?.variants.find((v) => v.id === variantId);
        const variantName = variantObj ? ` (${variantObj.name})` : "";
        throw new ConflictError(
          `Insufficient stock for product variant${variantName}. The item is out of stock.`
        );
      }

      // Check if all variants for this product are now out of stock; if so, sync inStock = false
      const remainingActiveVariants = await tx.productVariant.count({
        where: {
          productId,
          stock: { gt: 0 },
        },
      });

      if (remainingActiveVariants === 0) {
        await tx.product.updateMany({
          where: { id: productId },
          data: { inStock: false },
        });
      }
    }

    // B) For non-variant items: atomically decrement Product.stock where stock >= demanded quantity
    for (const [productId, quantity] of sortedProductDemands) {
      const product = products.find((p) => p.id === productId)!;

      const productResult = await tx.product.updateMany({
        where: {
          id: productId,
          stock: { gte: quantity },
          status: "ACTIVE",
        },
        data: {
          stock: { decrement: quantity },
        },
      });

      if (productResult.count === 0) {
        throw new ConflictError(
          `Insufficient stock for product "${product.name}". The requested item is out of stock.`
        );
      }

      // Automatically update inStock to false if product stock reaches 0 or below
      await tx.product.updateMany({
        where: {
          id: productId,
          stock: { lte: 0 },
        },
        data: {
          inStock: false,
        },
      });
    }

    // 2. CREATE ORDER
    // -------------------------------------------------------------
    const total = Math.max(0, subtotal + shippingCost - discountAmount);

    const newOrder = await tx.order.create({
      data: {
        userId: userId || null,
        customerName,
        customerEmail: customerEmail || null,
        customerPhone,
        shippingAddress,
        status: "PENDING",
        subtotal,
        discount: discountAmount,
        shippingCost,
        total,
        couponId: appliedCoupon ? appliedCoupon.id : null,
        paymentMethod: prismaPaymentMethod,
      },
    });

    if (appliedCoupon) {
      await tx.coupon.update({
        where: { id: appliedCoupon.id },
        data: {
          usedCount: { increment: 1 },
        },
      });
    }

    // 3. CREATE ORDER ITEMS & STOCK MOVEMENTS
    // -------------------------------------------------------------
    for (const item of items) {
      const product = products.find((p) => p.id === item.productId)!;
      const variant = item.variantId ? product.variants.find((v) => v.id === item.variantId) : null;
      const price = variant?.price ?? product.price;

      await tx.orderItem.create({
        data: {
          orderId: newOrder.id,
          productId: product.id,
          productName: product.name,
          variantId: item.variantId || null,
          price,
          quantity: item.quantity,
          total: price * item.quantity,
        },
      });

      // Log stock movement (OUT = stock deduction due to order) inside the transaction
      await tx.stockMovement.create({
        data: {
          productId: product.id,
          productName: variant ? `${product.name} - ${variant.name}` : product.name,
          type: StockMovementType.OUT,
          quantity: item.quantity,
          reference: newOrder.id,
          note: `Stock deduction for order ${newOrder.id}`,
        },
      });
    }

    // 4. CREATE ORDER STATUS LOG
    // -------------------------------------------------------------
    await tx.orderStatusLog.create({
      data: {
        orderId: newOrder.id,
        status: "PENDING",
        note: "Order created",
      },
    });

    // 5. CREATE INITIAL PAYMENT RECORD
    // -------------------------------------------------------------
    const txnId = `${paymentMethod.toUpperCase()}-${Date.now().toString().slice(-6)}`;
    await tx.payment.create({
      data: {
        orderId: newOrder.id,
        customerName,
        amount: total,
        method: prismaPaymentMethod,
        status: "PENDING",
        transactionId: txnId,
      },
    });

    return newOrder;
  });

  // Asynchronously send order confirmation email
  const targetEmail = customerEmail || (userId ? (await prisma.user.findUnique({ where: { id: userId } }))?.email : undefined);
  if (targetEmail && order) {
    try {
      const orderSummaryItems = items.map((it) => {
        const prod = products.find((p) => p.id === it.productId);
        return {
          name: prod?.name || "Gadget Item",
          price: prod?.price || it.price,
          quantity: it.quantity,
        };
      });

      const emailContent = renderOrderConfirmationEmail(
        order.id,
        customerName,
        order.total,
        orderSummaryItems
      );

      await sendMail({
        to: targetEmail,
        ...emailContent,
      });
    } catch (mailErr) {
      console.error("[Order] Failed to send order confirmation email:", mailErr);
    }
  }

  return order;
}

export async function listOrders(userId: string) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  const userEmail = user?.email;
  const userPhone = user?.phone;

  const orConditions: any[] = [{ userId }];
  if (userEmail) {
    orConditions.push({ customerEmail: userEmail });
  }
  if (userPhone) {
    orConditions.push({ customerPhone: userPhone });
  }

  const orders = await prisma.order.findMany({
    where: {
      OR: orConditions,
    },
    include: {
      items: {
        include: {
          product: {
            select: {
              id: true,
              name: true,
              slug: true,
              images: true,
            },
          },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return orders;
}

export async function getOrder(userId: string, orderId: string) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  const userEmail = user?.email;
  const userPhone = user?.phone;

  const orConditions: any[] = [{ userId }];
  if (userEmail) {
    orConditions.push({ customerEmail: userEmail });
  }
  if (userPhone) {
    orConditions.push({ customerPhone: userPhone });
  }

  const order = await prisma.order.findFirst({
    where: {
      id: orderId,
      OR: orConditions,
    },
    include: {
      items: {
        include: {
          product: {
            select: {
              id: true,
              name: true,
              slug: true,
              images: true,
            },
          },
        },
      },
      statusLogs: {
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!order) {
    throw new NotFoundError("Order not found or access denied");
  }

  return order;
}

export async function cancelOrder(userId: string, orderId: string) {
  const order = await prisma.order.findFirst({
    where: { id: orderId, userId },
  });

  if (!order) {
    throw new NotFoundError("Order not found or access denied");
  }

  if (order.status === "DELIVERED" || order.status === "CANCELLED" || order.status === "REFUNDED") {
    throw new BadRequestError(`Cannot cancel order with status: ${order.status}`);
  }

  // Restock and create movement records
  const restorationMovements = await prisma.$transaction(async (tx) => {
    // Find all order items to restore stock (filter out null productIds)
    const orderItems = await tx.orderItem.findMany({
      where: { orderId: order.id, productId: { not: null } },
      select: { productId: true, variantId: true, quantity: true, productName: true },
    });

    // Restock and create movement records
    for (const item of orderItems) {
      const productId = item.productId!.replace(/^"|"$/, "");

      if (item.variantId) {
        await tx.productVariant.updateMany({
          where: { id: item.variantId },
          data: { stock: { increment: item.quantity } },
        });
        await tx.product.update({
          where: { id: productId },
          data: { inStock: true },
        });
      } else {
        await tx.product.update({
          where: { id: productId },
          data: {
            stock: { increment: item.quantity },
            inStock: true,
          },
        });
      }

      await tx.stockMovement.create({
        data: {
          productId: productId,
          productName: item.productName,
          type: StockMovementType.IN,
          quantity: item.quantity,
          reference: order.id,
          note: `Stock restoration for cancelled order ${order.id}`,
        },
      });
    }

    // Update order status
    const cancelledOrder = await tx.order.update({
      where: { id: order.id },
      data: { status: "CANCELLED" },
    });

    return { cancelledOrder, restorationMovements: orderItems.length };
  });

  return restorationMovements.cancelledOrder;
}

export async function listAdminOrders() {
  const orders = await prisma.order.findMany({
    select: {
      id: true,
      userId: true,
      customerName: true,
      customerEmail: true,
      customerPhone: true,
      shippingAddress: true,
      city: true,
      status: true,
      paymentMethod: true,
      paymentStatus: true,
      subtotal: true,
      discount: true,
      shippingCost: true,
      total: true,
      note: true,
      items: {
        select: {
          id: true,
          productId: true,
          productName: true,
          variantId: true,
          quantity: true,
          price: true,
          total: true,
        },
      },
      coupon: {
        select: { code: true, discountValue: true },
      },
      statusLogs: {
        select: { status: true, note: true, createdAt: true },
        orderBy: { createdAt: "desc" },
      },
      createdAt: true,
      updatedAt: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return orders;
}

export async function getAdminOrder(adminId: string, orderId: string) {
  (adminId); // Suppress unused parameter warning
  const order = await prisma.order.findFirst({
    where: { id: orderId },
    select: {
      id: true,
      userId: true,
      customerName: true,
      customerEmail: true,
      customerPhone: true,
      shippingAddress: true,
      city: true,
      status: true,
      paymentMethod: true,
      paymentStatus: true,
      subtotal: true,
      discount: true,
      shippingCost: true,
      total: true,
      couponId: true,
      coupon: {
        select: { code: true, discountValue: true },
      },
      note: true,
      items: {
        select: {
          id: true,
          productId: true,
          productName: true,
          variantId: true,
          quantity: true,
          price: true,
          total: true,
        },
      },
      statusLogs: {
        select: { status: true, note: true, createdAt: true },
        orderBy: { createdAt: "desc" },
      },
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!order) {
    throw new NotFoundError("Order not found");
  }

  return order;
}

export async function createAdminOrder(adminId: string, data: {
  customerName: string;
  email?: string;
  customerEmail?: string;
  phone?: string;
  customerPhone?: string;
  city?: string;
  shippingAddress?: string;
  product?: string;
  quantity?: number;
  price?: number;
  status?: "PENDING" | "CONFIRMED" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED" | "REFUNDED";
  paymentStatus?: "PENDING" | "PAID" | "FAILED" | "REFUNDED";
}) {
  (adminId);
  const customerEmail = data.email || data.customerEmail || undefined;
  const customerPhone = data.phone || data.customerPhone || "N/A";
  const shippingAddress = data.shippingAddress || "N/A";
  const productName = data.product || "Custom Product";
  const quantity = Math.max(1, Number(data.quantity) || 1);
  const price = Math.max(0, Number(data.price) || 0);
  const total = price * quantity;
  const subtotal = total;
  const status = (data.status as "PENDING") || "PENDING";
  const paymentStatus = (data.paymentStatus as "PENDING") || "PENDING";

  const order = await prisma.$transaction(async (tx) => {
    const newOrder = await tx.order.create({
      data: {
        customerName: data.customerName,
        customerEmail,
        customerPhone,
        shippingAddress,
        city: data.city,
        status,
        paymentStatus,
        subtotal,
        discount: 0,
        shippingCost: 0,
        total,
      },
    });

    await tx.orderItem.create({
      data: {
        orderId: newOrder.id,
        productName,
        quantity,
        price,
        total,
      },
    });

    await tx.orderStatusLog.create({
      data: {
        orderId: newOrder.id,
        status,
        note: "Order created manually by admin",
      },
    });

    return tx.order.findUnique({
      where: { id: newOrder.id },
      include: {
        items: true,
        coupon: true,
        statusLogs: true,
      },
    });
  });

  return order;
}

export async function updateAdminOrderStatus(
  adminId: string,
  orderId: string,
  status?: string,
  paymentStatus?: string
) {
  (adminId);
  const dataToUpdate: Record<string, any> = {};

  if (status) {
    const validStatuses = ["PENDING", "CONFIRMED", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED", "REFUNDED"];
    if (validStatuses.includes(status.toUpperCase())) {
      dataToUpdate.status = status.toUpperCase();
    }
  }

  if (paymentStatus) {
    const validPaymentStatuses = ["PENDING", "APPROVED", "PAID", "REJECTED", "FAILED", "REFUNDED"];
    if (validPaymentStatuses.includes(paymentStatus.toUpperCase())) {
      const normalizedPaymentStatus = paymentStatus.toUpperCase();
      dataToUpdate.paymentStatus = normalizedPaymentStatus;
      await prisma.payment.updateMany({
        where: { orderId },
        data: {
          status: normalizedPaymentStatus === "PAID" ? "APPROVED" : (normalizedPaymentStatus as any),
        },
      }).catch(() => {});
    }
  }

  if (Object.keys(dataToUpdate).length === 0) {
    throw new BadRequestError("No valid status or paymentStatus provided");
  }

  const order = await prisma.order.update({
    where: { id: orderId },
    data: dataToUpdate,
    include: {
      items: true,
      coupon: true,
      statusLogs: true,
    },
  });

  if (status || paymentStatus) {
    await prisma.orderStatusLog.create({
      data: {
        orderId: order.id,
        status: order.status,
        note: `Updated by admin${status ? ` [Order: ${status}]` : ""}${paymentStatus ? ` [Payment: ${paymentStatus}]` : ""}`,
      },
    });
  }

  return order;
}

export async function deleteAdminOrder(_adminId: string, orderId: string) {
  const existing = await prisma.order.findUnique({ where: { id: orderId } });
  if (!existing) {
    throw new NotFoundError("Order not found");
  }

  await prisma.$transaction([
    prisma.orderStatusLog.deleteMany({ where: { orderId } }),
    prisma.payment.deleteMany({ where: { orderId } }),
    prisma.delivery.deleteMany({ where: { orderId } }),
    prisma.return.deleteMany({ where: { orderId } }),
    prisma.orderItem.deleteMany({ where: { orderId } }),
    prisma.order.delete({ where: { id: orderId } }),
  ]);

  return { success: true, message: "Order deleted successfully" };
}