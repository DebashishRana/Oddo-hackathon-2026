import { bookingRepository, type CreateBookingInput } from "../../db/repositories/booking.repository";
import { assetRepository } from "../../db/repositories/asset.repository";
import { AppError } from "../../utils/errors";
import { activityService } from "../../services/activity.service";

export const bookingsService = {
  async list(filters: Parameters<typeof bookingRepository.list>[0] = {}) {
    await bookingRepository.refreshStatuses();
    return bookingRepository.list(filters);
  },

  async getCalendar(assetId: number) {
    await bookingRepository.refreshStatuses();
    return bookingRepository.getCalendar(assetId);
  },

  async book(input: CreateBookingInput, actorId?: number) {
    const asset = await assetRepository.findById(input.assetId);
    if (!asset) throw new AppError("Asset not found", 404, "NOT_FOUND", "Asset not found.");

    if (!asset.is_shared_bookable) {
      throw new AppError("Asset is not bookable", 400, "NOT_BOOKABLE", "This asset is not available for booking.");
    }

    if (new Date(input.endsAt) <= new Date(input.startsAt)) {
      throw new AppError("End time must be after start time", 400, "VALIDATION_ERROR", "Booking end time must be after start time.");
    }

    const hasOverlap = await bookingRepository.checkOverlap(input.assetId, input.startsAt, input.endsAt);
    if (hasOverlap) {
      throw new AppError("Booking slot overlaps with existing booking", 409, "BOOKING_OVERLAP", "This time slot is already booked. Please choose a different time.");
    }

    const booking = await bookingRepository.create(input);
    await activityService.log({
      actorId,
      action: "booking.created",
      entityType: "booking",
      entityId: booking.id,
      metadata: { assetId: input.assetId, startsAt: input.startsAt, endsAt: input.endsAt },
    });
    return booking;
  },

  async cancel(id: number, userId: number, userRole: string) {
    await bookingRepository.refreshStatuses();
    const booking = await bookingRepository.findById(id);
    if (!booking) throw new AppError("Booking not found", 404, "NOT_FOUND", "Booking not found.");

    if (booking.status === "cancelled") throw new AppError("Already cancelled", 400, "INVALID_STATE", "Booking is already cancelled.");
    if (booking.status === "completed") throw new AppError("Cannot cancel completed booking", 400, "INVALID_STATE", "Cannot cancel a completed booking.");

    const canCancel = booking.booked_by === userId || ["admin", "asset_manager"].includes(userRole);
    if (!canCancel) throw new AppError("Forbidden", 403, "FORBIDDEN", "You cannot cancel this booking.");

    const updated = await bookingRepository.updateStatus(id, "cancelled");
    await activityService.log({
      actorId: userId,
      action: "booking.cancelled",
      entityType: "booking",
      entityId: id,
      metadata: {},
    });
    return updated;
  },

  async reschedule(id: number, startsAt: Date, endsAt: Date, userId: number, userRole: string) {
    await bookingRepository.refreshStatuses();
    const booking = await bookingRepository.findById(id);
    if (!booking) throw new AppError("Booking not found", 404, "NOT_FOUND", "Booking not found.");

    if (booking.status === "cancelled" || booking.status === "completed") {
      throw new AppError("Cannot reschedule", 400, "INVALID_STATE", "Cannot reschedule a cancelled or completed booking.");
    }

    const canEdit = booking.booked_by === userId || ["admin", "asset_manager"].includes(userRole);
    if (!canEdit) throw new AppError("Forbidden", 403, "FORBIDDEN", "You cannot reschedule this booking.");

    if (endsAt <= startsAt) {
      throw new AppError("End time must be after start time", 400, "VALIDATION_ERROR", "End time must be after start time.");
    }

    const hasOverlap = await bookingRepository.checkOverlap(booking.asset_id, startsAt, endsAt, id);
    if (hasOverlap) {
      throw new AppError("Booking slot overlaps", 409, "BOOKING_OVERLAP", "This time slot is already booked.");
    }

    const updated = await bookingRepository.reschedule(id, startsAt, endsAt);
    // Reset to upcoming if it was ongoing
    if (updated && updated.status === "ongoing" && startsAt > new Date()) {
      await bookingRepository.updateStatus(id, "upcoming");
    }

    await activityService.log({
      actorId: userId,
      action: "booking.rescheduled",
      entityType: "booking",
      entityId: id,
      metadata: { startsAt, endsAt },
    });
    return bookingRepository.findById(id);
  },
};
