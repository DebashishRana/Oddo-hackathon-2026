import { getPool } from "../config/database";

export type CreateNotificationInput = {
  userId: number;
  type: string;
  title: string;
  body: string;
  entityType?: string | null;
  entityId?: number | null;
};

export type CreateActivityLogInput = {
  actorId?: number | null;
  action: string;
  entityType: string;
  entityId?: number | null;
  metadata?: Record<string, unknown>;
};

export const activityService = {
  async notify(input: CreateNotificationInput) {
    const result = await getPool().query(
      `INSERT INTO notifications (user_id, type, title, body, entity_type, entity_id)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id, user_id, type, title, body, entity_type, entity_id, is_read, created_at`,
      [input.userId, input.type, input.title, input.body, input.entityType || null, input.entityId || null]
    );
    return result.rows[0];
  },

  async notifyMany(inputs: CreateNotificationInput[]) {
    for (const input of inputs) {
      await this.notify(input);
    }
  },

  async notifyRoles(
    roleSlugs: string[],
    payload: Omit<CreateNotificationInput, "userId">,
    excludeUserId?: number | null
  ) {
    const result = await getPool().query(
      `SELECT u.id
       FROM users u
       JOIN roles r ON r.id = u.role_id
       WHERE r.slug = ANY($1::text[])
         AND u.is_active = TRUE
         AND ($2::int IS NULL OR u.id <> $2)`,
      [roleSlugs, excludeUserId ?? null]
    );

    await this.notifyMany(
      result.rows.map((row) => ({
        userId: Number(row.id),
        ...payload,
      }))
    );
  },

  async notifyIfUser(
    userId: number | null | undefined,
    payload: Omit<CreateNotificationInput, "userId">
  ) {
    if (!userId) return;
    await this.notify({ userId, ...payload });
  },

  async log(input: CreateActivityLogInput) {
    const result = await getPool().query(
      `INSERT INTO activity_logs (actor_id, action, entity_type, entity_id, metadata)
       VALUES ($1, $2, $3, $4, $5::jsonb)
       RETURNING id, actor_id, action, entity_type, entity_id, metadata, created_at`,
      [input.actorId || null, input.action, input.entityType, input.entityId || null, JSON.stringify(input.metadata || {})]
    );
    return result.rows[0];
  },
};
