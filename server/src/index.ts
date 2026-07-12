import { createApp } from "./app";
import { env } from "./config/env";
import { logger } from "./utils/logger";

const app = createApp();

const server = app.listen(env.port, () => {
  logger.info("server_started", {
    port: env.port,
    environment: env.nodeEnv,
    appName: env.appName,
  });
});

const shutdown = (signal: string) => {
  logger.info("server_shutdown_started", { signal });
  server.close(() => {
    logger.info("server_shutdown_complete");
    process.exit(0);
  });
};

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));
