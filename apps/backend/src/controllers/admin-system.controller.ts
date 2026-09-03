import type { Request, Response } from "express";
import { prisma } from "@unseen-gadget/database";
import { ApiResponseUtil } from "../utils/api-response";
import { BadRequestError, ConflictError, NotFoundError } from "../utils/errors";
import { asyncHandler } from "../utils/async-handler";
import { hashPassword } from "../utils/password";
import type { z } from "zod";
import type {
  expenseCreateSchema,
  expenseUpdateSchema,
  notificationCreateSchema,
  posSessionCreateSchema,
  posSessionSaleSchema,
  posSessionCloseSchema,
  settingUpsertSchema,
  adminCreateSchema,
  adminUpdateSchema,
  roleCreateSchema,
  roleUpdateSchema,
} from "../validations/ops.validations";

type ExpenseCreate = z.infer<typeof expenseCreateSchema>;
type ExpenseUpdate = z.infer<typeof expenseUpdateSchema>;
type NotificationCreate = z.infer<typeof notificationCreateSchema>;
type PosSessionCreate = z.infer<typeof posSessionCreateSchema>;
type PosSessionSale = z.infer<typeof posSessionSaleSchema>;
type PosSessionClose = z.infer<typeof posSessionCloseSchema>;
type SettingUpsert = z.infer<typeof settingUpsertSchema>;
type AdminCreate = z.infer<typeof adminCreateSchema>;
type AdminUpdate = z.infer<typeof adminUpdateSchema>;
type RoleCreate = z.infer<typeof roleCreateSchema>;
type RoleUpdate = z.infer<typeof roleUpdateSchema>;

// ===================== Expenses =====================

export const listExpenses = asyncHandler(async (_req: Request, res: Response) => {
  const expenses = await prisma.expense.findMany({ orderBy: { createdAt: "desc" } });
  ApiResponseUtil.success(res, expenses);
});

export const getExpense = asyncHandler(async (req: Request, res: Response) => {
  const expense = await prisma.expense.findUnique({ where: { id: req.params.id } });
  if (!expense) throw new NotFoundError("Expense not found");
  ApiResponseUtil.success(res, expense);
});

export const createExpense = asyncHandler(async (req: Request, res: Response) => {
  const body = req.validated.body as ExpenseCreate;
  const expense = await prisma.expense.create({
    data: {
      category: body.category,
      amount: body.amount,
      description: body.description,
      date: body.date ? new Date(body.date) : new Date(),
      paymentMethod: body.paymentMethod,
      receipt: body.receipt,
    },
  });
  ApiResponseUtil.created(res, expense, "Expense created");
});

export const updateExpense = asyncHandler(async (req: Request, res: Response) => {
  const body = req.validated.body as ExpenseUpdate;
  const existing = await prisma.expense.findUnique({ where: { id: req.params.id } });
  if (!existing) throw new NotFoundError("Expense not found");
  const expense = await prisma.expense.update({
    where: { id: existing.id },
    data: {
      ...(body.category !== undefined ? { category: body.category } : {}),
      ...(body.amount !== undefined ? { amount: body.amount } : {}),
      ...(body.description !== undefined ? { description: body.description } : {}),
      ...(body.date !== undefined ? { date: new Date(body.date) } : {}),
      ...(body.paymentMethod !== undefined ? { paymentMethod: body.paymentMethod } : {}),
      ...(body.receipt !== undefined ? { receipt: body.receipt } : {}),
    },
  });
  ApiResponseUtil.success(res, expense, "Expense updated");
});

export const deleteExpense = asyncHandler(async (req: Request, res: Response) => {
  const existing = await prisma.expense.findUnique({ where: { id: req.params.id } });
  if (!existing) throw new NotFoundError("Expense not found");
  await prisma.expense.delete({ where: { id: existing.id } });
  ApiResponseUtil.success(res, { deleted: true }, "Expense deleted");
});

// ===================== Notifications =====================

export const listNotifications = asyncHandler(async (_req: Request, res: Response) => {
  const notifications = await prisma.notification.findMany({
    orderBy: { time: "desc" },
    take: 100,
  });
  ApiResponseUtil.success(res, notifications);
});

