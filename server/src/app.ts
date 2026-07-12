import cors from "cors";
import express from "express";
import helmet from "helmet";
import { env } from "./config/env";
import { apiRouter } from "./modules";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler";
import { requestContext } from "./middleware/requestContext";
import { sanitizeInput } from "./middleware/sanitize";
import { ok } from "./utils/apiResponse";

export const createApp = () => {
  const app = express();

  app.set("trust proxy", 1);
  app.use(helmet());
  app.use(
    cors({
      origin: env.corsOrigins.length ? env.corsOrigins : true,
      credentials: true,
    })
  );
  app.use(express.json({ limit: "32kb" }));
  app.use(requestContext);
  app.use(sanitizeInput);

  app.get("/health", (_req, res) => {
    return ok(res, `${env.appName} is healthy.`, {
      uptime: process.uptime(),
      environment: env.nodeEnv,
    });
  });

  app.use("/api", apiRouter);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
};
