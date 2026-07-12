import { getPool } from "../../config/database";
import type { TransferRequest, TransferStatus } from "../models";

const mapTransfer = (row: Record<string, unknown>): TransferRequest => ({
  id: Number(row.id),
  asset_id: Number(row.asset_id),
  from_allocation_id: row.from_allocation_id != null ? Number(row.from_allocation_id) : null,
  requested_by: Number(row.requested_by),
  to_user_id: row.to_user_id != null ? Number(row.to_user_id) : null,
  to_department_id: row.to_department_id != null ? Number(row.to_department_id) : null,
  approved_by: row.approved_by != null ? Number(row.approved_by) : null,
  status: row.status as TransferStatus,
  notes: (row.notes as string | null) ?? null,
  created_at: new Date(String(row.created_at)),
  updated_at: new Date(String(row.updated_at)),
});

export type CreateTransferInput = {
  assetId: number;
  fromAllocationId?: number | null;
  requestedBy: number;
  toUserId?: number | null;
  toDepartmentId?: number | null;
  notes?: string | null;
};

export type TransferFilters = {
  assetId?: number;
  requestedBy?: number;
  status?: TransferStatus;
  limit?: number;
  offset?: number;
};

export const transferRepository = {
  async list(filters: TransferFilters = {}): Promise<Array<TransferRequest & { asset_name?: string; asset_tag?: string; requester_name?: string; to_user_name?: string; to_dept_name?: string }>> {
    const conditions: string[] = [];
    const values: Array<number | string> = [];
    let idx = 1;

    if (filters.assetId !== undefined) { conditions.push(`tr.asset_id = $${idx++}`); values.push(filters.assetId); }
    if (filters.requestedBy !== undefined) { conditions.push(`tr.requested_by = $${idx++}`); values.push(filters.requestedBy); }
    if (filters.status) { conditions.push(`tr.status = $${idx++}`); values.push(filters.status); }

    const where = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";
    const limit = filters.limit ?? 50;
    const offset = filters.offset ?? 0;

    const result = await getPool().query(
      `SELECT tr.*,
              a.name AS asset_name, a.asset_tag,
              req.name AS requester_name,
              tu.name AS to_user_name,
              td.name AS to_dept_name
       FROM transfer_requests tr
       LEFT JOIN assets a ON a.id = tr.asset_id
       LEFT JOIN users req ON req.id = tr.requested_by
       LEFT JOIN users tu ON tu.id = tr.to_user_id
       LEFT JOIN departments td ON td.id = tr.to_department_id
       ${where}
       ORDER BY tr.created_at DESC
       LIMIT $${idx++} OFFSET $${idx++}`,
      [...values, limit, offset]
    );

    return result.rows.map((row) => ({
      ...mapTransfer(row),
      asset_name: (row.asset_name as string | null) ?? undefined,
      asset_tag: (row.asset_tag as string | null) ?? undefined,
      requester_name: (row.requester_name as string | null) ?? undefined,
      to_user_name: (row.to_user_name as string | null) ?? undefined,
      to_dept_name: (row.to_dept_name as string | null) ?? undefined,
    }));
  },

  async findById(id: number): Promise<(TransferRequest & { asset_name?: string; asset_tag?: string; requester_name?: string; to_user_name?: string; to_dept_name?: string }) | null> {
    const result = await getPool().query(
      `SELECT tr.*,
              a.name AS asset_name, a.asset_tag,
              req.name AS requester_name,
              tu.name AS to_user_name,
              td.name AS to_dept_name
       FROM transfer_requests tr
       LEFT JOIN assets a ON a.id = tr.asset_id
       LEFT JOIN users req ON req.id = tr.requested_by
       LEFT JOIN users tu ON tu.id = tr.to_user_id
       LEFT JOIN departments td ON td.id = tr.to_department_id
       WHERE tr.id = $1 LIMIT 1`,
      [id]
    );
    if (!result.rows[0]) return null;
    return {
      ...mapTransfer(result.rows[0]),
      asset_name: (result.rows[0].asset_name as string | null) ?? undefined,
      asset_tag: (result.rows[0].asset_tag as string | null) ?? undefined,
      requester_name: (result.rows[0].requester_name as string | null) ?? undefined,
      to_user_name: (result.rows[0].to_user_name as string | null) ?? undefined,
      to_dept_name: (result.rows[0].to_dept_name as string | null) ?? undefined,
    };
  },

  async create(input: CreateTransferInput): Promise<TransferRequest> {
    const result = await getPool().query(
      `INSERT INTO transfer_requests
        (asset_id, from_allocation_id, requested_by, to_user_id, to_department_id, notes)
       VALUES ($1,$2,$3,$4,$5,$6)
       RETURNING *`,
      [
        input.assetId,
        input.fromAllocationId ?? null,
        input.requestedBy,
        input.toUserId ?? null,
        input.toDepartmentId ?? null,
        input.notes ?? null,
      ]
    );
    return mapTransfer(result.rows[0]);
  },

  async updateStatus(id: number, status: TransferStatus, approvedBy?: number | null): Promise<TransferRequest | null> {
    const result = await getPool().query(
      `UPDATE transfer_requests
       SET status = $2, approved_by = COALESCE($3, approved_by), updated_at = NOW()
       WHERE id = $1 RETURNING *`,
      [id, status, approvedBy ?? null]
    );
    return result.rows[0] ? mapTransfer(result.rows[0]) : null;
  },

  async countPending(): Promise<number> {
    const result = await getPool().query(
      `SELECT COUNT(*) FROM transfer_requests WHERE status = 'requested'`
    );
    return Number(result.rows[0].count);
  },
};
