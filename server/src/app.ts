import cors from "cors";
import express from "express";
import helmet from "helmet";
import { env } from "./config/env";
import { authRoutes } from "./routes/auth.routes";
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
      origin: env.corsOrigins.length > 0 ? env.corsOrigins : false,
      credentials: true
    })
  );
  app.use(express.json({ limit: "32kb" }));
  app.use(requestContext);
  app.use(sanitizeInput);

  app.get("/health", (_req, res) => ok(res, "Dectra email verification service is healthy.", { uptime: process.uptime() }));
  app.use("/auth", authRoutes);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
};
