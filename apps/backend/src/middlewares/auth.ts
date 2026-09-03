import type { NextFunction, Request, RequestHandler, Response } from "express";
import { prisma } from "@unseen-gadget/database";
import {
  ADMIN_AUTH_COOKIE_NAME,
  ADMIN_REFRESH_COOKIE_NAME,
  CUSTOMER_AUTH_COOKIE_NAME,
  CUSTOMER_REFRESH_COOKIE_NAME,
} from "../constants";
import { UnauthorizedError } from "../utils/errors";
import { signAccessToken, signRefreshToken, verifyToken, type AccessTokenPayload } from "../utils/jwt";
import { setAdminAuthCookies, setCustomerAuthCookies } from "../config/cookies";
import * as adminAuthService from "../services/admin-auth.service";
import * as authService from "../services/auth.service";

export const authenticateCustomer: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const token =
      (req.cookies?.[CUSTOMER_AUTH_COOKIE_NAME] as string | undefined) ||
      (req.headers.authorization?.startsWith("Bearer ")
        ? req.headers.authorization.slice(7)
        : undefined);

    let payload = token ? verifyToken<AccessTokenPayload>(token) : null;

    if (!payload || payload.type !== "access") {
      const refreshToken = req.cookies?.[CUSTOMER_REFRESH_COOKIE_NAME] as string | undefined;
      if (refreshToken) {
        try {
          const { user } = await authService.refresh(refreshToken);
          const newAccessToken = signAccessToken(user.id, user.tokenVersion);
          const rotatedRefreshToken = signRefreshToken(user.id, user.tokenVersion);
          setCustomerAuthCookies(res, newAccessToken, rotatedRefreshToken);
          const fullUser = await prisma.user.findUnique({ where: { id: user.id } });
          if (fullUser && fullUser.status === "ACTIVE") {
            req.user = fullUser;
            next();
            return;
          }
        } catch {
          // Token refresh failed
        }
      }
      throw new UnauthorizedError("Not authenticated");
    }

    const user = await prisma.user.findUnique({ where: { id: payload.sub } });
    if (!user || user.status !== "ACTIVE") {
      throw new UnauthorizedError("User not found or inactive");
    }
    if (user.tokenVersion !== payload.ver) {
      const refreshToken = req.cookies?.[CUSTOMER_REFRESH_COOKIE_NAME] as string | undefined;
      if (refreshToken) {
        try {
          const { user: refreshedUser } = await authService.refresh(refreshToken);
          const newAccessToken = signAccessToken(refreshedUser.id, refreshedUser.tokenVersion);
          const rotatedRefreshToken = signRefreshToken(refreshedUser.id, refreshedUser.tokenVersion);
          setCustomerAuthCookies(res, newAccessToken, rotatedRefreshToken);
          const fullUser = await prisma.user.findUnique({ where: { id: refreshedUser.id } });
          if (fullUser && fullUser.status === "ACTIVE") {
            req.user = fullUser;
            next();
            return;
          }
        } catch {}
      }
      throw new UnauthorizedError("Session has been invalidated");
    }

    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};

export const authenticateAdmin: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const token =
      (req.cookies?.[ADMIN_AUTH_COOKIE_NAME] as string | undefined) ||
      (req.headers.authorization?.startsWith("Bearer ")
        ? req.headers.authorization.slice(7)
        : undefined);

    let payload = token ? verifyToken<AccessTokenPayload>(token) : null;

    if (!payload || payload.type !== "access") {
      const refreshToken = req.cookies?.[ADMIN_REFRESH_COOKIE_NAME] as string | undefined;
      if (refreshToken) {
        try {
          const { admin } = await adminAuthService.refresh(refreshToken);
          const newAccessToken = signAccessToken(admin.id, admin.tokenVersion);
          const rotatedRefreshToken = signRefreshToken(admin.id, admin.tokenVersion);
          setAdminAuthCookies(res, newAccessToken, rotatedRefreshToken);
          const fullAdmin = await prisma.adminUser.findUnique({
            where: { id: admin.id },
            include: { role: true },
          });
          if (fullAdmin && fullAdmin.status === "ACTIVE") {
            req.adminUser = fullAdmin;
            next();
            return;
          }
        } catch {
          // Token refresh failed
        }
      }
      throw new UnauthorizedError("Not authenticated");
    }

    const adminUser = await prisma.adminUser.findUnique({
      where: { id: payload.sub },
      include: { role: true },
    });
    if (!adminUser || adminUser.status !== "ACTIVE") {
      throw new UnauthorizedError("Admin not found or inactive");
    }
    if (adminUser.tokenVersion !== payload.ver) {
      throw new UnauthorizedError("Session has been invalidated");
    }

    req.adminUser = adminUser;
    next();
  } catch (error) {
    next(error);
  }
};

export const optionalAuth: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const token =
      (req.cookies?.[CUSTOMER_AUTH_COOKIE_NAME] as string | undefined) ||
      (req.headers.authorization?.startsWith("Bearer ")
        ? req.headers.authorization.slice(7)
        : undefined);

    let payload = token ? verifyToken<AccessTokenPayload>(token) : null;

    if (!payload || payload.type !== "access") {
      const refreshToken = req.cookies?.[CUSTOMER_REFRESH_COOKIE_NAME] as string | undefined;
      if (refreshToken) {
        try {
          const { user } = await authService.refresh(refreshToken);
          const newAccessToken = signAccessToken(user.id, user.tokenVersion);
          const rotatedRefreshToken = signRefreshToken(user.id, user.tokenVersion);
          setCustomerAuthCookies(res, newAccessToken, rotatedRefreshToken);
          const fullUser = await prisma.user.findUnique({ where: { id: user.id } });
          if (fullUser && fullUser.status === "ACTIVE") {
            req.user = fullUser;
          }
        } catch {
          // Token refresh failed
        }
      }
    } else {
      const user = await prisma.user.findUnique({ where: { id: payload.sub } });
      if (user && user.status === "ACTIVE" && user.tokenVersion === payload.ver) {
        req.user = user;
      }
    }
    next();
  } catch (error) {
    next(error);
  }
};

export const optionalAdminAuth: RequestHandler = async (
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  try {
    const token = req.cookies?.[ADMIN_AUTH_COOKIE_NAME] as string | undefined;
    if (token) {
      const payload = verifyToken<AccessTokenPayload>(token);
      if (payload && payload.type === "access") {
        const adminUser = await prisma.adminUser.findUnique({
          where: { id: payload.sub },
          include: { role: true },
        });
        if (adminUser && adminUser.status === "ACTIVE" && adminUser.tokenVersion === payload.ver) {
          req.adminUser = adminUser;
        }
      }
    }
    next();
  } catch (error) {
    next(error);
  }
};

export const Auth = { customer: authenticateCustomer, admin: authenticateAdmin, optional: optionalAuth };

export default Auth;