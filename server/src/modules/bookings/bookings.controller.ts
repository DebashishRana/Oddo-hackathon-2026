import { Request, Response } from "express";
import { ok } from "../../utils/apiResponse";
import { AppError } from "../../utils/errors";
import { bookingsService } from "./bookings.service";

export class BookingsController {
  async list(req: Request, res: Response) {
    const { assetId, bookedBy, status, limit, offset } = req.query;
    const filters: Record<string, unknown> = {};

    if (assetId) filters.assetId = Number(assetId);
    if (bookedBy) filters.bookedBy = Number(bookedBy);
    if (status) filters.status = status;
    if (limit) filters.limit = Number(limit);
    if (offset) filters.offset = Number(offset);

    const bookings = await bookingsService.list(filters);
    return ok(res, "Bookings retrieved.", { bookings });
  }

  async calendar(req: Request, res: Response) {
    const assetId = Number(req.params.assetId);
    if (!assetId) throw new AppError("Invalid asset id", 400, "VALIDATION_ERROR", "Invalid asset id.");

    const bookings = await bookingsService.getCalendar(assetId);
    return ok(res, "Calendar retrieved.", { bookings });
  }

  async create(req: Request, res: Response) {
    const { assetId, departmentId, startsAt, endsAt, purpose } = req.body;

    if (!assetId) throw new AppError("assetId is required", 400, "VALIDATION_ERROR", "Asset id is required.");
    if (!startsAt) throw new AppError("startsAt is required", 400, "VALIDATION_ERROR", "Start time is required.");
    if (!endsAt) throw new AppError("endsAt is required", 400, "VALIDATION_ERROR", "End time is required.");

    const booking = await bookingsService.book(
      {
        assetId: Number(assetId),
        bookedBy: req.user!.id,
        departmentId: departmentId ? Number(departmentId) : null,
        startsAt: new Date(startsAt),
        endsAt: new Date(endsAt),
        purpose: purpose ?? null,
      },
      req.user?.id
    );
    return ok(res, "Booking created.", { booking });
  }

  async cancel(req: Request, res: Response) {
    const id = Number(req.params.id);
    if (!id) throw new AppError("Invalid booking id", 400, "VALIDATION_ERROR", "Invalid booking id.");

    const booking = await bookingsService.cancel(id, req.user!.id, req.user!.role);
    return ok(res, "Booking cancelled.", { booking });
  }

  async reschedule(req: Request, res: Response) {
    const id = Number(req.params.id);
    if (!id) throw new AppError("Invalid booking id", 400, "VALIDATION_ERROR", "Invalid booking id.");

    const { startsAt, endsAt } = req.body;
    if (!startsAt || !endsAt) {
      throw new AppError("startsAt and endsAt are required", 400, "VALIDATION_ERROR", "Start and end time are required.");
    }

    const booking = await bookingsService.reschedule(id, new Date(startsAt), new Date(endsAt), req.user!.id, req.user!.role);
    return ok(res, "Booking rescheduled.", { booking });
  }
}

export const bookingsController = new BookingsController();
