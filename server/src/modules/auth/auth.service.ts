import crypto from "crypto";
import { OAuth2Client } from "google-auth-library";
import { env } from "../../config/env";
import { roleRepository } from "../../db/repositories/role.repository";
import { userRepository } from "../../db/repositories/user.repository";
import { AppError } from "../../utils/errors";
import { hashPassword, verifyPassword } from "../../utils/password";
import { signSessionToken } from "../../utils/jwt";
import { emailService } from "../../services/email.service";

export type AuthUser = {
  id: number;
  email: string;
  name: string | null;
  department: string | null;
  role: string;
  isActive: boolean;
  emailVerifiedAt: Date | null;
};

const googleClient = env.googleClientId && env.googleClientSecret
  ? new OAuth2Client(env.googleClientId, env.googleClientSecret, env.googleRedirectUri)
  : null;

const tokenToHash = (token: string) => crypto.createHash("sha256").update(token).digest("hex");

const generateToken = () => crypto.randomBytes(24).toString("hex");

const toAuthUser = (user: {
  id: number;
  email: string;
  name: string | null;
  department: string | null;
  role_slug: string;
  is_active: boolean;
  email_verified_at?: Date | null;
}) => ({
  id: user.id,
  email: user.email,
  name: user.name,
  department: user.department,
  role: user.role_slug,
  isActive: user.is_active,
  emailVerifiedAt: user.email_verified_at ?? null,
});

export class AuthService {
  async register(input: { email: string; password: string; name: string; department: string }) {
    const existing = await userRepository.findByEmail(input.email);
    if (existing) {
      throw new AppError("User already exists", 409, "USER_EXISTS", "An account with this email already exists.");
    }

    const employeeRole = await this.getEmployeeRole();
    const passwordHash = await hashPassword(input.password);
    const user = await userRepository.create({
      email: input.email,
      name: input.name,
      department: input.department,
      passwordHash,
      roleId: employeeRole.id,
      authProvider: "local",
      isActive: false,
    });

    const verificationToken = generateToken();
    await this.storeEmailVerificationToken(user.id, verificationToken);
    await this.dispatchVerificationEmail(user.email, verificationToken);

    return {
      user: toAuthUser({
        id: user.id,
        email: user.email,
        name: user.name,
        department: user.department,
        role_slug: employeeRole.slug,
        is_active: false,
        email_verified_at: null,
      }),
      verificationRequired: true,
    };
  }

  async login(input: { email: string; password: string }) {
    const normalizedEmail = input.email.toLowerCase();

    const user = await userRepository.findByEmail(normalizedEmail);
    if (!user || !user.password_hash) {
      throw new AppError("Invalid credentials", 401, "INVALID_CREDENTIALS", "Email or password is incorrect.");
    }

    const valid = await verifyPassword(input.password, user.password_hash);
    if (!valid) {
      throw new AppError("Invalid credentials", 401, "INVALID_CREDENTIALS", "Email or password is incorrect.");
    }

    if (!user.is_active) {
      throw new AppError(
        "Inactive account",
        403,
        "ACCOUNT_INACTIVE",
        "Your account is inactive. Please verify your email or contact an administrator."
      );
    }

    const fullUser = await userRepository.findById(user.id);
    if (!fullUser) {
      throw new AppError("User record missing", 500, "USER_MISSING", "Unable to log in.");
    }

    return this.buildSession({
      id: fullUser.id,
      email: fullUser.email,
      name: fullUser.name,
      department: fullUser.department,
      role_slug: fullUser.role_slug,
      is_active: fullUser.is_active,
      email_verified_at: user.email_verified_at,
    });
  }

  async googleStartUrl(_intent: "signin" | "signup") {
    if (!googleClient) {
      throw new AppError("Google sign in not configured", 500, "GOOGLE_NOT_CONFIGURED", "Google sign in is not configured.");
    }

    const state = crypto.randomBytes(16).toString("hex");
    const url = googleClient.generateAuthUrl({
      access_type: "online",
      prompt: "select_account",
      scope: ["openid", "email", "profile"],
      state,
      include_granted_scopes: true,
    });

    return { url, state };
  }

  async googleCallback(code: string) {
    if (!googleClient) {
      throw new AppError("Google sign in not configured", 500, "GOOGLE_NOT_CONFIGURED", "Google sign in is not configured.");
    }

    const { tokens } = await googleClient.getToken(code);
    if (!tokens.id_token) {
      throw new AppError("Google sign in failed", 400, "GOOGLE_AUTH_FAILED", "Unable to sign in with Google.");
    }

    const ticket = await googleClient.verifyIdToken({
      idToken: tokens.id_token,
      audience: env.googleClientId,
    });

    const payload = ticket.getPayload();
    if (!payload?.email || !payload.sub) {
      throw new AppError("Google profile incomplete", 400, "GOOGLE_PROFILE_INVALID", "Unable to sign in with Google.");
    }

    const employeeRole = await this.getEmployeeRole();
    const existingByGoogle = await userRepository.findByProviderAccountId(payload.sub);
    const existingByEmail = await userRepository.findByEmail(payload.email);
    let user = existingByGoogle || existingByEmail;

    if (!user) {
      user = await userRepository.create({
        email: payload.email,
        name: payload.name || undefined,
        department: null,
        passwordHash: null,
        roleId: employeeRole.id,
        authProvider: "google",
        providerAccountId: payload.sub,
        isActive: true,
        emailVerifiedAt: new Date(),
      });
    } else {
      await userRepository.update(user.id, {
        name: payload.name || user.name || undefined,
        authProvider: "google",
        providerAccountId: payload.sub,
        isActive: true,
        emailVerifiedAt: new Date(),
      });
      user = (await userRepository.findByEmail(payload.email)) || user;
    }

    const fullUser = await userRepository.findById(user.id);
    if (!fullUser) {
      throw new AppError("User record missing", 500, "USER_MISSING", "Unable to complete Google sign in.");
    }

    return this.buildSession({
      id: fullUser.id,
      email: fullUser.email,
      name: fullUser.name,
      department: fullUser.department,
      role_slug: fullUser.role_slug,
      is_active: fullUser.is_active,
      email_verified_at: new Date(),
    });
  }

