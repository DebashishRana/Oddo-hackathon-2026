import { Request, Response } from "express";
import { ok } from "../../utils/apiResponse";
import { AppError } from "../../utils/errors";
import { notificationsService } from "./notifications.service";

export class NotificationsController {
  async list(req: Request, res: Response) {
    const notifications = await notificationsService.listForUser(req.user!.id);
    return ok(res, "Notifications retrieved.", { notifications });
  }

  async markRead(req: Request, res: Response) {
    const id = Number(req.params.id);
    if (!id) throw new AppError("Invalid notification id", 400, "VALIDATION_ERROR", "Invalid notification id.");
    const notification = await notificationsService.markRead(id, req.user!.id);
    return ok(res, "Notification marked as read.", { notification });
  }

  async markAllRead(req: Request, res: Response) {
    await notificationsService.markAllRead(req.user!.id);
    return ok(res, "All notifications marked as read.");
  }

  async activityLogs(req: Request, res: Response) {
    const { limit, offset } = req.query;
    const logs = await notificationsService.listActivityLogs(
      limit ? Number(limit) : undefined,
      offset ? Number(offset) : undefined
    );
    return ok(res, "Activity logs retrieved.", { logs });
  }
}

export const notificationsController = new NotificationsController();
