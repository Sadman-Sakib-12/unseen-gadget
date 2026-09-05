import type { User } from "@prisma/client";
import { prisma } from "@unseen-gadget/database";
import { env } from "../config/env";
import { RESET_TOKEN_TTL_MS } from "../constants";
import {
  BadRequestError,
  ConflictError,
  ForbiddenError,
  NotFoundError,
  UnauthorizedError,
} from "../utils/errors";
import { comparePassword, hashPassword } from "../utils/password";
import { generateToken } from "../utils/random";
import { verifyToken, type RefreshTokenPayload } from "../utils/jwt";
import { sendMail } from "./email.service";

export interface RegisterInput {
  email: string;
  name: string;
  phone: string;
  password: string;
}

export interface LoginInput {
  email: string;
  password: string;
  otp?: string;
}

export type PublicUser = Omit<
  User,
  "passwordHash" | "verificationToken" | "verificationTokenExpires" | "resetToken" | "resetTokenExpires"
>;

export function toPublicUser(user: User): PublicUser {
  const {
    passwordHash: _passwordHash,
    verificationToken: _verificationToken,
    verificationTokenExpires: _verificationTokenExpires,
    resetToken: _resetToken,
    resetTokenExpires: _resetTokenExpires,
    ...rest
  } = user;
  return rest;
}

export async function register(input: RegisterInput): Promise<PublicUser> {
  const existing = await prisma.user.findUnique({ where: { email: input.email } });
  if (existing) {
    throw new ConflictError("Email is already registered. Please log in.");
  }

  const user = await prisma.user.create({
    data: {
      email: input.email,
      name: input.name,
      phone: input.phone,
      passwordHash: await hashPassword(input.password),
    },
  });

  return toPublicUser(user);
}

export async function verifyEmail(token: string): Promise<PublicUser> {
  const user = await prisma.user.findFirst({ where: { verificationToken: token } });
  if (!user) throw new BadRequestError("Invalid verification token");

  if (user.verificationTokenExpires && user.verificationTokenExpires.getTime() < Date.now()) {
    throw new BadRequestError("Verification token has expired");
  }

  const updated = await prisma.user.update({
    where: { id: user.id },
    data: {
      emailVerified: new Date(),
      verificationToken: null,
      verificationTokenExpires: null,
    },
  });
  return toPublicUser(updated);
}

export type LoginResult =
  | { requiresOtp: true; email: string; message: string }
  | { requiresOtp: false; user: PublicUser };

export async function login(input: LoginInput, sessionId?: string): Promise<LoginResult> {
  const user = await prisma.user.findUnique({ where: { email: input.email } });
  if (!user || !user.passwordHash) {
    throw new UnauthorizedError("Invalid email or password");
  }
  const valid = await comparePassword(input.password, user.passwordHash);
  if (!valid) throw new UnauthorizedError("Invalid email or password");
  if (user.status !== "ACTIVE") {
    throw new ForbiddenError("Account is blocked or inactive");
  }

  // Guest cart merge: merge any guest cart items into the customer's cart
  if (sessionId) {
    await mergeGuestCartIntoUserCart(user.id, sessionId);
  }

  return { requiresOtp: false, user: toPublicUser(user) };
}

export async function logout(userId: string): Promise<void> {
  await prisma.user.update({
    where: { id: userId },
    data: { tokenVersion: { increment: 1 } },
  });
}

export async function refresh(refreshToken: string): Promise<{ user: PublicUser }> {
  const payload = verifyToken<RefreshTokenPayload>(refreshToken);
  if (!payload || payload.type !== "refresh") {
    throw new UnauthorizedError("Invalid refresh token");
  }
  const user = await prisma.user.findUnique({ where: { id: payload.sub } });
  if (!user || user.status !== "ACTIVE") {
    throw new UnauthorizedError("User not found or inactive");
  }
  if (user.tokenVersion !== payload.ver) {
    throw new UnauthorizedError("Session has been invalidated");
  }
  return { user: toPublicUser(user) };
}

export async function getMe(userId: string): Promise<PublicUser> {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new NotFoundError("User not found");
  return toPublicUser(user);
}

