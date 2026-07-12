import { NextFunction, Request, Response } from "express";
import { AppError } from "../utils/errors";
import { fail } from "../utils/apiResponse";
import { logger } from "../utils/logger";

export const notFoundHandler = (_req: Request, res: Response) => {
  return fail(res, 404, "Route not found", "NOT_FOUND");
};

export const errorHandler = (err: unknown, req: Request, res: Response, _next: NextFunction) => {
  const appError = err instanceof AppError ? err : undefined;

  logger.error("request_failed", {
    requestId: req.context?.requestId,
    path: req.path,
    method: req.method,
    error: err instanceof Error ? err.message : "Unknown error",
    stack: err instanceof Error ? err.stack : undefined,
  });

  return fail(
    res,
    appError?.statusCode || 500,
    appError?.safeMessage || "Internal server error",
    appError?.code || "INTERNAL_ERROR"
  );
};
