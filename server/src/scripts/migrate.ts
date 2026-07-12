import fs from "fs/promises";
import path from "path";
import { getPool, closePool } from "../config/database";
import { logger } from "../utils/logger";

const migrationsDir = path.resolve(process.cwd(), "server/migrations");

const ensureMigrationsTable = async () => {
  await getPool().query(`
    CREATE TABLE IF NOT EXISTS schema_migrations (
      name TEXT PRIMARY KEY,
      applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);
};

const run = async () => {
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
    logger.error("migrations_failed", { error: error instanceof Error ? error.message : String(error) });
    await closePool();
    process.exit(1);
  });
