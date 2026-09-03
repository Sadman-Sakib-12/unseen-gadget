import type { Request, Response } from "express";
import { prisma } from "@unseen-gadget/database";
import { ApiResponseUtil } from "../utils/api-response";
import { BadRequestError, ConflictError, NotFoundError } from "../utils/errors";
import { asyncHandler } from "../utils/async-handler";
import type { z } from "zod";
import type {
  supplierCreateSchema,
  supplierUpdateSchema,
  supplierTransactionCreateSchema,
  purchaseCreateSchema,
  purchaseUpdateSchema,
  inventoryUpdateSchema,
  stockMovementCreateSchema,
} from "../validations/ops.validations";

type SupplierCreate = z.infer<typeof supplierCreateSchema>;
type SupplierUpdate = z.infer<typeof supplierUpdateSchema>;
type SupplierTransactionCreate = z.infer<typeof supplierTransactionCreateSchema>;
type PurchaseCreate = z.infer<typeof purchaseCreateSchema>;
type PurchaseUpdate = z.infer<typeof purchaseUpdateSchema>;
type InventoryUpdate = z.infer<typeof inventoryUpdateSchema>;
type StockMovementCreate = z.infer<typeof stockMovementCreateSchema>;

// ===================== Suppliers =====================

export const listSuppliers = asyncHandler(async (_req: Request, res: Response) => {
  const suppliers = await prisma.supplier.findMany({
    include: { transactions: { orderBy: { date: "desc" }, take: 5 } },
    orderBy: { createdAt: "desc" },
  });
  ApiResponseUtil.success(res, suppliers);
});

export const getSupplier = asyncHandler(async (req: Request, res: Response) => {
  const supplier = await prisma.supplier.findUnique({
    where: { id: req.params.id },
    include: {
      transactions: { orderBy: { date: "desc" } },
      purchases: { orderBy: { createdAt: "desc" }, include: { items: true } },
    },
  });
  if (!supplier) throw new NotFoundError("Supplier not found");
  ApiResponseUtil.success(res, supplier);
});

export const createSupplier = asyncHandler(async (req: Request, res: Response) => {
  const body = req.validated.body as SupplierCreate;
  const supplier = await prisma.supplier.create({
    data: {
      name: body.name,
      phone: body.phone,
      email: body.email || undefined,
      address: body.address,
      company: body.company,
      dueAmount: body.dueAmount ?? 0,
      status: body.status ?? "ACTIVE",
    },
  });
  ApiResponseUtil.created(res, supplier, "Supplier created");
});

export const updateSupplier = asyncHandler(async (req: Request, res: Response) => {
  const body = req.validated.body as SupplierUpdate;
  const existing = await prisma.supplier.findUnique({ where: { id: req.params.id } });
  if (!existing) throw new NotFoundError("Supplier not found");
  const supplier = await prisma.supplier.update({
    where: { id: existing.id },
    data: {
      ...(body.name !== undefined ? { name: body.name } : {}),
      ...(body.phone !== undefined ? { phone: body.phone } : {}),
      ...(body.email !== undefined ? { email: body.email || null } : {}),
      ...(body.address !== undefined ? { address: body.address } : {}),
      ...(body.company !== undefined ? { company: body.company } : {}),
      ...(body.dueAmount !== undefined ? { dueAmount: body.dueAmount } : {}),
      ...(body.status !== undefined ? { status: body.status } : {}),
    },
  });
  ApiResponseUtil.success(res, supplier, "Supplier updated");
});

export const deleteSupplier = asyncHandler(async (req: Request, res: Response) => {
  const existing = await prisma.supplier.findUnique({
    where: { id: req.params.id },
    include: { _count: { select: { purchases: true } } },
  });
  if (!existing) throw new NotFoundError("Supplier not found");
  if (existing._count.purchases > 0) {
    throw new ConflictError("Cannot delete a supplier with existing purchase orders");
  }
  await prisma.$transaction([
    prisma.supplierTransaction.deleteMany({ where: { supplierId: existing.id } }),
    prisma.supplier.delete({ where: { id: existing.id } }),
  ]);
  ApiResponseUtil.success(res, { deleted: true }, "Supplier deleted");
});

