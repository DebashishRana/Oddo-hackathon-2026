import crypto from "crypto";
import { NextFunction, Request, Response } from "express";
import { getClientIp } from "../utils/request";

export const requestContext = (req: Request, res: Response, next: NextFunction) => {
  const requestId = req.headers["x-request-id"]?.toString() || crypto.randomUUID();

  req.context = {
    requestId,
    ip: getClientIp(req),
    userAgent: req.headers["user-agent"],
  };

  res.setHeader("x-request-id", requestId);
  next();
};
