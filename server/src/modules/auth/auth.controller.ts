import { Request, Response } from "express";
import { env } from "../../config/env";
import { AppError } from "../../utils/errors";
import { ok } from "../../utils/apiResponse";
import { authService } from "./auth.service";

const oauthStateCookieName = "assetflow_oauth_state";

const requireString = (value: unknown, field: string) => {
  if (typeof value !== "string" || !value.trim()) {
    throw new AppError(`Invalid ${field}`, 400, "INVALID_INPUT", `Please provide a valid ${field}.`);
  }

  return value.trim();
};

const getCookieOptions = () => ({
  httpOnly: true,
  sameSite: "lax" as const,
  secure: env.cookieSecure,
  domain: env.cookieDomain,
  path: "/",
});

const setSessionCookie = (res: Response, token: string) => {
  res.cookie(env.cookieName, token, {
    ...getCookieOptions(),
    maxAge: 1000 * 60 * 60 * 24 * 7,
  });
};

const clearAuthCookies = (res: Response) => {
  res.clearCookie(env.cookieName, getCookieOptions());
  res.clearCookie(oauthStateCookieName, getCookieOptions());
};

const readCookie = (cookieHeader: string | undefined, name: string) => {
  if (!cookieHeader) return null;
  const match = cookieHeader.match(new RegExp(`(?:^|;\\s*)${name}=([^;]+)`));
  return match ? decodeURIComponent(match[1]) : null;
};

export class AuthController {
  async register(req: Request, res: Response) {
    const email = requireString(req.body.email, "email").toLowerCase();
    const password = requireString(req.body.password, "password");
    const name = requireString(req.body.name, "name");
    const department = requireString(req.body.department, "department");
    const result = await authService.register({ email, password, name, department });

    // Auto-login when email verification is not required (local/hackathon mode)
    if (!result.verificationRequired) {
      const session = await authService.login({ email, password });
      setSessionCookie(res, session.token);
      return ok(res, "Account created and signed in.", {
        ...result,
        token: session.token,
        user: session.user,
      });
    }

    return ok(res, "Account created. Check your email to verify your account.", result);
  }

  async login(req: Request, res: Response) {
    const email = requireString(req.body.email, "email").toLowerCase();
    const password = requireString(req.body.password, "password");
    const session = await authService.login({ email, password });
    setSessionCookie(res, session.token);
    return ok(res, "Logged in successfully.", session);
  }

  async logout(_req: Request, res: Response) {
    clearAuthCookies(res);
    return ok(res, "Logged out successfully.");
  }

  async me(req: Request, res: Response) {
    const authUser = req.user;
    if (!authUser) {
      return ok(res, "No active session.", { user: null });
    }

    const session = await authService.me(authUser.id);
    return ok(res, "Current session retrieved.", session);
  }

  async googleStart(req: Request, res: Response) {
    const intent = req.query.intent === "signup" ? "signup" : "signin";
    const { url, state } = await authService.googleStartUrl(intent);
    res.cookie(oauthStateCookieName, state, {
      ...getCookieOptions(),
      maxAge: 1000 * 60 * 10,
    });
    return res.redirect(url);
  }

  async googleCallback(req: Request, res: Response) {
    const code = typeof req.query.code === "string" ? req.query.code : "";
    const state = typeof req.query.state === "string" ? req.query.state : "";
    const expectedState = readCookie(req.headers.cookie, oauthStateCookieName);

    if (!code || !state || !expectedState || state !== expectedState) {
      throw new AppError("Invalid Google OAuth state", 400, "GOOGLE_STATE_INVALID", "Google sign in could not be completed.");
    }

    const session = await authService.googleCallback(code);
    clearAuthCookies(res);
    setSessionCookie(res, session.token);
    return res.redirect(`${env.appUrl}/dashboard`);
  }

  async sendVerification(req: Request, res: Response) {
    const email = requireString(req.body.email, "email").toLowerCase();
    await authService.sendVerificationEmail(email);
    return ok(res, "If the account exists, a verification email has been sent.");
  }

  async verifyEmail(req: Request, res: Response) {
    const token = requireString(req.body.token ?? req.query.token, "token");
    const result = await authService.verifyEmail(token);
    return ok(res, "Email verified successfully.", result);
  }

  async forgotPassword(req: Request, res: Response) {
    const email = requireString(req.body.email, "email").toLowerCase();
    await authService.forgotPassword(email);
    return ok(res, "If the account exists, a reset link has been sent.");
  }

  async resetPassword(req: Request, res: Response) {
    const token = requireString(req.body.token, "token");
    const password = requireString(req.body.password, "password");
    const result = await authService.resetPassword(token, password);
    return ok(res, "Password updated successfully.", result);
  }
}

export const authController = new AuthController();