export const listSupplierTransactions = asyncHandler(async (req: Request, res: Response) => {
  const supplier = await prisma.supplier.findUnique({ where: { id: req.params.id } });
  if (!supplier) throw new NotFoundError("Supplier not found");
  const transactions = await prisma.supplierTransaction.findMany({
    where: { supplierId: supplier.id },
    orderBy: { date: "desc" },
  });
  ApiResponseUtil.success(res, transactions);
});

export const createSupplierTransaction = asyncHandler(async (req: Request, res: Response) => {
  const body = req.validated.body as SupplierTransactionCreate;
  const supplier = await prisma.supplier.findUnique({ where: { id: req.params.id } });
  if (!supplier) throw new NotFoundError("Supplier not found");

  const result = await prisma.$transaction(async (tx) => {
    const transaction = await tx.supplierTransaction.create({
      data: {
        supplierId: supplier.id,
        type: body.type,
        amount: body.amount,
        date: body.date ? new Date(body.date) : new Date(),
        reference: body.reference,
        note: body.note,
      },
    });

    let dueDelta = 0;
    if (body.type === "PURCHASE") dueDelta += body.amount;
    if (body.type === "PAYMENT" || body.type === "REFUND") dueDelta -= body.amount;

    await tx.supplier.update({
      where: { id: supplier.id },
      data: { dueAmount: { increment: dueDelta } },
    });

    return transaction;
  });

  ApiResponseUtil.created(res, result, "Supplier transaction recorded");
});

// ===================== Purchases =====================

async function receivePurchaseStock(purchaseId: string) {
  return prisma.$transaction(async (tx) => {
    const purchase = await tx.purchase.findUniqueOrThrow({
      where: { id: purchaseId },
      include: { items: true, supplier: true },
    });
    if (purchase.status === "RECEIVED") {
      throw new BadRequestError("Purchase has already been received");
    }

    for (const item of purchase.items) {
      if (!item.productId) continue;

      const product = await tx.product.findUnique({ where: { id: item.productId } });
      if (!product) continue;

      await tx.product.update({
        where: { id: item.productId },
        data: {
          stock: { increment: item.quantity },
          inStock: product.stock + item.quantity > 0,
        },
      });

      const warehouse = await tx.warehouse.findFirst();
      const existingInventory = await tx.inventoryItem.findFirst({
        where: { productId: item.productId },
      });
      if (existingInventory) {
        const newStock = existingInventory.stock + item.quantity;
        await tx.inventoryItem.update({
          where: { id: existingInventory.id },
          data: {
            stock: newStock,
            lastRestocked: new Date(),
            status:
              newStock > existingInventory.minStock
                ? "IN_STOCK"
                : newStock <= 0
                  ? "OUT_OF_STOCK"
                  : "LOW_STOCK",
          },
        });
      } else {
        await tx.inventoryItem.create({
          data: {
            productId: item.productId,
            name: item.productName,
            sku: product.sku,
            stock: item.quantity,
            minStock: Math.max(1, Math.floor(item.quantity * 0.2)),
            lastRestocked: new Date(),
            warehouseId: warehouse?.id,
            status: "IN_STOCK",
          },
        });
      }

      await tx.stockMovement.create({
        data: {
          productId: item.productId,
          productName: item.productName,
          type: "IN",
          quantity: item.quantity,
          reference: purchase.invoiceNumber ?? `PO-${purchase.id.slice(-6).toUpperCase()}`,
          note: `Received from ${purchase.supplier.name}`,
        },
      });
    }

    return tx.purchase.update({
      where: { id: purchaseId },
      data: { status: "RECEIVED" },
      include: { items: true, supplier: true },
    });
  });
}

