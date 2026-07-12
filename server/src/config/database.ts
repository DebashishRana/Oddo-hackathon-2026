import { Pool } from "pg";
import { env } from "./env";
import { logger } from "../utils/logger";

let pool: Pool | null = null;

export const getPool = () => {
  if (pool) {
    return pool;
  }

  pool = new Pool({
    connectionString: env.databaseUrl,
    ssl: env.dbSsl ? { rejectUnauthorized: false } : undefined,
    max: Number(process.env.PG_POOL_MAX || 10),
    idleTimeoutMillis: 30_000,
    connectionTimeoutMillis: 5_000,
  });

  pool.on("error", (error) => {
    logger.error("database_pool_error", { error: error.message });
  });

  return pool;
};

export const closePool = async () => {
  if (!pool) {
    return;
  }

  await pool.end();
  pool = null;
};
