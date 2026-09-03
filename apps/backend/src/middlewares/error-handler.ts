import type { NextFunction, Request, Response } from "express";
import { Prisma } from "@prisma/client";
import { ZodError } from "zod";
import {
  AppError,
  BadRequestError,
  ConflictError,
  NotFoundError,
} from "../utils/errors";
import { formatZodError } from "./validate";

export function notFoundHandler(_req: Request, _res: Response, next: NextFunction): void {
  next(new NotFoundError("API route not found"));
}

function isPrismaError(err: unknown): err is Prisma.PrismaClientKnownRequestError {
  return err instanceof Prisma.PrismaClientKnownRequestError;
}

function prismaErrorToAppError(err: Prisma.PrismaClientKnownRequestError): AppError {
  switch (err.code) {
    case "P2002": {
      const target = Array.isArray(err.meta?.target)
        ? (err.meta.target as string[]).join(", ")
        : "field";
      return new ConflictError(`Duplicate value for ${target}`);
    }
    case "P2025":
      return new NotFoundError("Record not found");
    case "P2003":
      return new BadRequestError("Referenced record does not exist");
    default:
      return new AppError(500, "Database error", err.message);
  }
}

function isMulterError(err: unknown): err is { name: string; message: string } {
  return (
    typeof err === "object" &&
    err !== null &&
    (err as { name?: string }).name === "MulterError"
  );
}

interface HttpBodyParserError {
  statusCode: number;
  status?: number;
  expose?: boolean;
  type?: string;
  message: string;
}

function isHttpError(err: unknown): err is HttpBodyParserError {
  return (
    typeof err === "object" &&
    err !== null &&
    typeof (err as HttpBodyParserError).statusCode === "number" &&
    (err as HttpBodyParserError).expose === true
  );
}

function httpErrorStatus(err: HttpBodyParserError): number {
  return typeof err.status === "number" ? err.status : err.statusCode;
}

export const errorHandler = (
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void => {
  if (res.headersSent) {
    _next(err);
    return;
  }

  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      success: false,
      error: err.message,
      ...(err.details !== undefined ? { details: err.details } : {}),
    });
    return;
  }

  if (err instanceof ZodError) {
    res.status(422).json({
      success: false,
      error: "Validation failed",
      details: formatZodError(err),
    });
    return;
  }

  if (isPrismaError(err)) {
    const appError = prismaErrorToAppError(err);
    res.status(appError.statusCode).json({
      success: false,
      error: appError.message,
      ...(appError.details !== undefined ? { details: appError.details } : {}),
    });
    return;
  }

  if (isMulterError(err)) {
    res.status(400).json({ success: false, error: err.message });
    return;
  }

  if (isHttpError(err)) {
    const message =
      err.type === "entity.parse.failed" ? "Invalid JSON body" : err.message;
    res.status(httpErrorStatus(err)).json({ success: false, error: message });
    return;
  }

  console.error(err);
  res.status(500).json({ success: false, error: "Internal Server Error" });
};

export default errorHandler;