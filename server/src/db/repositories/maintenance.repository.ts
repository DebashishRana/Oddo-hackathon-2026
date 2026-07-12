import { getPool } from "../../config/database";
import type { MaintenancePriority, MaintenanceRequest, MaintenanceStatus } from "../models";

const mapMaintenance = (row: Record<string, unknown>): MaintenanceRequest => ({
  id: Number(row.id),
  asset_id: Number(row.asset_id),
  requested_by: Number(row.requested_by),
  description: String(row.description),
  priority: row.priority as MaintenancePriority,
  photo_url: (row.photo_url as string | null) ?? null,
  status: row.status as MaintenanceStatus,
  approved_by: row.approved_by != null ? Number(row.approved_by) : null,
  technician_name: (row.technician_name as string | null) ?? null,
  rejection_reason: (row.rejection_reason as string | null) ?? null,
  resolved_at: row.resolved_at ? new Date(String(row.resolved_at)) : null,
  created_at: new Date(String(row.created_at)),
  updated_at: new Date(String(row.updated_at)),
});

export type CreateMaintenanceInput = {
  assetId: number;
  requestedBy: number;
  description: string;
  priority?: MaintenancePriority;
  photoUrl?: string | null;
};

export type MaintenanceFilters = {
  assetId?: number;
  status?: MaintenanceStatus;
  requestedBy?: number;
  limit?: number;
  offset?: number;
};

export const maintenanceRepository = {
  async list(filters: MaintenanceFilters = {}): Promise<Array<MaintenanceRequest & { asset_name?: string; asset_tag?: string; requester_name?: string }>> {
    const conditions: string[] = [];
    const values: Array<number | string> = [];
    let idx = 1;

    if (filters.assetId !== undefined) { conditions.push(`mr.asset_id = $${idx++}`); values.push(filters.assetId); }
    if (filters.status) { conditions.push(`mr.status = $${idx++}`); values.push(filters.status); }
    if (filters.requestedBy !== undefined) { conditions.push(`mr.requested_by = $${idx++}`); values.push(filters.requestedBy); }

    const where = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";
    const limit = filters.limit ?? 50;
    const offset = filters.offset ?? 0;

    const result = await getPool().query(
      `SELECT mr.*,
              a.name AS asset_name, a.asset_tag,
              u.name AS requester_name
       FROM maintenance_requests mr
       LEFT JOIN assets a ON a.id = mr.asset_id
       LEFT JOIN users u ON u.id = mr.requested_by
       ${where}
       ORDER BY mr.created_at DESC
       LIMIT $${idx++} OFFSET $${idx++}`,
      [...values, limit, offset]
    );

    return result.rows.map((row) => ({
      ...mapMaintenance(row),
      asset_name: (row.asset_name as string | null) ?? undefined,
      asset_tag: (row.asset_tag as string | null) ?? undefined,
      requester_name: (row.requester_name as string | null) ?? undefined,
    }));
  },

  async findById(id: number): Promise<(MaintenanceRequest & { asset_name?: string; asset_tag?: string; requester_name?: string }) | null> {
    const result = await getPool().query(
      `SELECT mr.*,
              a.name AS asset_name, a.asset_tag,
              u.name AS requester_name
       FROM maintenance_requests mr
       LEFT JOIN assets a ON a.id = mr.asset_id
       LEFT JOIN users u ON u.id = mr.requested_by
       WHERE mr.id = $1 LIMIT 1`,
      [id]
    );
    if (!result.rows[0]) return null;
    return {
      ...mapMaintenance(result.rows[0]),
      asset_name: (result.rows[0].asset_name as string | null) ?? undefined,
      asset_tag: (result.rows[0].asset_tag as string | null) ?? undefined,
      requester_name: (result.rows[0].requester_name as string | null) ?? undefined,
    };
  },

  async create(input: CreateMaintenanceInput): Promise<MaintenanceRequest> {
    const result = await getPool().query(
      `INSERT INTO maintenance_requests (asset_id, requested_by, description, priority, photo_url)
       VALUES ($1,$2,$3,$4,$5)
       RETURNING *`,
      [
        input.assetId,
        input.requestedBy,
        input.description,
        input.priority ?? "medium",
        input.photoUrl ?? null,
      ]
    );
    return mapMaintenance(result.rows[0]);
  },

  async updateStatus(id: number, status: MaintenanceStatus, extra?: {
    approvedBy?: number | null;
    rejectionReason?: string | null;
    technicianName?: string | null;
    resolvedAt?: Date | null;
  }): Promise<MaintenanceRequest | null> {
    const fields: string[] = ["status = $2"];
    const values: Array<string | number | Date | null> = [id, status];
    let idx = 3;

    if (extra?.approvedBy !== undefined) { fields.push(`approved_by = $${idx++}`); values.push(extra.approvedBy ?? null); }
    if (extra?.rejectionReason !== undefined) { fields.push(`rejection_reason = $${idx++}`); values.push(extra.rejectionReason ?? null); }
    if (extra?.technicianName !== undefined) { fields.push(`technician_name = $${idx++}`); values.push(extra.technicianName ?? null); }
    if (extra?.resolvedAt !== undefined) { fields.push(`resolved_at = $${idx++}`); values.push(extra.resolvedAt ?? null); }

    const result = await getPool().query(
      `UPDATE maintenance_requests SET ${fields.join(", ")}, updated_at = NOW() WHERE id = $1 RETURNING *`,
      values
    );
    return result.rows[0] ? mapMaintenance(result.rows[0]) : null;
  },

  async countByStatus(): Promise<Record<string, number>> {
    const result = await getPool().query(
      `SELECT status, COUNT(*) FROM maintenance_requests GROUP BY status`
    );
    const counts: Record<string, number> = {};
    for (const row of result.rows) counts[String(row.status)] = Number(row.count);
    return counts;
  },

  async countCreatedToday(): Promise<number> {
    const result = await getPool().query(
      `SELECT COUNT(*) FROM maintenance_requests WHERE created_at >= CURRENT_DATE`
    );
    return Number(result.rows[0].count);
  },
};
