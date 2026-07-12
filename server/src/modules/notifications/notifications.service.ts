import { notificationRepository } from "../../db/repositories/notification.repository";
import { AppError } from "../../utils/errors";

export const notificationsService = {
  async listForUser(userId: number) {
    return notificationRepository.listForUser(userId);
  },

  async unreadCount(userId: number) {
    const items = await notificationRepository.listForUser(userId);
    return items.filter((n) => !n.is_read).length;
  },

  async markRead(id: number, userId: number) {
    const notification = await notificationRepository.markRead(id, userId);
    if (!notification) throw new AppError("Notification not found", 404, "NOT_FOUND", "Notification not found.");
    return notification;
  },

  async markAllRead(userId: number) {
    await notificationRepository.markAllRead(userId);
    return { success: true };
  },

  async listActivityLogs(limit?: number, offset?: number) {
    return notificationRepository.listActivityLogs(limit, offset);
  },
};
