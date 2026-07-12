import type { JwtUser } from "../utils/jwt";

declare global {
  namespace Express {
    interface Request {
      context: {
        requestId: string;
        ip: string;
        userAgent?: string;
      };
      user?: JwtUser;
    }
  }
}

export {};