export const createNotification = asyncHandler(async (req: Request, res: Response) => {
  const body = req.validated.body as NotificationCreate;
  const notification = await prisma.notification.create({
    data: {
      title: body.title,
      message: body.message,
      type: body.type,
      actionUrl: body.actionUrl,
      time: new Date(),
    },
  });
  ApiResponseUtil.created(res, notification, "Notification sent");
});

export const markNotificationRead = asyncHandler(async (req: Request, res: Response) => {
  const existing = await prisma.notification.findUnique({ where: { id: req.params.id } });
  if (!existing) throw new NotFoundError("Notification not found");
  const notification = await prisma.notification.update({
    where: { id: existing.id },
    data: { read: true },
  });
  ApiResponseUtil.success(res, notification, "Marked as read");
});

export const markAllNotificationsRead = asyncHandler(async (_req: Request, res: Response) => {
  await prisma.notification.updateMany({ where: { read: false }, data: { read: true } });
  ApiResponseUtil.success(res, { updated: true }, "All notifications marked as read");
});

// ===================== Promotions (admin) =====================

function promotionData(body: Record<string, unknown>) {
  const data: Record<string, unknown> = {};
  for (const key of [
    "name",
    "title",
    "badge",
    "description",
    "type",
    "discountType",
    "discountValue",
    "applicableTo",
    "status",
    "ctaLabel",
    "ctaHref",
    "icon",
    "gradient",
    "sortOrder",
    "active",
  ]) {
    if (body[key] !== undefined) data[key] = body[key];
  }
  if (body.startDate !== undefined)
    data.startDate = body.startDate ? new Date(body.startDate as string) : null;
  if (body.endDate !== undefined)
    data.endDate = body.endDate ? new Date(body.endDate as string) : null;
  return data;
}

export const listAdminPromotions = asyncHandler(async (_req: Request, res: Response) => {
  const promotions = await prisma.promotion.findMany({ orderBy: { sortOrder: "asc" } });
  ApiResponseUtil.success(res, promotions);
});

export const getAdminPromotion = asyncHandler(async (req: Request, res: Response) => {
  const promotion = await prisma.promotion.findUnique({ where: { id: req.params.id } });
  if (!promotion) throw new NotFoundError("Promotion not found");
  ApiResponseUtil.success(res, promotion);
});

export const createAdminPromotion = asyncHandler(async (req: Request, res: Response) => {
  const promotion = await prisma.promotion.create({
    data: promotionData(req.validated.body as Record<string, unknown>) as never,
  });
  ApiResponseUtil.created(res, promotion, "Promotion created");
});

export const updateAdminPromotion = asyncHandler(async (req: Request, res: Response) => {
  const existing = await prisma.promotion.findUnique({ where: { id: req.params.id } });
  if (!existing) throw new NotFoundError("Promotion not found");
  const promotion = await prisma.promotion.update({
    where: { id: existing.id },
    data: promotionData(req.validated.body as Record<string, unknown>) as never,
  });
  ApiResponseUtil.success(res, promotion, "Promotion updated");
});

export const deleteAdminPromotion = asyncHandler(async (req: Request, res: Response) => {
  const existing = await prisma.promotion.findUnique({ where: { id: req.params.id } });
  if (!existing) throw new NotFoundError("Promotion not found");
  await prisma.promotion.delete({ where: { id: existing.id } });
  ApiResponseUtil.success(res, { deleted: true }, "Promotion deleted");
});

// ===================== POS =====================

export const listPosSessions = asyncHandler(async (_req: Request, res: Response) => {
  const sessions = await prisma.posSession.findMany({ orderBy: { startTime: "desc" } });
  ApiResponseUtil.success(res, sessions);
});

export const getPosSession = asyncHandler(async (req: Request, res: Response) => {
  const session = await prisma.posSession.findUnique({ where: { id: req.params.id } });
  if (!session) throw new NotFoundError("POS session not found");
  ApiResponseUtil.success(res, session);
});

