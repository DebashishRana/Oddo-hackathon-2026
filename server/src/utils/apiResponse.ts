import { Response } from "express";
import type { ApiResponse } from "../types/api";

const toCamelKey = (key: string) => key.replace(/_([a-z])/g, (_, char: string) => char.toUpperCase());

export const toCamelCase = <T = unknown>(value: unknown): T => {
  if (Array.isArray(value)) {
    return value.map((item) => toCamelCase(item)) as T;
  }

  if (value instanceof Date) {
    return value.toISOString() as T;
  }

  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>).map(([key, nested]) => [toCamelKey(key), toCamelCase(nested)])
    ) as T;
  }

  return value as T;
};

export const ok = <T>(res: Response, message: string, data?: T) => {
  const body: ApiResponse<T> = { success: true, message };
  if (data !== undefined) {
    body.data = toCamelCase<T>(data);
  }

  return res.json(body);
};

export const fail = (res: Response, status: number, message: string, code = "REQUEST_FAILED", details?: unknown) => {
  const body: ApiResponse = {
    success: false,
    message,
    error: { code, ...(details === undefined ? {} : { details }) },
  };

  return res.status(status).json(body);
};
