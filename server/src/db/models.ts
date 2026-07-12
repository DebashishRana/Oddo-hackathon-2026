export type Role = {
  id: number;
  slug: string;
  name: string;
  created_at: Date;
};

export type User = {
  id: number;
  email: string;
  name: string | null;
  password_hash: string | null;
  department: string | null;
  role_id: number;
  auth_provider: "local" | "google";
  provider_account_id: string | null;
  is_active: boolean;
  email_verified_at: Date | null;
  email_verification_token_hash: string | null;
  email_verification_token_expires_at: Date | null;
  password_reset_token_hash: string | null;
  password_reset_token_expires_at: Date | null;
  created_at: Date;
  updated_at: Date;
};

export type UserWithRole = {
  id: number;
  email: string;
  name: string | null;
  department: string | null;
  role_id: number;
  role_slug: string;
  role_name: string;
  is_active: boolean;
  email_verified_at: Date | null;
  created_at: Date;
  updated_at: Date;
};

export type SampleEntity = {
  id: number;
  name: string;
  status: string;
  owner_user_id: number | null;
  created_at: Date;
};