export const listPurchases = asyncHandler(async (_req: Request, res: Response) => {
  const purchases = await prisma.purchase.findMany({
    include: { items: true, supplier: { select: { id: true, name: true, company: true } } },
    orderBy: { createdAt: "desc" },
  });
  ApiResponseUtil.success(res, purchases);
});

export const getPurchase = asyncHandler(async (req: Request, res: Response) => {
  const purchase = await prisma.purchase.findUnique({
    where: { id: req.params.id },
    include: { items: true, supplier: { select: { id: true, name: true, company: true } } },
  });
  if (!purchase) throw new NotFoundError("Purchase not found");
  ApiResponseUtil.success(res, purchase);
});

export const createPurchase = asyncHandler(async (req: Request, res: Response) => {
  const body = req.validated.body as PurchaseCreate;
  const supplier = await prisma.supplier.findUnique({ where: { id: body.supplierId } });
  if (!supplier) throw new NotFoundError("Supplier not found");

  const subtotal = body.items.reduce((s, i) => s + i.quantity * i.unitPrice, 0);
  const total = subtotal - (body.discount ?? 0) + (body.tax ?? 0);
  const dueAmount = total - body.paidAmount;

  const purchase = await prisma.$transaction(async (tx) => {
    const created = await tx.purchase.create({
      data: {
        supplierId: body.supplierId,
        subtotal,
        discount: body.discount ?? 0,
        tax: body.tax ?? 0,
        total,
        paidAmount: body.paidAmount,
        dueAmount,
        invoiceNumber: body.invoiceNumber,
        date: body.date ? new Date(body.date) : new Date(),
        items: {
          create: body.items.map((i) => ({
            productId: i.productId,
            productName: i.productName,
            quantity: i.quantity,
            unitPrice: i.unitPrice,
            total: i.quantity * i.unitPrice,
          })),
        },
      },
      include: { items: true, supplier: true },
    });

    await tx.supplier.update({
      where: { id: body.supplierId },
      data: {
        totalPurchases: { increment: total },
        dueAmount: { increment: Math.max(0, dueAmount) },
      },
    });

    if (body.paidAmount > 0) {
      await tx.supplierTransaction.create({
        data: {
          supplierId: body.supplierId,
          type: "PURCHASE",
          amount: body.paidAmount,
          reference: created.invoiceNumber,
          note: `Payment for purchase ${created.id}`,
        },
      });
    }

    return created;
  });

  const received = await receivePurchaseStock(purchase.id);
  ApiResponseUtil.created(res, received, "Purchase created and stock received");
});

export const updatePurchase = asyncHandler(async (req: Request, res: Response) => {
  const body = req.validated.body as PurchaseUpdate;
  const existing = await prisma.purchase.findUnique({
    where: { id: req.params.id },
    include: { items: true },
  });
  if (!existing) throw new NotFoundError("Purchase not found");
  if (existing.status === "RECEIVED") {
    throw new BadRequestError("Received purchases cannot be edited");
  }

  const mergedItems: Array<{
    productId?: string;
    productName: string;
    quantity: number;
    unitPrice: number;
  }> =
    body.items ??
    existing.items.map((i) => ({
      productId: i.productId ?? undefined,
      productName: i.productName,
      quantity: i.quantity,
      unitPrice: i.unitPrice,
    }));
  const discount = body.discount ?? existing.discount;
  const tax = body.tax ?? existing.tax;
  const paidAmount = body.paidAmount ?? existing.paidAmount;
  const subtotal = mergedItems.reduce((s, i) => s + i.quantity * i.unitPrice, 0);
  const total = subtotal - discount + tax;

  const purchase = await prisma.$transaction(async (tx) => {
    if (body.items) {
      await tx.purchaseItem.deleteMany({ where: { purchaseId: existing.id } });
    }
    const updated = await tx.purchase.update({
      where: { id: existing.id },
      data: {
        ...(body.supplierId !== undefined ? { supplierId: body.supplierId } : {}),
        subtotal,
        discount,
        tax,
        total,
        paidAmount,
        dueAmount: Math.max(0, total - paidAmount),
        ...(body.invoiceNumber !== undefined ? { invoiceNumber: body.invoiceNumber } : {}),
        ...(body.date !== undefined ? { date: new Date(body.date) } : {}),
        ...(body.items
          ? {
              items: {
                create: body.items.map((i) => ({
                  productId: i.productId,
                  productName: i.productName,
                  quantity: i.quantity,
                  unitPrice: i.unitPrice,
                  total: i.quantity * i.unitPrice,
                })),
              },
            }
          : {}),
      },
      include: { items: true, supplier: true },
    });

    const previousSupplierDue = Math.max(0, existing.total - existing.paidAmount);
    const newSupplierDue = Math.max(0, total - paidAmount);
    await tx.supplier.update({
      where: { id: updated.supplierId },
      data: {
        totalPurchases: { increment: total - existing.total },
        dueAmount: { increment: newSupplierDue - previousSupplierDue },
      },
    });

    return updated;
  });

  ApiResponseUtil.success(res, purchase, "Purchase updated");
});

