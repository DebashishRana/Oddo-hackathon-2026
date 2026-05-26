import { NextFunction, Request, Response } from "express";

const dangerousKeys = new Set(["__proto__", "constructor", "prototype"]);

const sanitizeValue = (value: unknown): unknown => {
  if (Array.isArray(value)) {
    return value.map(sanitizeValue);
  }

  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>)
        .filter(([key]) => !dangerousKeys.has(key))
        .map(([key, nestedValue]) => [key, sanitizeValue(nestedValue)])
    );
  }

  if (typeof value === "string") {
    return value.replace(/\u0000/g, "").trim();
  }

  return value;
};

export const sanitizeInput = (req: Request, _res: Response, next: NextFunction) => {
  req.body = sanitizeValue(req.body);
  next();
};