export const createPosSession = asyncHandler(async (req: Request, res: Response) => {
  const body = req.validated.body as PosSessionCreate;
  const openSession = await prisma.posSession.findFirst({ where: { endTime: null } });
  if (openSession) {
    throw new ConflictError(`POS session already open. Close it first.`);
  }
  const session = await prisma.posSession.create({
    data: { startTime: new Date(), cashInHand: body.cashInHand ?? 0 },
  });
  ApiResponseUtil.created(res, session, "POS session opened");
});

export const recordPosSale = asyncHandler(async (req: Request, res: Response) => {
  const body = req.validated.body as PosSessionSale;
  const session = await prisma.posSession.findUnique({ where: { id: req.params.id } });
  if (!session) throw new NotFoundError("POS session not found");
  if (session.endTime) throw new BadRequestError("POS session is closed");
  const updated = await prisma.posSession.update({
    where: { id: session.id },
    data: {
      totalSales: { increment: body.amount },
      totalOrders: { increment: 1 },
    },
  });
  ApiResponseUtil.success(res, updated, "Sale recorded");
});

export const closePosSession = asyncHandler(async (req: Request, res: Response) => {
  const body = req.validated.body as PosSessionClose;
  const session = await prisma.posSession.findUnique({ where: { id: req.params.id } });
  if (!session) throw new NotFoundError("POS session not found");
  if (session.endTime) throw new BadRequestError("POS session is already closed");
  const updated = await prisma.posSession.update({
    where: { id: session.id },
    data: {
      endTime: new Date(),
      ...(body.totalSales !== undefined ? { totalSales: body.totalSales } : {}),
      ...(body.totalOrders !== undefined ? { totalOrders: body.totalOrders } : {}),
    },
  });
  ApiResponseUtil.success(res, updated, "POS session closed");
});

// ===================== Settings =====================

export const getAllSettings = asyncHandler(async (_req: Request, res: Response) => {
  const settings = await prisma.setting.findMany({ orderBy: { key: "asc" } });
  const map: Record<string, unknown> = {};
  for (const s of settings) map[s.key] = s.value;
  ApiResponseUtil.success(res, map);
});

export const upsertSetting = asyncHandler(async (req: Request, res: Response) => {
  const body = req.validated.body as SettingUpsert;
  if (body.value === undefined) throw new BadRequestError("value is required");
  const saved = await prisma.setting.upsert({
    where: { key: req.params.key },
    update: { value: body.value as never },
    create: { key: req.params.key, value: body.value as never },
  });
  ApiResponseUtil.success(res, saved.value, "Setting saved");
});

// ===================== Admin management =====================

const ADMIN_SELECT = {
  id: true,
  name: true,
  email: true,
  roleId: true,
  role: { select: { id: true, name: true, permissions: true } },
  status: true,
  lastLogin: true,
  createdAt: true,
} as const;

export const listAdmins = asyncHandler(async (_req: Request, res: Response) => {
  const admins = await prisma.adminUser.findMany({
    select: ADMIN_SELECT,
    orderBy: { createdAt: "asc" },
  });
  ApiResponseUtil.success(res, admins);
});

export const createAdminUser = asyncHandler(async (req: Request, res: Response) => {
  const body = req.validated.body as AdminCreate;
  const existing = await prisma.adminUser.findUnique({ where: { email: body.email } });
  if (existing) throw new ConflictError("An admin with this email already exists");
  const role = await prisma.role.findUnique({ where: { id: body.roleId } });
  if (!role) throw new NotFoundError("Role not found");

  const admin = await prisma.adminUser.create({
    data: {
      name: body.name,
      email: body.email,
      passwordHash: await hashPassword(body.password),
      roleId: body.roleId,
      status: body.status ?? "ACTIVE",
    },
    select: ADMIN_SELECT,
  });
  ApiResponseUtil.created(res, admin, "Admin created");
});