export const deletePurchase = asyncHandler(async (req: Request, res: Response) => {
  const existing = await prisma.purchase.findUnique({
    where: { id: req.params.id },
  });
  if (!existing) throw new NotFoundError("Purchase not found");
  if (existing.status === "RECEIVED") {
    throw new BadRequestError("Received purchases cannot be deleted; record a return instead");
  }

  await prisma.$transaction(async (tx) => {
    const supplierDue = Math.max(0, existing.total - existing.paidAmount);
    await tx.supplier.update({
      where: { id: existing.supplierId },
      data: {
        totalPurchases: { decrement: existing.total },
        dueAmount: { decrement: supplierDue },
      },
    });
    await tx.purchaseItem.deleteMany({ where: { purchaseId: existing.id } });
    await tx.purchase.delete({ where: { id: existing.id } });
  });

  ApiResponseUtil.success(res, { deleted: true }, "Purchase deleted");
});

// ===================== Inventory =====================

const INVENTORY_INCLUDE = {
  product: { select: { id: true, name: true, slug: true, images: true, price: true } },
  warehouse: { select: { id: true, name: true, location: true } },
} as const;

function inventoryStatusFor(
  stock: number,
  minStock: number,
): "IN_STOCK" | "LOW_STOCK" | "OUT_OF_STOCK" {
  if (stock <= 0) return "OUT_OF_STOCK";
  if (stock <= minStock) return "LOW_STOCK";
  return "IN_STOCK";
}

export const listInventory = asyncHandler(async (_req: Request, res: Response) => {
  const defaultWarehouse = await prisma.warehouse.findFirst();
  const productsWithoutInventory = await prisma.product.findMany({
    where: {
      inventoryItems: { none: {} },
    },
  });

  if (productsWithoutInventory.length > 0) {
    await prisma.inventoryItem.createMany({
      data: productsWithoutInventory.map((p) => ({
        productId: p.id,
        name: p.name,
        sku: p.sku || `SKU-${p.id.slice(-6).toUpperCase()}`,
        stock: p.stock,
        minStock: Math.max(1, Math.floor(p.stock * 0.2)),
        maxStock: Math.max(100, p.stock * 2),
        warehouseId: defaultWarehouse?.id,
        status: inventoryStatusFor(p.stock, Math.max(1, Math.floor(p.stock * 0.2))),
      })),
      skipDuplicates: true,
    });
  }

  const items = await prisma.inventoryItem.findMany({
    include: INVENTORY_INCLUDE,
    orderBy: { updatedAt: "desc" },
  });
  ApiResponseUtil.success(res, items);
});

