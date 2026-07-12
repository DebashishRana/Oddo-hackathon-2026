import { getPool } from "../../config/database";
import type { ActivityLog, Notification } from "../models";

const mapNotification = (row: Record<string, unknown>): Notification => ({
  id: Number(row.id),
  user_id: Number(row.user_id),
  type: String(row.type),
  title: String(row.title),
  body: String(row.body),
  entity_type: (row.entity_type as string | null) ?? null,
  entity_id: row.entity_id != null ? Number(row.entity_id) : null,
  is_read: Boolean(row.is_read),
  created_at: new Date(String(row.created_at)),
});

const mapActivityLog = (row: Record<string, unknown>): ActivityLog & { actor_name?: string } => ({
  id: Number(row.id),
  actor_id: row.actor_id != null ? Number(row.actor_id) : null,
  action: String(row.action),
  entity_type: String(row.entity_type),
  entity_id: row.entity_id != null ? Number(row.entity_id) : null,
  metadata: (row.metadata as Record<string, unknown>) ?? {},
  created_at: new Date(String(row.created_at)),
  actor_name: (row.actor_name as string | null) ?? undefined,
});

export const notificationRepository = {
  async listForUser(userId: number, limit = 50): Promise<Notification[]> {
    const result = await getPool().query(
      `SELECT * FROM notifications WHERE user_id = $1 ORDER BY created_at DESC LIMIT $2`,
      [userId, limit]
    );
    return result.rows.map(mapNotification);
  },

  async markRead(id: number, userId: number): Promise<Notification | null> {
    const result = await getPool().query(
      `UPDATE notifications SET is_read = TRUE WHERE id = $1 AND user_id = $2 RETURNING *`,
      [id, userId]
    );
    return result.rows[0] ? mapNotification(result.rows[0]) : null;
  },

  async markAllRead(userId: number): Promise<void> {
    await getPool().query(
      `UPDATE notifications SET is_read = TRUE WHERE user_id = $1 AND is_read = FALSE`,
      [userId]
    );
  },

  async listActivityLogs(limit = 100, offset = 0): Promise<Array<ActivityLog & { actor_name?: string }>> {
    const result = await getPool().query(
      `SELECT al.*, u.name AS actor_name
       FROM activity_logs al
       LEFT JOIN users u ON u.id = al.actor_id
       ORDER BY al.created_at DESC
       LIMIT $1 OFFSET $2`,
      [limit, offset]
    );
    return result.rows.map(mapActivityLog);
  },
};
