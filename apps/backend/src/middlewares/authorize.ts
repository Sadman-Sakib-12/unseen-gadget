import type { RequestHandler } from "express";
import { ForbiddenError, UnauthorizedError } from "../utils/errors";

export function requireRole(...roles: string[]): RequestHandler {
  return (req, _res, next) => {
    if (!req.adminUser) {
      next(new UnauthorizedError("Not authenticated"));
      return;
    }
    if (!roles.includes(req.adminUser.role.name)) {
      next(new ForbiddenError(`Requires role: ${roles.join(" or ")}`));
      return;
    }
    next();
  };
}

export function requirePermission(permission: string): RequestHandler {
  return (req, _res, next) => {
    if (!req.adminUser) {
      next(new UnauthorizedError("Not authenticated"));
      return;
    }
    // Super admins, managers, staff (for products), and permission holders
    if (
      req.adminUser.role.name === "SUPER_ADMIN" ||
      req.adminUser.role.name === "MANAGER" ||
      req.adminUser.role.permissions.includes("all") ||
      req.adminUser.role.permissions.includes("*") ||
      req.adminUser.role.permissions.includes(permission) ||
      (permission === "manage_products")
    ) {
      next();
      return;
    }
    next(new ForbiddenError(`Missing required permission: ${permission}`));
  };
}

export const Authorize = { role: requireRole, permission: requirePermission };

export default Authorize;