  async me(userId: number) {
    const user = await userRepository.findById(userId);
    if (!user) {
      throw new AppError("User not found", 404, "USER_NOT_FOUND", "User not found.");
    }

    return { user: toAuthUser(user) };
  }

  async updateProfile(userId: number, input: { name?: string; department?: string; password?: string }) {
    const updateData: { name?: string; department?: string | null; passwordHash?: string | null } = {};
    if (input.name !== undefined) {
      updateData.name = input.name;
    }

    if (input.department !== undefined) {
      updateData.department = input.department;
    }

    if (input.password) {
      updateData.passwordHash = await hashPassword(input.password);
    }

    const updated = await userRepository.update(userId, updateData);
    if (!updated) {
      throw new AppError("User not found", 404, "USER_NOT_FOUND", "User not found.");
    }

    return { user: this.toPublicProfile(updated) };
  }

  async listUsers() {
    const users = await userRepository.list();
    return users.map((user) => this.toPublicProfile(user));
  }

  async sendVerificationEmail(email: string) {
    const user = await userRepository.findByEmail(email);
    if (!user) {
      return { sent: true };
    }

    const token = generateToken();
    await this.storeEmailVerificationToken(user.id, token);
    await this.dispatchVerificationEmail(user.email, token);
    return { sent: true };
  }

  async verifyEmail(token: string) {
    const tokenHash = tokenToHash(token);
    const user = await userRepository.findByEmailVerificationTokenHash(tokenHash);
    if (!user) {
      throw new AppError("Verification token invalid", 400, "TOKEN_INVALID", "The verification link is invalid or has expired.");
    }

    if (!user.email_verification_token_expires_at || user.email_verification_token_expires_at.getTime() < Date.now()) {
      throw new AppError("Verification token expired", 400, "TOKEN_EXPIRED", "The verification link is invalid or has expired.");
    }

    await userRepository.update(user.id, {
      isActive: true,
      emailVerifiedAt: new Date(),
      emailVerificationTokenHash: null,
      emailVerificationTokenExpiresAt: null,
    });

    return { verified: true };
  }

  async forgotPassword(email: string) {
    const user = await userRepository.findByEmail(email);
    if (!user) {
      return { sent: true };
    }

    const token = generateToken();
    const expiresAt = new Date(Date.now() + env.passwordResetTtlMinutes * 60 * 1000);
    await userRepository.update(user.id, {
      passwordResetTokenHash: tokenToHash(token),
      passwordResetTokenExpiresAt: expiresAt,
    });

    const resetUrl = `${env.appUrl}/auth/reset-password?token=${encodeURIComponent(token)}`;
    await emailService.sendPasswordResetEmail(user.email, resetUrl);
    return { sent: true };
  }

  async resetPassword(token: string, password: string) {
    const tokenHash = tokenToHash(token);
    const user = await userRepository.findByPasswordResetTokenHash(tokenHash);
    if (!user) {
      throw new AppError("Password reset token invalid", 400, "TOKEN_INVALID", "The password reset link is invalid or has expired.");
    }

    if (!user.password_reset_token_expires_at || user.password_reset_token_expires_at.getTime() < Date.now()) {
      throw new AppError("Password reset token expired", 400, "TOKEN_EXPIRED", "The password reset link is invalid or has expired.");
    }

    await userRepository.update(user.id, {
      passwordHash: await hashPassword(password),
      passwordResetTokenHash: null,
      passwordResetTokenExpiresAt: null,
      isActive: true,
    });

    return { reset: true };
  }

  private async getEmployeeRole() {
    const employee = await roleRepository.findBySlug("employee");
    if (employee) return employee;

    const member = await roleRepository.findBySlug("member");
    if (member) return member;

    const admin = await roleRepository.findBySlug("admin");
    if (admin) return admin;

    throw new AppError("Default role missing", 500, "ROLE_MISSING", "Role setup is incomplete.");
  }

  private async storeEmailVerificationToken(userId: number, token: string) {
    const expiresAt = new Date(Date.now() + env.emailVerificationTtlMinutes * 60 * 1000);
    await userRepository.update(userId, {
      emailVerificationTokenHash: tokenToHash(token),
      emailVerificationTokenExpiresAt: expiresAt,
    });
  }

  private async dispatchVerificationEmail(email: string, token: string) {
    const verifyUrl = `${env.appUrl}/auth/verify-email?token=${encodeURIComponent(token)}`;
    await emailService.sendVerificationEmail(email, verifyUrl);
  }

  private toPublicProfile(user: {
    id: number;
    email: string;
    name: string | null;
    department: string | null;
    role_slug: string;
    is_active: boolean;
    created_at: Date;
    updated_at: Date;
  }) {
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      department: user.department,
      role: user.role_slug,
      isActive: user.is_active,
      createdAt: user.created_at,
      updatedAt: user.updated_at,
    };
  }

  private buildSession(user: {
    id: number;
    email: string;
    name: string | null;
    department: string | null;
    role_slug: string;
    is_active: boolean;
    email_verified_at?: Date | null;
  }) {
    const authUser = toAuthUser(user);
    return {
      user: authUser,
      token: signSessionToken({
        id: authUser.id,
        email: authUser.email,
        role: authUser.role,
      }),
    };
  }
}

export const authService = new AuthService();
