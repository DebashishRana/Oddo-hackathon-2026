import { NextFunction, Request, Response } from "express";
import { env } from "../config/env";
import { AppError } from "../utils/errors";
import { verifySessionToken } from "../utils/jwt";

const getTokenFromRequest = (req: Request) => {
  const authHeader = req.headers.authorization;
  if (authHeader?.startsWith("Bearer ")) {
    return authHeader.slice(7);
  }

  const cookieHeader = req.headers.cookie || "";
  const match = cookieHeader.match(new RegExp(`(?:^|;\\s*)${env.cookieName}=([^;]+)`));
  return match ? decodeURIComponent(match[1]) : null;
};

export const requireAuth = (req: Request, _res: Response, next: NextFunction) => {
  const token = getTokenFromRequest(req);
  if (!token) {
    throw new AppError("Missing session token", 401, "UNAUTHORIZED", "Authentication required");
  }

  try {
    req.user = verifySessionToken(token);
    next();
  } catch {
    throw new AppError("Invalid session token", 401, "UNAUTHORIZED", "Authentication required");
  }
};

export const requireRole = (...roles: string[]) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) {
      throw new AppError("Authentication required", 401, "UNAUTHORIZED", "Authentication required");
    }

    if (!roles.includes(req.user.role)) {
      throw new AppError("Insufficient permissions", 403, "FORBIDDEN", "You do not have access to this resource");
    }

    next();
  };
};
