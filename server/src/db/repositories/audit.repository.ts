import { getPool } from "../../config/database";
import type { AuditCycle, AuditCycleStatus, AuditItem } from "../models";

const mapCycle = (row: Record<string, unknown>): AuditCycle => ({
  id: Number(row.id),
  name: String(row.name),
  department_id: row.department_id != null ? Number(row.department_id) : null,
  location: (row.location as string | null) ?? null,
  starts_on: new Date(String(row.starts_on)),
  ends_on: new Date(String(row.ends_on)),
  status: row.status as AuditCycleStatus,
  created_by: row.created_by != null ? Number(row.created_by) : null,
  closed_at: row.closed_at ? new Date(String(row.closed_at)) : null,
  created_at: new Date(String(row.created_at)),
  updated_at: new Date(String(row.updated_at)),
});

const mapItem = (row: Record<string, unknown>): AuditItem => ({
  id: Number(row.id),
  audit_cycle_id: Number(row.audit_cycle_id),
  asset_id: Number(row.asset_id),
  result: (row.result as "verified" | "missing" | "damaged" | null) ?? null,
  notes: (row.notes as string | null) ?? null,
  verified_by: row.verified_by != null ? Number(row.verified_by) : null,
  verified_at: row.verified_at ? new Date(String(row.verified_at)) : null,
});

export type CreateAuditCycleInput = {
  name: string;
  departmentId?: number | null;
  location?: string | null;
  startsOn: Date;
  endsOn: Date;
  createdBy?: number | null;
  auditorIds?: number[];
};

export const auditRepository = {
  async list(): Promise<Array<AuditCycle & { dept_name?: string }>> {
    const result = await getPool().query(
      `SELECT ac.*, d.name AS dept_name
       FROM audit_cycles ac
       LEFT JOIN departments d ON d.id = ac.department_id
       ORDER BY ac.created_at DESC`
    );
    return result.rows.map((row) => ({
      ...mapCycle(row),
      dept_name: (row.dept_name as string | null) ?? undefined,
    }));
  },

  async findById(id: number): Promise<(AuditCycle & { dept_name?: string; auditor_ids?: number[] }) | null> {
    const result = await getPool().query(
      `SELECT ac.*, d.name AS dept_name
       FROM audit_cycles ac
       LEFT JOIN departments d ON d.id = ac.department_id
       WHERE ac.id = $1 LIMIT 1`,
      [id]
    );
    if (!result.rows[0]) return null;

    const auditorResult = await getPool().query(
      `SELECT user_id FROM audit_cycle_auditors WHERE audit_cycle_id = $1`,
      [id]
    );

    return {
      ...mapCycle(result.rows[0]),
      dept_name: (result.rows[0].dept_name as string | null) ?? undefined,
      auditor_ids: auditorResult.rows.map((r) => Number(r.user_id)),
    };
  },

  async create(input: CreateAuditCycleInput): Promise<AuditCycle> {
    const pool = getPool();
    const result = await pool.query(
      `INSERT INTO audit_cycles (name, department_id, location, starts_on, ends_on, created_by)
       VALUES ($1,$2,$3,$4,$5,$6)
       RETURNING *`,
      [
        input.name,
        input.departmentId ?? null,
        input.location ?? null,
        input.startsOn,
        input.endsOn,
        input.createdBy ?? null,
      ]
    );
    const cycle = mapCycle(result.rows[0]);

    if (input.auditorIds?.length) {
      for (const uid of input.auditorIds) {
        await pool.query(
          `INSERT INTO audit_cycle_auditors (audit_cycle_id, user_id) VALUES ($1, $2) ON CONFLICT DO NOTHING`,
          [cycle.id, uid]
        );
      }
    }

    // Seed audit items from assets in department (or all if no dept)
    const assetQuery = input.departmentId
      ? `SELECT id FROM assets WHERE department_id = $1 AND status NOT IN ('retired','disposed')`
      : `SELECT id FROM assets WHERE status NOT IN ('retired','disposed')`;
    const assetValues = input.departmentId ? [input.departmentId] : [];
    const assets = await pool.query(assetQuery, assetValues);

    for (const asset of assets.rows) {
      await pool.query(
        `INSERT INTO audit_items (audit_cycle_id, asset_id) VALUES ($1, $2) ON CONFLICT DO NOTHING`,
        [cycle.id, asset.id]
      );
    }

    return cycle;
  },

  async getItems(cycleId: number): Promise<Array<AuditItem & { asset_name?: string; asset_tag?: string; verifier_name?: string }>> {
    const result = await getPool().query(
      `SELECT ai.*,
              a.name AS asset_name, a.asset_tag,
              u.name AS verifier_name
       FROM audit_items ai
       LEFT JOIN assets a ON a.id = ai.asset_id
       LEFT JOIN users u ON u.id = ai.verified_by
       WHERE ai.audit_cycle_id = $1
       ORDER BY a.name ASC`,
      [cycleId]
    );
    return result.rows.map((row) => ({
      ...mapItem(row),
      asset_name: (row.asset_name as string | null) ?? undefined,
      asset_tag: (row.asset_tag as string | null) ?? undefined,
      verifier_name: (row.verifier_name as string | null) ?? undefined,
    }));
  },

  async markItem(cycleId: number, assetId: number, result: "verified" | "missing" | "damaged", notes: string | null, verifiedBy: number): Promise<AuditItem | null> {
    const res = await getPool().query(
      `UPDATE audit_items
       SET result = $3, notes = $4, verified_by = $5, verified_at = NOW()
       WHERE audit_cycle_id = $1 AND asset_id = $2
       RETURNING *`,
      [cycleId, assetId, result, notes, verifiedBy]
    );
    return res.rows[0] ? mapItem(res.rows[0]) : null;
  },

  async closeCycle(id: number): Promise<AuditCycle | null> {
    const result = await getPool().query(
      `UPDATE audit_cycles SET status = 'closed', closed_at = NOW(), updated_at = NOW()
       WHERE id = $1 RETURNING *`,
      [id]
    );
    return result.rows[0] ? mapCycle(result.rows[0]) : null;
  },

  async getMissingItems(cycleId: number): Promise<Array<AuditItem & { asset_id: number; asset_name?: string; asset_tag?: string }>> {
    const result = await getPool().query(
      `SELECT ai.*, a.name AS asset_name, a.asset_tag
       FROM audit_items ai
       LEFT JOIN assets a ON a.id = ai.asset_id
       WHERE ai.audit_cycle_id = $1 AND ai.result = 'missing'`,
      [cycleId]
    );
    return result.rows.map((row) => ({
      ...mapItem(row),
      asset_name: (row.asset_name as string | null) ?? undefined,
      asset_tag: (row.asset_tag as string | null) ?? undefined,
    }));
  },

  async isAuditor(cycleId: number, userId: number): Promise<boolean> {
    const result = await getPool().query(
      `SELECT 1 FROM audit_cycle_auditors WHERE audit_cycle_id = $1 AND user_id = $2`,
      [cycleId, userId]
    );
    return result.rows.length > 0;
  },
};