export const updateAdminUser = asyncHandler(async (req: Request, res: Response) => {
  const body = req.validated.body as AdminUpdate;
  const existing = await prisma.adminUser.findUnique({ where: { id: req.params.id } });
  if (!existing) throw new NotFoundError("Admin not found");
  if (body.roleId) {
    const role = await prisma.role.findUnique({ where: { id: body.roleId } });
    if (!role) throw new NotFoundError("Role not found");
  }
  const needsTokenBump = body.roleId !== undefined || body.status === "INACTIVE";

  const admin = await prisma.adminUser.update({
    where: { id: existing.id },
    data: {
      ...(body.name !== undefined ? { name: body.name } : {}),
      ...(body.email !== undefined ? { email: body.email } : {}),
      ...(body.password !== undefined
        ? { passwordHash: await hashPassword(body.password) }
        : {}),
      ...(body.roleId !== undefined ? { roleId: body.roleId } : {}),
      ...(body.status !== undefined ? { status: body.status } : {}),
      ...(needsTokenBump ? { tokenVersion: { increment: 1 } } : {}),
    },
    select: ADMIN_SELECT,
  });
  ApiResponseUtil.success(res, admin, "Admin updated");
});

export const deleteAdminUser = asyncHandler(async (req: Request, res: Response) => {
  const existing = await prisma.adminUser.findUnique({
    where: { id: req.params.id },
    include: { role: true },
  });
  if (!existing) throw new NotFoundError("Admin not found");
  if (existing.id === req.adminUser?.id) {
    throw new BadRequestError("You cannot delete your own account");
  }
  const superAdminCount = await prisma.adminUser.count({
    where: { role: { name: "SUPER_ADMIN" }, status: "ACTIVE" },
  });
  if (existing.role.name === "SUPER_ADMIN" && superAdminCount <= 1) {
    throw new BadRequestError("Cannot delete the last active super admin");
  }
  await prisma.$transaction([
    prisma.notification.deleteMany({ where: { adminUserId: existing.id } }),
    prisma.adminUser.delete({ where: { id: existing.id } }),
  ]);
  ApiResponseUtil.success(res, { deleted: true }, "Admin deleted");
});

// ===================== Roles =====================

export const listRoles = asyncHandler(async (_req: Request, res: Response) => {
  const roles = await prisma.role.findMany({
    include: { _count: { select: { admins: true } } },
    orderBy: { createdAt: "asc" },
  });
  ApiResponseUtil.success(res, roles);
});

export const createRole = asyncHandler(async (req: Request, res: Response) => {
  const body = req.validated.body as RoleCreate;
  const existing = await prisma.role.findUnique({ where: { name: body.name } });
  if (existing) throw new ConflictError("A role with this name already exists");
  const role = await prisma.role.create({ data: { name: body.name, permissions: body.permissions } });
  ApiResponseUtil.created(res, role, "Role created");
});

export const updateRole = asyncHandler(async (req: Request, res: Response) => {
  const body = req.validated.body as RoleUpdate;
  const existing = await prisma.role.findUnique({ where: { id: req.params.id } });
  if (!existing) throw new NotFoundError("Role not found");

  const role = await prisma.$transaction(async (tx) => {
    const updated = await tx.role.update({
      where: { id: existing.id },
      data: {
        ...(body.name !== undefined ? { name: body.name } : {}),
        ...(body.permissions !== undefined ? { permissions: body.permissions } : {}),
      },
    });
    // Permission changes take effect on next login; force re-auth.
    if (body.permissions !== undefined) {
      await tx.adminUser.updateMany({
        where: { roleId: existing.id },
        data: { tokenVersion: { increment: 1 } },
      });
    }
    return updated;
  });
  ApiResponseUtil.success(res, role, "Role updated");
});

export const deleteRole = asyncHandler(async (req: Request, res: Response) => {
  const existing = await prisma.role.findUnique({
    where: { id: req.params.id },
    include: { _count: { select: { admins: true } } },
  });
  if (!existing) throw new NotFoundError("Role not found");
  if (existing._count.admins > 0) {
    throw new ConflictError("Cannot delete a role that still has admins assigned");
  }
  await prisma.role.delete({ where: { id: existing.id } });
  ApiResponseUtil.success(res, { deleted: true }, "Role deleted");
});
