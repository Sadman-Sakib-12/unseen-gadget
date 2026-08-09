import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import type { ErrorRequestHandler, RequestHandler } from "express";

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(cookieParser());

// Routes
const healthHandler: RequestHandler = (_req, res) => {
  res.json({ status: "ok", message: "Unseen Gadget API is running" });
};
app.get("/api/health", healthHandler);

// Error handling middleware
const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" });
};
app.use(errorHandler);

export default app;
