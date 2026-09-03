import type { PaginationParams } from "../utils/pagination";

declare global {
  namespace Express {
    interface Request {
      validated: Record<string, unknown>;
      pagination?: PaginationParams;
      user?: import("@prisma/client").User;
      adminUser?: import("@prisma/client").AdminUser & {
        role: import("@prisma/client").Role;
      };
    }
  }
}

export {};