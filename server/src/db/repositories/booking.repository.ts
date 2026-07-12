import { getPool } from "../../config/database";
import type { BookingStatus, ResourceBooking } from "../models";

const mapBooking = (row: Record<string, unknown>): ResourceBooking => ({
  id: Number(row.id),
  asset_id: Number(row.asset_id),
  booked_by: Number(row.booked_by),
  department_id: row.department_id != null ? Number(row.department_id) : null,
  starts_at: new Date(String(row.starts_at)),
  ends_at: new Date(String(row.ends_at)),
  purpose: (row.purpose as string | null) ?? null,
  status: row.status as BookingStatus,
  reminder_sent: Boolean(row.reminder_sent),
  created_at: new Date(String(row.created_at)),
  updated_at: new Date(String(row.updated_at)),
});

export type CreateBookingInput = {
  assetId: number;
  bookedBy: number;
  departmentId?: number | null;
  startsAt: Date;
  endsAt: Date;
  purpose?: string | null;
};

export type BookingFilters = {
  assetId?: number;
  bookedBy?: number;
  status?: BookingStatus;
  limit?: number;
  offset?: number;
};

export const bookingRepository = {
  async list(filters: BookingFilters = {}): Promise<Array<ResourceBooking & { asset_name?: string; asset_tag?: string; booker_name?: string }>> {
    const conditions: string[] = [];
    const values: Array<number | string> = [];
    let idx = 1;

    if (filters.assetId !== undefined) { conditions.push(`rb.asset_id = $${idx++}`); values.push(filters.assetId); }
    if (filters.bookedBy !== undefined) { conditions.push(`rb.booked_by = $${idx++}`); values.push(filters.bookedBy); }
    if (filters.status) { conditions.push(`rb.status = $${idx++}`); values.push(filters.status); }

    const where = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";
    const limit = filters.limit ?? 100;
    const offset = filters.offset ?? 0;

    const result = await getPool().query(
      `SELECT rb.*,
              a.name AS asset_name, a.asset_tag,
              u.name AS booker_name
       FROM resource_bookings rb
       LEFT JOIN assets a ON a.id = rb.asset_id
       LEFT JOIN users u ON u.id = rb.booked_by
       ${where}
       ORDER BY rb.starts_at DESC
       LIMIT $${idx++} OFFSET $${idx++}`,
      [...values, limit, offset]
    );

    return result.rows.map((row) => ({
      ...mapBooking(row),
      asset_name: (row.asset_name as string | null) ?? undefined,
      asset_tag: (row.asset_tag as string | null) ?? undefined,
      booker_name: (row.booker_name as string | null) ?? undefined,
    }));
  },

  async findById(id: number): Promise<(ResourceBooking & { asset_name?: string; booker_name?: string }) | null> {
    const result = await getPool().query(
      `SELECT rb.*,
              a.name AS asset_name, a.asset_tag,
              u.name AS booker_name
       FROM resource_bookings rb
       LEFT JOIN assets a ON a.id = rb.asset_id
       LEFT JOIN users u ON u.id = rb.booked_by
       WHERE rb.id = $1 LIMIT 1`,
      [id]
    );
    if (!result.rows[0]) return null;
    return {
      ...mapBooking(result.rows[0]),
      asset_name: (result.rows[0].asset_name as string | null) ?? undefined,
      booker_name: (result.rows[0].booker_name as string | null) ?? undefined,
    };
  },

  async getCalendar(assetId: number): Promise<ResourceBooking[]> {
    const result = await getPool().query(
      `SELECT * FROM resource_bookings
       WHERE asset_id = $1
         AND status NOT IN ('cancelled')
         AND ends_at >= NOW()
       ORDER BY starts_at ASC`,
      [assetId]
    );
    return result.rows.map(mapBooking);
  },

  async checkOverlap(assetId: number, startsAt: Date, endsAt: Date, excludeId?: number): Promise<boolean> {
    const values: Array<number | Date> = [assetId, startsAt, endsAt];
    const excludeClause = excludeId ? `AND id != $4` : "";
    if (excludeId) values.push(excludeId);
    const result = await getPool().query(
      `SELECT 1 FROM resource_bookings
       WHERE asset_id = $1
         AND status NOT IN ('cancelled')
         AND starts_at < $3
         AND ends_at > $2
         ${excludeClause}
       LIMIT 1`,
      values
    );
    return result.rows.length > 0;
  },

  async create(input: CreateBookingInput): Promise<ResourceBooking> {
    const result = await getPool().query(
      `INSERT INTO resource_bookings (asset_id, booked_by, department_id, starts_at, ends_at, purpose)
       VALUES ($1,$2,$3,$4,$5,$6)
       RETURNING *`,
      [
        input.assetId,
        input.bookedBy,
        input.departmentId ?? null,
        input.startsAt,
        input.endsAt,
        input.purpose ?? null,
      ]
    );
    return mapBooking(result.rows[0]);
  },

  async updateStatus(id: number, status: BookingStatus): Promise<ResourceBooking | null> {
    const result = await getPool().query(
      `UPDATE resource_bookings SET status = $2, updated_at = NOW() WHERE id = $1 RETURNING *`,
      [id, status]
    );
    return result.rows[0] ? mapBooking(result.rows[0]) : null;
  },

  async reschedule(id: number, startsAt: Date, endsAt: Date): Promise<ResourceBooking | null> {
    const result = await getPool().query(
      `UPDATE resource_bookings SET starts_at = $2, ends_at = $3, updated_at = NOW() WHERE id = $1 RETURNING *`,
      [id, startsAt, endsAt]
    );
    return result.rows[0] ? mapBooking(result.rows[0]) : null;
  },

  async refreshStatuses(): Promise<void> {
    await getPool().query(
      `UPDATE resource_bookings
       SET status = CASE
         WHEN status NOT IN ('cancelled','completed') AND starts_at <= NOW() AND ends_at >= NOW() THEN 'ongoing'
         WHEN status NOT IN ('cancelled','completed') AND ends_at < NOW() THEN 'completed'
         WHEN status = 'ongoing' AND starts_at > NOW() THEN 'upcoming'
         ELSE status
       END,
       updated_at = NOW()
       WHERE status NOT IN ('cancelled','completed')`
    );
  },

  async listDueForReminder(withinMinutes = 60): Promise<Array<ResourceBooking & { asset_name?: string }>> {
    const result = await getPool().query(
      `SELECT rb.*, a.name AS asset_name
       FROM resource_bookings rb
       LEFT JOIN assets a ON a.id = rb.asset_id
       WHERE rb.status = 'upcoming'
         AND rb.reminder_sent = FALSE
         AND rb.starts_at > NOW()
         AND rb.starts_at <= NOW() + ($1 || ' minutes')::interval
       ORDER BY rb.starts_at ASC
       LIMIT 50`,
      [withinMinutes]
    );
    return result.rows.map((row) => ({
      ...mapBooking(row),
      asset_name: (row.asset_name as string | null) ?? undefined,
    }));
  },

  async markReminderSent(id: number): Promise<void> {
    await getPool().query(
      `UPDATE resource_bookings SET reminder_sent = TRUE, updated_at = NOW() WHERE id = $1`,
      [id]
    );
  },

  async countActive(): Promise<number> {
    const result = await getPool().query(
      `SELECT COUNT(*) FROM resource_bookings WHERE status IN ('upcoming','ongoing')`
    );
    return Number(result.rows[0].count);
  },
};
