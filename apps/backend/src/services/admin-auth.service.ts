import type { AdminUser, Role } from "@prisma/client";
import { prisma } from "@unseen-gadget/database";
import type { AdminRegisterInput } from "@unseen-gadget/validations";
import {
  BadRequestError,
  ConflictError,
  ForbiddenError,
  NotFoundError,
  UnauthorizedError,
} from "../utils/errors";
import { comparePassword, hashPassword } from "../utils/password";
import { verifyToken, type RefreshTokenPayload } from "../utils/jwt";

export interface AdminLoginInput {
  email: string;
  password: string;
}

export type AdminWithRole = AdminUser & { role: Role };
export type PublicAdmin = Omit<AdminWithRole, "passwordHash">;

export function toPublicAdmin(admin: AdminWithRole): PublicAdmin {
  const { passwordHash: _passwordHash, ...rest } = admin;
  return rest;
}

async function resolveRoleId(roleName = "STAFF"): Promise<string> {
  const normalized = roleName.toUpperCase();
  const role = await prisma.role.findFirst({
    where: { name: { equals: normalized, mode: "insensitive" } },
  });
  if (role) return role.id;

  const permissions =
    normalized === "SUPER_ADMIN"
      ? ["all", "manage_products", "manage_orders", "manage_cms", "view_reports", "manage_admins"]
      : normalized === "MANAGER"
      ? ["manage_products", "manage_orders", "manage_cms", "view_reports"]
      : ["manage_orders", "view_products"];

  const created = await prisma.role.create({
    data: {
      name: normalized,
      permissions,
    },
  });
  return created.id;
}

export async function register(input: AdminRegisterInput): Promise<{ admin: PublicAdmin }> {
  const email = input.email.trim().toLowerCase();
  const existing = await prisma.adminUser.findFirst({
    where: { email: { equals: email, mode: "insensitive" } },
  });
  if (existing) {
    throw new ConflictError("An admin account with this email already exists");
  }

  const roleId = await resolveRoleId(input.role || "STAFF");

  // New staff and managers are created as INACTIVE by default.
  // Only Super Admin can activate and assign section permissions.
  const created = await prisma.adminUser.create({
    data: {
      name: input.name.trim(),
      email,
      passwordHash: await hashPassword(input.password),
      roleId,
      status: "INACTIVE",
    },
    include: { role: true },
  });

  return { admin: toPublicAdmin(created) };
}

export async function login(input: AdminLoginInput): Promise<{ admin: PublicAdmin }> {
  const email = input.email.trim().toLowerCase();
  const admin = await prisma.adminUser.findFirst({
    where: { email: { equals: email, mode: "insensitive" } },
    include: { role: true },
  });
  if (!admin) throw new UnauthorizedError("Invalid email or password");

  const valid = await comparePassword(input.password, admin.passwordHash);
  if (!valid) throw new UnauthorizedError("Invalid email or password");
  if (admin.status !== "ACTIVE") {
    throw new ForbiddenError(
      "Your account is pending Super Admin approval. An administrator must activate your account and grant section access before you can log in."
    );
  }

  const updated = await prisma.adminUser.update({
    where: { id: admin.id },
    data: { lastLogin: new Date() },
    include: { role: true },
  });
  return { admin: toPublicAdmin(updated) };
}

export async function logout(adminId: string): Promise<void> {
  await prisma.adminUser.update({
    where: { id: adminId },
    data: { tokenVersion: { increment: 1 } },
  });
}

export async function refresh(refreshToken: string): Promise<{ admin: PublicAdmin }> {
  const payload = verifyToken<RefreshTokenPayload>(refreshToken);
  if (!payload || payload.type !== "refresh") {
    throw new UnauthorizedError("Invalid refresh token");
  }
  const admin = await prisma.adminUser.findUnique({
    where: { id: payload.sub },
    include: { role: true },
  });
  if (!admin || admin.status !== "ACTIVE") {
    throw new UnauthorizedError("Admin not found or inactive");
  }
  if (admin.tokenVersion !== payload.ver) {
    throw new UnauthorizedError("Session has been invalidated");
  }
  return { admin: toPublicAdmin(admin) };
}

export async function getMe(adminId: string): Promise<PublicAdmin> {
  const admin = await prisma.adminUser.findUnique({
    where: { id: adminId },
    include: { role: true },
  });
  if (!admin) throw new NotFoundError("Admin not found");
  return toPublicAdmin(admin);
}

export async function changePassword(
  adminId: string,
  currentPassword: string,
  newPassword: string,
): Promise<void> {
  const admin = await prisma.adminUser.findUnique({ where: { id: adminId } });
  if (!admin) throw new NotFoundError("Admin not found");
  const valid = await comparePassword(currentPassword, admin.passwordHash);
  if (!valid) throw new BadRequestError("Current password is incorrect");

  await prisma.adminUser.update({
    where: { id: adminId },
    data: {
      passwordHash: await hashPassword(newPassword),
      tokenVersion: { increment: 1 },
    },
  });
}

export const AdminAuthService = {
  register,
  login,
  logout,
  refresh,
  getMe,
  changePassword,
  toPublicAdmin,
};

export default AdminAuthService;