import jwt from "jsonwebtoken";
import { env } from "../config/env";

export type JwtUser = {
  id: number;
  email: string;
  role: string;
};

export type SessionClaims = JwtUser & {
  aud: "assetflow-api";
};

export const signSessionToken = (user: JwtUser) => {
  const claims: SessionClaims = {
    ...user,
    aud: "assetflow-api",
  };

  return jwt.sign(claims, env.jwtSecret, {
    expiresIn: env.jwtExpiresIn as jwt.SignOptions["expiresIn"],
    issuer: "assetflow-auth",
  });
};

export const verifySessionToken = (token: string) => {
  const claims = jwt.verify(token, env.jwtSecret) as SessionClaims;
  return {
    id: claims.id,
    email: claims.email,
    role: claims.role,
  };
};
