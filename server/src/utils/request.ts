import { Request } from "express";

export const getClientIp = (req: Request) =>
  (req.headers["x-forwarded-for"]?.toString().split(",")[0] || req.ip || req.socket.remoteAddress || "unknown").trim();
