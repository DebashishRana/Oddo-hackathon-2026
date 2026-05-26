import { Pool } from "pg";

// Future-ready audit/reporting store. Runtime OTP state intentionally stays in Redis.
export const createPostgresPool = () => {
  if (!process.env.DATABASE_URL) return null;

  return new Pool({
    connectionString: process.env.DATABASE_URL,
    max: Number(process.env.PG_POOL_MAX || 10),
    idleTimeoutMillis: 30_000,
    connectionTimeoutMillis: 5_000
  });
};