export async function forgotPassword(email: string): Promise<void> {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return;

  const resetToken = generateToken(32);
  const resetTokenExpires = new Date(Date.now() + RESET_TOKEN_TTL_MS);
  await prisma.user.update({
    where: { id: user.id },
    data: { resetToken, resetTokenExpires },
  });

  await sendMail({
    to: user.email,
    subject: "Reset your Unseen Gadget password",
    text: `Reset your password at ${env.FRONTEND_URL}/reset-password?token=${resetToken}`,
  });
}

export async function resetPassword(token: string, password: string): Promise<void> {
  const user = await prisma.user.findFirst({ where: { resetToken: token } });
  if (!user) throw new BadRequestError("Invalid reset token");
  if (user.resetTokenExpires && user.resetTokenExpires.getTime() < Date.now()) {
    throw new BadRequestError("Reset token has expired");
  }

  await prisma.user.update({
    where: { id: user.id },
    data: {
      passwordHash: await hashPassword(password),
      resetToken: null,
      resetTokenExpires: null,
      tokenVersion: { increment: 1 },
    },
  });
}

export async function changePassword(
  userId: string,
  currentPassword: string,
  newPassword: string,
): Promise<void> {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user || !user.passwordHash) {
    throw new NotFoundError("User not found");
  }
  const valid = await comparePassword(currentPassword, user.passwordHash);
  if (!valid) throw new BadRequestError("Current password is incorrect");

  await prisma.user.update({
    where: { id: userId },
    data: {
      passwordHash: await hashPassword(newPassword),
      tokenVersion: { increment: 1 },
    },
  });
}

/**
 * Merges guest cart items into the authenticated user's cart.
 * 
 * - Finds the guest cart by sessionId
 * - Finds or creates the customer's cart
 * - Merges items: same product + same variant → sum quantities; different → preserve both
 * - Deactivates the guest cart after successful merge
 * - Uses Prisma transaction for atomicity
 * 
 * This function is designed to be called during customer login.
 * The sessionId should be available from the login request context.
 * 
 * @param userId - The authenticated user's ID (never trust client-provided userId)
 * @param sessionId - The guest cart session ID
 */
export async function mergeGuestCartIntoUserCart(userId: string, sessionId: string): Promise<void> {
  if (!sessionId) return;

  await prisma.$transaction(async (tx) => {
    // Find or create customer cart
    let customerCart = await tx.cart.findFirst({
      where: { userId },
      include: { items: true },
    });

    if (!customerCart) {
      customerCart = await tx.cart.create({
        data: { userId },
        include: { items: true },
      });
    }

    // Find guest cart with simple include
    const guestCart = await tx.cart.findFirst({
      where: { sessionId },
      include: { items: { select: { productId: true, variantId: true, quantity: true } } },
    });

    if (!guestCart) return; // No guest cart to merge

    // Merge items
    for (const guestItem of guestCart.items) {
      // Check if customer cart already has this product + variant
      const existingItem = customerCart.items.find(
        (ci) => ci.productId === guestItem.productId && ci.variantId === guestItem.variantId
      );

      if (existingItem) {
        // Sum quantities
        await tx.cartItem.update({
          where: { id: existingItem.id },
          data: { quantity: existingItem.quantity + guestItem.quantity },
        });
      } else {
        // Create new item in customer cart
        await tx.cartItem.create({
          data: {
            cartId: customerCart.id,
            productId: guestItem.productId,
            variantId: guestItem.variantId,
            quantity: guestItem.quantity,
          },
        });
      }
    }

    // Deactivate guest cart after merge by clearing sessionId
    await tx.cart.update({
      where: { id: guestCart.id },
      data: { sessionId: null },
    });
  });
}

export async function updateProfile(
  userId: string,
  data: { name?: string; phone?: string; email?: string }
): Promise<PublicUser> {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new NotFoundError("User not found");

  if (data.email && data.email !== user.email) {
    const existing = await prisma.user.findUnique({ where: { email: data.email } });
    if (existing) throw new ConflictError("Email already in use");
  }

  const updated = await prisma.user.update({
    where: { id: userId },
    data: {
      ...(data.name !== undefined ? { name: data.name } : {}),
      ...(data.phone !== undefined ? { phone: data.phone } : {}),
      ...(data.email !== undefined ? { email: data.email } : {}),
    },
  });
  return toPublicUser(updated);
}

export const AuthService = {
  register,
  verifyEmail,
  login,
  logout,
  refresh,
  getMe,
  updateProfile,
  forgotPassword,
  resetPassword,
  changePassword,
  toPublicUser,
};

export default AuthService;