export const getInventoryItem = asyncHandler(async (req: Request, res: Response) => {
  const item = await prisma.inventoryItem.findFirst({
    where: { OR: [{ id: req.params.id }, { productId: req.params.id }] },
    include: INVENTORY_INCLUDE,
  });
  if (!item) throw new NotFoundError("Inventory item not found");
  ApiResponseUtil.success(res, item);
});

export const updateInventoryItem = asyncHandler(async (req: Request, res: Response) => {
  const body = req.validated.body as InventoryUpdate;
  const item = await prisma.inventoryItem.findFirst({
    where: { OR: [{ id: req.params.id }, { productId: req.params.id }] },
  });
  if (!item) throw new NotFoundError("Inventory item not found");

  const minStock = body.minStock ?? item.minStock;
  const maxStock = body.maxStock !== undefined ? body.maxStock : item.maxStock;
  const updated = await prisma.inventoryItem.update({
    where: { id: item.id },
    data: {
      minStock,
      maxStock,
      status: inventoryStatusFor(item.stock, minStock),
    },
    include: INVENTORY_INCLUDE,
  });
  ApiResponseUtil.success(res, updated, "Inventory updated");
});

export const listStockMovements = asyncHandler(async (req: Request, res: Response) => {
  const take = Math.min(Number(req.query.limit) || 100, 200);
  const movements = await prisma.stockMovement.findMany({
    include: { product: { select: { id: true, name: true, slug: true, images: true } } },
    orderBy: { createdAt: "desc" },
    take,
  });
  void take;
  ApiResponseUtil.success(res, movements);
});

export const createStockMovement = asyncHandler(async (req: Request, res: Response) => {
  const body = req.validated.body as StockMovementCreate;
  const product = await prisma.product.findFirst({
    where: {
      OR: [
        { id: body.productId },
        { slug: body.productId },
        { inventoryItems: { some: { id: body.productId } } },
      ],
    },
  });
  if (!product) throw new NotFoundError("Product not found");

  const delta =
    body.type === "IN"
      ? body.quantity
      : body.type === "OUT"
        ? -body.quantity
        : body.quantity - product.stock;

  if (product.stock + delta < 0) {
    throw new BadRequestError(`Insufficient stock. Available: ${product.stock}`);
  }

  const result = await prisma.$transaction(async (tx) => {
    const updatedProduct = await tx.product.update({
      where: { id: product.id },
      data: {
        stock: { increment: delta },
        inStock: product.stock + delta > 0,
        ...(product.stock + delta === 0 ? { status: "OUT_OF_STOCK" as const } : {}),
      },
    });

    const movement = await tx.stockMovement.create({
      data: {
        productId: product.id,
        productName: product.name,
        type: body.type,
        quantity: body.quantity,
        reference: body.reference,
        note: body.note,
      },
    });

    const inventory = await tx.inventoryItem.findFirst({ where: { productId: product.id } });
    if (inventory) {
      await tx.inventoryItem.update({
        where: { id: inventory.id },
        data: {
          stock: { increment: delta },
          lastRestocked: body.type === "IN" ? new Date() : inventory.lastRestocked,
          status: inventoryStatusFor(inventory.stock + delta, inventory.minStock),
        },
      });
    } else {
      const defaultWarehouse = await tx.warehouse.findFirst();
      await tx.inventoryItem.create({
        data: {
          productId: product.id,
          name: product.name,
          sku: product.sku || `SKU-${product.id.slice(-6).toUpperCase()}`,
          stock: Math.max(0, product.stock + delta),
          minStock: Math.max(1, Math.floor((product.stock + delta) * 0.2)),
          maxStock: Math.max(100, (product.stock + delta) * 2),
          warehouseId: defaultWarehouse?.id,
          lastRestocked: new Date(),
          status: inventoryStatusFor(product.stock + delta, 1),
        },
      });
    }

    return { movement, product: updatedProduct };
  });

  ApiResponseUtil.created(res, result.movement, "Stock movement recorded");
});
