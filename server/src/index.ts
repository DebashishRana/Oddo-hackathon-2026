import { createApp } from "./app";
import { env } from "./config/env";
import { redis } from "./config/redis";
import { logger } from "./utils/logger";

const app = createApp();

const server = app.listen(env.port, () => {
  logger.info("server_started", {
    port: env.port,
    environment: env.nodeEnv
  });
});

const shutdown = async (signal: string) => {
  logger.info("server_shutdown_started", { signal });
  server.close(async () => {
    await redis.quit();
    logger.info("server_shutdown_complete");
    process.exit(0);
  });
};

process.on("SIGTERM", () => {
  void shutdown("SIGTERM");
});

process.on("SIGINT", () => {
  void shutdown("SIGINT");
});
