import jwt, { SignOptions } from "jsonwebtoken";
import { env } from "../config/env";

export type SessionClaims = {
  sub: string;
  email: string;
  assurance_level: "email_verified";
  aud: "dectra-api";
};

export const signSessionToken = (email: string) => {
  const claims: SessionClaims = {
    sub: `email:${email}`,
    email,
    assurance_level: "email_verified",
    aud: "dectra-api"
  };

  return jwt.sign(claims, env.jwtSecret, {
    expiresIn: env.jwtExpiresIn,
    issuer: "dectra-auth"
  } as SignOptions);
};
