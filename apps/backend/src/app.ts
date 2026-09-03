import "dotenv/config";
import path from "node:path";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import type { RequestHandler } from "express";

import { env } from "./config/env";
import { createCorsOptions } from "./config/cors";
import { BODY_LIMIT } from "./constants";
import { errorHandler, notFoundHandler } from "./middlewares/error-handler";
import { apiRouter } from "./routes";

const app = express();

if (env.NODE_ENV === "production") {
  app.set("trust proxy", 1);
}

app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  }),
);
app.use(cors(createCorsOptions()));
app.use(express.json({ limit: BODY_LIMIT }));
app.use(express.urlencoded({ extended: true, limit: BODY_LIMIT }));
app.use(cookieParser());
app.use(morgan(env.NODE_ENV === "production" ? "combined" : "dev"));

// Routes
const healthHandler: RequestHandler = (_req, res) => {
  res.status(200).json({
    success: true,
    message: "Unseen Gadget API is running",
    data: {
      status: "ok",
      environment: env.NODE_ENV,
      timestamp: new Date().toISOString(),
    },
  });
};
app.get("/api/health", healthHandler);

// Locally uploaded images (fallback when Cloudinary is not configured)
app.use(
  "/uploads",
  express.static(path.resolve(process.cwd(), "uploads"), {
    maxAge: "7d",
    immutable: true,
  }),
);
app.use(
  "/api/uploads",
  express.static(path.resolve(process.cwd(), "uploads"), {
    maxAge: "7d",
    immutable: true,
  }),
);

// API routes
app.use("/api", apiRouter);

// 404 handling for unknown API routes
app.use(notFoundHandler);

// Centralized error handling
app.use(errorHandler);

export default app;