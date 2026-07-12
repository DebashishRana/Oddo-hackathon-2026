import { Router } from "express";
import { analyticsRoutes } from "./analytics/analytics.routes";
import { authRoutes } from "./auth/auth.routes";
import { usersRoutes } from "./users/users.routes";
import { sampleEntityRoutes } from "./sample-entity/sample-entity.routes";
import { reportsRoutes } from "./reports/reports.routes";

export const apiRouter = Router();

apiRouter.use("/auth", authRoutes);
apiRouter.use("/analytics", analyticsRoutes);
apiRouter.use("/reports", reportsRoutes);
apiRouter.use("/users", usersRoutes);
apiRouter.use("/sample-entities", sampleEntityRoutes);
