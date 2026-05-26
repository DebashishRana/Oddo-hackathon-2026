import { Response } from "express";
import { ApiResponse } from "../types/api";

export const ok = <T>(res: Response, message: string, data?: T) => {
  const body: ApiResponse<T> = { success: true, message };
  if (data !== undefined) body.data = data;
  return res.json(body);
};

export const fail = (res: Response, status: number, message: string, code = "REQUEST_FAILED", details?: unknown) => {
  const body: ApiResponse = {
    success: false,
    message,
    error: { code, ...(details === undefined ? {} : { details }) }
  };
  return res.status(status).json(body);
};
