import { getPool } from "../../config/database";
import type { AssetAllocation } from "../models";

const mapAllocation = (row: Record<string, unknown>): AssetAllocation => ({
  id: Number(row.id),
  asset_id: Number(row.asset_id),
  allocated_to_user_id: row.allocated_to_user_id != null ? Number(row.allocated_to_user_id) : null,
  allocated_to_department_id: row.allocated_to_department_id != null ? Number(row.allocated_to_department_id) : null,
  allocated_by: row.allocated_by != null ? Number(row.allocated_by) : null,
  expected_return_date: row.expected_return_date ? new Date(String(row.expected_return_date)) : null,
  returned_at: row.returned_at ? new Date(String(row.returned_at)) : null,
  return_condition_notes: (row.return_condition_notes as string | null) ?? null,
  status: row.status as "active" | "returned" | "transferred",
  created_at: new Date(String(row.created_at)),
  updated_at: new Date(String(row.updated_at)),
});

export type CreateAllocationInput = {
  assetId: number;
  allocatedToUserId?: number | null;
  allocatedToDepartmentId?: number | null;
  allocatedBy?: number | null;
  expectedReturnDate?: Date | null;
};

export type AllocationFilters = {
  assetId?: number;
  userId?: number;
  departmentId?: number;
  status?: "active" | "returned" | "transferred";
  limit?: number;
  offset?: number;
};

export const allocationRepository = {
  async list(filters: AllocationFilters = {}): Promise<Array<AssetAllocation & { asset_name?: string; asset_tag?: string; user_name?: string; dept_name?: string }>> {
    const conditions: string[] = [];
    const values: Array<number | string> = [];
    let idx = 1;

    if (filters.assetId !== undefined) { conditions.push(`aa.asset_id = $${idx++}`); values.push(filters.assetId); }
    if (filters.userId !== undefined) { conditions.push(`aa.allocated_to_user_id = $${idx++}`); values.push(filters.userId); }
    if (filters.departmentId !== undefined) {
      conditions.push(`(
        aa.allocated_to_department_id = $${idx}
        OR EXISTS (
          SELECT 1 FROM users du
          WHERE du.id = aa.allocated_to_user_id AND du.department_id = $${idx}
        )
      )`);
      values.push(filters.departmentId);
      idx++;
    }
    if (filters.status) { conditions.push(`aa.status = $${idx++}`); values.push(filters.status); }

    const where = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";
    const limit = filters.limit ?? 50;
    const offset = filters.offset ?? 0;

    const result = await getPool().query(
      `SELECT aa.*,
              a.name AS asset_name, a.asset_tag,
              u.name AS user_name,
              d.name AS dept_name
       FROM asset_allocations aa
       LEFT JOIN assets a ON a.id = aa.asset_id
       LEFT JOIN users u ON u.id = aa.allocated_to_user_id
       LEFT JOIN departments d ON d.id = aa.allocated_to_department_id
       ${where}
       ORDER BY aa.created_at DESC
       LIMIT $${idx++} OFFSET $${idx++}`,
      [...values, limit, offset]
    );

    return result.rows.map((row) => ({
      ...mapAllocation(row),
      asset_name: (row.asset_name as string | null) ?? undefined,
      asset_tag: (row.asset_tag as string | null) ?? undefined,
      user_name: (row.user_name as string | null) ?? undefined,
      dept_name: (row.dept_name as string | null) ?? undefined,
    }));
  },

  async findById(id: number): Promise<(AssetAllocation & { asset_name?: string; asset_tag?: string; user_name?: string; dept_name?: string }) | null> {
    const result = await getPool().query(
      `SELECT aa.*,
              a.name AS asset_name, a.asset_tag,
              u.name AS user_name,
              d.name AS dept_name
       FROM asset_allocations aa
       LEFT JOIN assets a ON a.id = aa.asset_id
       LEFT JOIN users u ON u.id = aa.allocated_to_user_id
       LEFT JOIN departments d ON d.id = aa.allocated_to_department_id
       WHERE aa.id = $1 LIMIT 1`,
      [id]
    );
    if (!result.rows[0]) return null;
    return {
      ...mapAllocation(result.rows[0]),
      asset_name: (result.rows[0].asset_name as string | null) ?? undefined,
      asset_tag: (result.rows[0].asset_tag as string | null) ?? undefined,
      user_name: (result.rows[0].user_name as string | null) ?? undefined,
      dept_name: (result.rows[0].dept_name as string | null) ?? undefined,
    };
  },

  async findActiveByAsset(assetId: number): Promise<(AssetAllocation & { user_name?: string }) | null> {
    const result = await getPool().query(
      `SELECT aa.*, u.name AS user_name
       FROM asset_allocations aa
       LEFT JOIN users u ON u.id = aa.allocated_to_user_id
       WHERE aa.asset_id = $1 AND aa.status = 'active'
       LIMIT 1`,
      [assetId]
    );
    if (!result.rows[0]) return null;
    return {
      ...mapAllocation(result.rows[0]),
      user_name: (result.rows[0].user_name as string | null) ?? undefined,
    };
  },

  async create(input: CreateAllocationInput): Promise<AssetAllocation> {
    const result = await getPool().query(
      `INSERT INTO asset_allocations
        (asset_id, allocated_to_user_id, allocated_to_department_id, allocated_by, expected_return_date)
       VALUES ($1,$2,$3,$4,$5)
       RETURNING *`,
      [
        input.assetId,
        input.allocatedToUserId ?? null,
        input.allocatedToDepartmentId ?? null,
        input.allocatedBy ?? null,
        input.expectedReturnDate ?? null,
      ]
    );
    return mapAllocation(result.rows[0]);
  },

  async markReturned(id: number, notes?: string | null): Promise<AssetAllocation | null> {
    const result = await getPool().query(
      `UPDATE asset_allocations
       SET status = 'returned', returned_at = NOW(), return_condition_notes = $2, updated_at = NOW()
       WHERE id = $1
       RETURNING *`,
      [id, notes ?? null]
    );
    return result.rows[0] ? mapAllocation(result.rows[0]) : null;
  },

  async markTransferred(id: number): Promise<AssetAllocation | null> {
    const result = await getPool().query(
      `UPDATE asset_allocations
       SET status = 'transferred', returned_at = NOW(), updated_at = NOW()
       WHERE id = $1
       RETURNING *`,
      [id]
    );
    return result.rows[0] ? mapAllocation(result.rows[0]) : null;
  },

  async listOverdue(): Promise<Array<AssetAllocation & { asset_name?: string; asset_tag?: string; user_name?: string }>> {
    const result = await getPool().query(
      `SELECT aa.*,
              a.name AS asset_name, a.asset_tag,
              u.name AS user_name
       FROM asset_allocations aa
       LEFT JOIN assets a ON a.id = aa.asset_id
       LEFT JOIN users u ON u.id = aa.allocated_to_user_id
       WHERE aa.status = 'active'
         AND aa.expected_return_date IS NOT NULL
         AND aa.expected_return_date < CURRENT_DATE
       ORDER BY aa.expected_return_date ASC`
    );
    return result.rows.map((row) => ({
      ...mapAllocation(row),
      asset_name: (row.asset_name as string | null) ?? undefined,
      asset_tag: (row.asset_tag as string | null) ?? undefined,
      user_name: (row.user_name as string | null) ?? undefined,
    }));
  },
};
