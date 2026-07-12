import { getPool } from "../../config/database";
import type { User, UserWithRole } from "../models";

const mapUser = (row: Record<string, unknown>): User => ({
  id: Number(row.id),
  email: String(row.email),
  name: (row.name as string | null) ?? null,
  password_hash: (row.password_hash as string | null) ?? null,
  department: (row.department as string | null) ?? null,
  role_id: Number(row.role_id),
  auth_provider: (row.auth_provider as "local" | "google") || "local",
  provider_account_id: (row.provider_account_id as string | null) ?? null,
  is_active: Boolean(row.is_active),
  email_verified_at: row.email_verified_at ? new Date(String(row.email_verified_at)) : null,
  email_verification_token_hash: (row.email_verification_token_hash as string | null) ?? null,
  email_verification_token_expires_at: row.email_verification_token_expires_at ? new Date(String(row.email_verification_token_expires_at)) : null,
  password_reset_token_hash: (row.password_reset_token_hash as string | null) ?? null,
  password_reset_token_expires_at: row.password_reset_token_expires_at ? new Date(String(row.password_reset_token_expires_at)) : null,
  created_at: new Date(String(row.created_at)),
  updated_at: new Date(String(row.updated_at)),
});

const mapUserWithRole = (row: Record<string, unknown>): UserWithRole => ({
  id: Number(row.id),
  email: String(row.email),
  name: (row.name as string | null) ?? null,
  department: (row.department as string | null) ?? null,
  role_id: Number(row.role_id),
  role_slug: String(row.role_slug),
  role_name: String(row.role_name),
  is_active: Boolean(row.is_active),
  email_verified_at: row.email_verified_at ? new Date(String(row.email_verified_at)) : null,
  created_at: new Date(String(row.created_at)),
  updated_at: new Date(String(row.updated_at)),
});

export type CreateUserInput = {
  email: string;
  name?: string;
  department?: string | null;
  passwordHash?: string | null;
  roleId: number;
  authProvider?: "local" | "google";
  providerAccountId?: string | null;
  isActive?: boolean;
  emailVerifiedAt?: Date | null;
  emailVerificationTokenHash?: string | null;
  emailVerificationTokenExpiresAt?: Date | null;
  passwordResetTokenHash?: string | null;
  passwordResetTokenExpiresAt?: Date | null;
};

export type UpdateUserInput = {
  name?: string;
  department?: string | null;
  roleId?: number;
  passwordHash?: string | null;
  authProvider?: "local" | "google";
  providerAccountId?: string | null;
  isActive?: boolean;
  emailVerifiedAt?: Date | null;
  emailVerificationTokenHash?: string | null;
  emailVerificationTokenExpiresAt?: Date | null;
  passwordResetTokenHash?: string | null;
  passwordResetTokenExpiresAt?: Date | null;
};

