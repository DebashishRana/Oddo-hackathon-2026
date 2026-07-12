import fs from "fs/promises";
import path from "path";
import { getPool, closePool } from "../config/database";
import { logger } from "../utils/logger";

const migrationsDir = path.resolve(process.cwd(), "server/migrations");
const MAX_WAIT_MS = 60_000;
const RETRY_EVERY_MS = 2_000;

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const formatError = (error: unknown) => {
  if (!(error instanceof Error)) return String(error);
  const withCode = error as Error & { code?: string; detail?: string };
  return [withCode.message, withCode.code ? `code=${withCode.code}` : null, withCode.detail ? `detail=${withCode.detail}` : null]
    .filter(Boolean)
    .join(" | ");
};

const waitForDatabase = async () => {
  const started = Date.now();
  let attempt = 0;

  while (Date.now() - started < MAX_WAIT_MS) {
    attempt += 1;
    try {
      await getPool().query("SELECT 1");
      logger.info("database_ready", { attempt });
      return;
    } catch (error) {
      logger.warn("database_not_ready", {
        attempt,
        error: formatError(error),
        retryInMs: RETRY_EVERY_MS,
      });
      await sleep(RETRY_EVERY_MS);
    }
  }

  throw new Error(
    `Database not reachable within ${MAX_WAIT_MS / 1000}s. Wait until docker ps shows assetflow-db as (healthy), then retry. Confirm DATABASE_URL in server/.env.`
  );
};

const ensureMigrationsTable = async () => {
  await getPool().query(`
    CREATE TABLE IF NOT EXISTS schema_migrations (
      name TEXT PRIMARY KEY,
      applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);
};

const run = async () => {
  await waitForDatabase();
  await ensureMigrationsTable();
  const client = await getPool().connect();

  const files = (await fs.readdir(migrationsDir))
    .filter((file) => file.endsWith(".sql"))
    .sort();

  try {
    for (const file of files) {
      const applied = await client.query("SELECT 1 FROM schema_migrations WHERE name = $1 LIMIT 1", [file]);
      if (applied.rowCount) {
        continue;
      }

      const sql = await fs.readFile(path.join(migrationsDir, file), "utf8");
      logger.info("applying_migration", { file });
      await client.query("BEGIN");
      try {
        await client.query(sql);
        await client.query("INSERT INTO schema_migrations (name) VALUES ($1)", [file]);
        await client.query("COMMIT");
      } catch (error) {
        await client.query("ROLLBACK");
        throw error;
      }
    }
  } finally {
    client.release();
  }
};

run()
  .then(async () => {
    logger.info("migrations_complete");
    await closePool();
    process.exit(0);
  })
  .catch(async (error) => {
    logger.error("migrations_failed", { error: formatError(error) });
    await closePool();
    process.exit(1);
  });
