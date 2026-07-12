import { Router } from "express";
import { requireAuth } from "../../middleware/auth";
import { bookingsController } from "./bookings.controller";

export const bookingsRoutes = Router();

bookingsRoutes.get("/calendar/:assetId", requireAuth, (req, res, next) => {
  bookingsController.calendar(req, res).catch(next);
});

bookingsRoutes.get("/", requireAuth, (req, res, next) => {
  bookingsController.list(req, res).catch(next);
});

bookingsRoutes.post("/", requireAuth, (req, res, next) => {
  bookingsController.create(req, res).catch(next);
});

bookingsRoutes.patch("/:id/cancel", requireAuth, (req, res, next) => {
  bookingsController.cancel(req, res).catch(next);
});

bookingsRoutes.patch("/:id/reschedule", requireAuth, (req, res, next) => {
  bookingsController.reschedule(req, res).catch(next);
});