export const userRepository = {
  async findByEmail(email: string): Promise<User | null> {
    const result = await getPool().query(
      `SELECT id, email, name, password_hash, department, role_id, auth_provider, provider_account_id,
              is_active, email_verified_at, email_verification_token_hash, email_verification_token_expires_at,
              password_reset_token_hash, password_reset_token_expires_at,
              created_at, updated_at
       FROM users WHERE email = $1 LIMIT 1`,
      [email]
    );
    return result.rows[0] ? mapUser(result.rows[0]) : null;
  },

  async findById(id: number): Promise<UserWithRole | null> {
    const result = await getPool().query(
      `SELECT u.id, u.email, u.name, u.department, u.role_id, r.slug AS role_slug, r.name AS role_name,
              u.is_active, u.email_verified_at, u.created_at, u.updated_at
       FROM users u
       JOIN roles r ON r.id = u.role_id
       WHERE u.id = $1
       LIMIT 1`,
      [id]
    );
    return result.rows[0] ? mapUserWithRole(result.rows[0]) : null;
  },

  async list(): Promise<UserWithRole[]> {
    const result = await getPool().query(
      `SELECT u.id, u.email, u.name, u.department, u.role_id, r.slug AS role_slug, r.name AS role_name,
              u.is_active, u.email_verified_at, u.created_at, u.updated_at
       FROM users u
       JOIN roles r ON r.id = u.role_id
       ORDER BY u.created_at DESC`
    );
    return result.rows.map(mapUserWithRole);
  },

  async create(input: CreateUserInput): Promise<User> {
    const result = await getPool().query(
      `INSERT INTO users (
        email, name, department, password_hash, role_id, auth_provider, provider_account_id, is_active,
        email_verified_at, email_verification_token_hash, email_verification_token_expires_at,
        password_reset_token_hash, password_reset_token_expires_at
      )
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
       RETURNING id, email, name, password_hash, role_id, auth_provider, provider_account_id,
                 department, is_active, email_verified_at, email_verification_token_hash,
                 email_verification_token_expires_at, password_reset_token_hash, password_reset_token_expires_at,
                 created_at, updated_at`,
      [
        input.email,
        input.name || null,
        input.department || null,
        input.passwordHash ?? null,
        input.roleId,
        input.authProvider || "local",
        input.providerAccountId || null,
        input.isActive ?? false,
        input.emailVerifiedAt || null,
        input.emailVerificationTokenHash || null,
        input.emailVerificationTokenExpiresAt || null,
        input.passwordResetTokenHash || null,
        input.passwordResetTokenExpiresAt || null,
      ]
    );
    return mapUser(result.rows[0]);
  },

  async update(id: number, input: UpdateUserInput): Promise<UserWithRole | null> {
    const fields: string[] = [];
    const values: Array<string | number | Date | boolean | null> = [];
    let index = 1;

    if (input.name !== undefined) {
      fields.push(`name = $${index++}`);
      values.push(input.name);
    }

    if (input.department !== undefined) {
      fields.push(`department = $${index++}`);
      values.push(input.department);
    }

    if (input.roleId !== undefined) {
      fields.push(`role_id = $${index++}`);
      values.push(input.roleId);
    }

    if (input.passwordHash !== undefined) {
      fields.push(`password_hash = $${index++}`);
      values.push(input.passwordHash);
    }

    if (input.authProvider !== undefined) {
      fields.push(`auth_provider = $${index++}`);
      values.push(input.authProvider);
    }

    if (input.providerAccountId !== undefined) {
      fields.push(`provider_account_id = $${index++}`);
      values.push(input.providerAccountId);
    }

    if (input.isActive !== undefined) {
      fields.push(`is_active = $${index++}`);
      values.push(input.isActive);
    }

    if (input.emailVerifiedAt !== undefined) {
      fields.push(`email_verified_at = $${index++}`);
      values.push(input.emailVerifiedAt);
    }

    if (input.emailVerificationTokenHash !== undefined) {
      fields.push(`email_verification_token_hash = $${index++}`);
      values.push(input.emailVerificationTokenHash);
    }

    if (input.emailVerificationTokenExpiresAt !== undefined) {
      fields.push(`email_verification_token_expires_at = $${index++}`);
      values.push(input.emailVerificationTokenExpiresAt);
    }

    if (input.passwordResetTokenHash !== undefined) {
      fields.push(`password_reset_token_hash = $${index++}`);
      values.push(input.passwordResetTokenHash);
    }

    if (input.passwordResetTokenExpiresAt !== undefined) {
      fields.push(`password_reset_token_expires_at = $${index++}`);
      values.push(input.passwordResetTokenExpiresAt);
    }

    if (!fields.length) {
      return this.findById(id);
    }

    values.push(id);
    const result = await getPool().query(
      `UPDATE users
       SET ${fields.join(", ")}, updated_at = NOW()
       WHERE id = $${index}
       RETURNING id, email, name, department, role_id, created_at, updated_at`,
      values
    );

    if (!result.rows[0]) {
      return null;
    }

    return this.findById(id);
  },

  async findByProviderAccountId(providerAccountId: string): Promise<User | null> {
    const result = await getPool().query(
      `SELECT id, email, name, password_hash, department, role_id, auth_provider, provider_account_id,
              is_active, email_verified_at, email_verification_token_hash, email_verification_token_expires_at,
              password_reset_token_hash, password_reset_token_expires_at,
              created_at, updated_at
       FROM users
       WHERE provider_account_id = $1
       LIMIT 1`,
      [providerAccountId]
    );
    return result.rows[0] ? mapUser(result.rows[0]) : null;
  },

  async findByEmailVerificationTokenHash(tokenHash: string): Promise<User | null> {
    const result = await getPool().query(
      `SELECT id, email, name, password_hash, department, role_id, auth_provider, provider_account_id,
              is_active, email_verified_at, email_verification_token_hash, email_verification_token_expires_at,
              password_reset_token_hash, password_reset_token_expires_at,
              created_at, updated_at
       FROM users
       WHERE email_verification_token_hash = $1
       LIMIT 1`,
      [tokenHash]
    );
    return result.rows[0] ? mapUser(result.rows[0]) : null;
  },

  async findByPasswordResetTokenHash(tokenHash: string): Promise<User | null> {
    const result = await getPool().query(
      `SELECT id, email, name, password_hash, department, role_id, auth_provider, provider_account_id,
              is_active, email_verified_at, email_verification_token_hash, email_verification_token_expires_at,
              password_reset_token_hash, password_reset_token_expires_at,
              created_at, updated_at
       FROM users
       WHERE password_reset_token_hash = $1
       LIMIT 1`,
      [tokenHash]
    );
    return result.rows[0] ? mapUser(result.rows[0]) : null;
  },
};
