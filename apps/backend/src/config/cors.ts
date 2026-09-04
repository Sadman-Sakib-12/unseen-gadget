import type { CorsOptions } from "cors";
import { env, isDev } from "./env";

const allowedOrigins = [
  env.FRONTEND_URL.replace(/\/$/, ""),
  env.ADMIN_URL.replace(/\/$/, ""),
];

export function createCorsOptions(): CorsOptions {
  return {
    origin(origin, callback) {
      // Allow requests with no origin (curl, mobile apps, server-to-server, health checks)
      if (!origin) {
        return callback(null, true);
      }
      if (
        allowedOrigins.includes(origin) ||
        origin.endsWith(".vercel.app") ||
        /^https?:\/\/([a-z0-9-]+\.)*vercel\.app$/i.test(origin) ||
        (isDev && /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin))
      ) {
        callback(null, true);
      } else {
        callback(new Error(`Origin ${origin} not allowed by CORS`));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "Cache-Control", "Pragma", "Expires"],
  };
}

export default createCorsOptions;