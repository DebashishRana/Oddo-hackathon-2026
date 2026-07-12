import { getPool } from "../../config/database";
import type { Asset, AssetCondition, AssetStatus, AssetStatusHistory } from "../models";

const mapAsset = (row: Record<string, unknown>): Asset => ({
  id: Number(row.id),
  name: String(row.name),
  asset_tag: String(row.asset_tag),
  serial_number: (row.serial_number as string | null) ?? null,
  category_id: row.category_id != null ? Number(row.category_id) : null,
  department_id: row.department_id != null ? Number(row.department_id) : null,
  status: row.status as AssetStatus,
  condition: row.condition as AssetCondition,
  location: (row.location as string | null) ?? null,
  acquisition_date: row.acquisition_date ? new Date(String(row.acquisition_date)) : null,
  acquisition_cost: row.acquisition_cost != null ? Number(row.acquisition_cost) : null,
  is_shared_bookable: Boolean(row.is_shared_bookable),
  photo_url: (row.photo_url as string | null) ?? null,
  document_url: (row.document_url as string | null) ?? null,
  notes: (row.notes as string | null) ?? null,
  created_by: row.created_by != null ? Number(row.created_by) : null,
  created_at: new Date(String(row.created_at)),
  updated_at: new Date(String(row.updated_at)),
});

const mapHistory = (row: Record<string, unknown>): AssetStatusHistory => ({
  id: Number(row.id),
  asset_id: Number(row.asset_id),
  from_status: (row.from_status as string | null) ?? null,
  to_status: String(row.to_status),
  changed_by: row.changed_by != null ? Number(row.changed_by) : null,
  reason: (row.reason as string | null) ?? null,
  created_at: new Date(String(row.created_at)),
});

export type CreateAssetInput = {
  name: string;
  serialNumber?: string | null;
  categoryId?: number | null;
  departmentId?: number | null;
  condition?: AssetCondition;
  location?: string | null;
  acquisitionDate?: Date | null;
  acquisitionCost?: number | null;
  isSharedBookable?: boolean;
  photoUrl?: string | null;
  documentUrl?: string | null;
  notes?: string | null;
  createdBy?: number | null;
};

export type UpdateAssetInput = Partial<Omit<CreateAssetInput, "createdBy"> & { status?: AssetStatus }>;

export type AssetFilters = {
  q?: string;
  tag?: string;
  serial?: string;
  categoryId?: number;
  status?: AssetStatus;
  departmentId?: number;
  location?: string;
  bookable?: boolean;
  limit?: number;
  offset?: number;
};

export const assetRepository = {
  async list(filters: AssetFilters = {}): Promise<{ assets: Array<Asset & { category_name?: string; dept_name?: string }>; total: number }> {
    const conditions: string[] = [];
    const values: Array<string | number | boolean> = [];
    let idx = 1;

    if (filters.q) {
      conditions.push(`(a.name ILIKE $${idx} OR a.asset_tag ILIKE $${idx} OR a.serial_number ILIKE $${idx})`);
      values.push(`%${filters.q}%`);
      idx++;
    }
    if (filters.tag) { conditions.push(`a.asset_tag ILIKE $${idx++}`); values.push(`%${filters.tag}%`); }
    if (filters.serial) { conditions.push(`a.serial_number ILIKE $${idx++}`); values.push(`%${filters.serial}%`); }
    if (filters.categoryId !== undefined) { conditions.push(`a.category_id = $${idx++}`); values.push(filters.categoryId); }
    if (filters.status) { conditions.push(`a.status = $${idx++}`); values.push(filters.status); }
    if (filters.departmentId !== undefined) { conditions.push(`a.department_id = $${idx++}`); values.push(filters.departmentId); }
    if (filters.location) { conditions.push(`a.location ILIKE $${idx++}`); values.push(`%${filters.location}%`); }
    if (filters.bookable !== undefined) { conditions.push(`a.is_shared_bookable = $${idx++}`); values.push(filters.bookable); }

    const where = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";
    const limit = filters.limit ?? 50;
    const offset = filters.offset ?? 0;

    const countResult = await getPool().query(
      `SELECT COUNT(*) FROM assets a ${where}`,
      values
    );
    const total = Number(countResult.rows[0].count);

    const result = await getPool().query(
      `SELECT a.*, c.name AS category_name, d.name AS dept_name
       FROM assets a
       LEFT JOIN asset_categories c ON c.id = a.category_id
       LEFT JOIN departments d ON d.id = a.department_id
       ${where}
       ORDER BY a.created_at DESC
       LIMIT $${idx++} OFFSET $${idx++}`,
      [...values, limit, offset]
    );

    return {
      assets: result.rows.map((row) => ({
        ...mapAsset(row),
        category_name: (row.category_name as string | null) ?? undefined,
        dept_name: (row.dept_name as string | null) ?? undefined,
      })),
      total,
    };
  },

  async findById(id: number): Promise<(Asset & { category_name?: string; dept_name?: string }) | null> {
    const result = await getPool().query(
      `SELECT a.*, c.name AS category_name, d.name AS dept_name
       FROM assets a
       LEFT JOIN asset_categories c ON c.id = a.category_id
       LEFT JOIN departments d ON d.id = a.department_id
       WHERE a.id = $1 LIMIT 1`,
      [id]
    );
    if (!result.rows[0]) return null;
    return {
      ...mapAsset(result.rows[0]),
      category_name: (result.rows[0].category_name as string | null) ?? undefined,
      dept_name: (result.rows[0].dept_name as string | null) ?? undefined,
    };
  },

  async findByTag(tag: string): Promise<Asset | null> {
    const result = await getPool().query(
      `SELECT * FROM assets WHERE asset_tag = $1 LIMIT 1`,
      [tag]
    );
    return result.rows[0] ? mapAsset(result.rows[0]) : null;
  },

  async nextTag(): Promise<string> {
    const result = await getPool().query(`SELECT nextval('asset_tag_seq') AS seq`);
    const seq = Number(result.rows[0].seq);
    return `AF-${String(seq).padStart(4, "0")}`;
  },

  async create(input: CreateAssetInput): Promise<Asset> {
    const tag = await this.nextTag();
    const result = await getPool().query(
      `INSERT INTO assets (name, asset_tag, serial_number, category_id, department_id, status, condition,
        location, acquisition_date, acquisition_cost, is_shared_bookable, photo_url, document_url, notes, created_by)
       VALUES ($1,$2,$3,$4,$5,'available',$6,$7,$8,$9,$10,$11,$12,$13,$14)
       RETURNING *`,
      [
        input.name,
        tag,
        input.serialNumber ?? null,
        input.categoryId ?? null,
        input.departmentId ?? null,
        input.condition ?? "good",
        input.location ?? null,
        input.acquisitionDate ?? null,
        input.acquisitionCost ?? null,
        input.isSharedBookable ?? false,
        input.photoUrl ?? null,
        input.documentUrl ?? null,
        input.notes ?? null,
        input.createdBy ?? null,
      ]
    );
    return mapAsset(result.rows[0]);
  },

  async update(id: number, input: UpdateAssetInput): Promise<Asset | null> {
    const fields: string[] = [];
    const values: Array<string | number | boolean | Date | null> = [];
    let idx = 1;

    if (input.name !== undefined) { fields.push(`name = $${idx++}`); values.push(input.name); }
    if (input.serialNumber !== undefined) { fields.push(`serial_number = $${idx++}`); values.push(input.serialNumber ?? null); }
    if (input.categoryId !== undefined) { fields.push(`category_id = $${idx++}`); values.push(input.categoryId ?? null); }
    if (input.departmentId !== undefined) { fields.push(`department_id = $${idx++}`); values.push(input.departmentId ?? null); }
    if (input.status !== undefined) { fields.push(`status = $${idx++}`); values.push(input.status); }
    if (input.condition !== undefined) { fields.push(`condition = $${idx++}`); values.push(input.condition); }
    if (input.location !== undefined) { fields.push(`location = $${idx++}`); values.push(input.location ?? null); }
    if (input.acquisitionDate !== undefined) { fields.push(`acquisition_date = $${idx++}`); values.push(input.acquisitionDate ?? null); }
    if (input.acquisitionCost !== undefined) { fields.push(`acquisition_cost = $${idx++}`); values.push(input.acquisitionCost ?? null); }
    if (input.isSharedBookable !== undefined) { fields.push(`is_shared_bookable = $${idx++}`); values.push(input.isSharedBookable); }
    if (input.photoUrl !== undefined) { fields.push(`photo_url = $${idx++}`); values.push(input.photoUrl ?? null); }
    if (input.documentUrl !== undefined) { fields.push(`document_url = $${idx++}`); values.push(input.documentUrl ?? null); }
    if (input.notes !== undefined) { fields.push(`notes = $${idx++}`); values.push(input.notes ?? null); }

    if (!fields.length) return this.findById(id);

    values.push(id);
    const result = await getPool().query(
      `UPDATE assets SET ${fields.join(", ")}, updated_at = NOW() WHERE id = $${idx} RETURNING *`,
      values
    );
    return result.rows[0] ? mapAsset(result.rows[0]) : null;
  },

  async addStatusHistory(assetId: number, fromStatus: string | null, toStatus: string, changedBy: number | null, reason?: string | null): Promise<void> {
    await getPool().query(
      `INSERT INTO asset_status_history (asset_id, from_status, to_status, changed_by, reason)
       VALUES ($1, $2, $3, $4, $5)`,
      [assetId, fromStatus ?? null, toStatus, changedBy ?? null, reason ?? null]
    );
  },

  async getStatusHistory(assetId: number): Promise<AssetStatusHistory[]> {
    const result = await getPool().query(
      `SELECT h.*, u.name AS changed_by_name
       FROM asset_status_history h
       LEFT JOIN users u ON u.id = h.changed_by
       WHERE h.asset_id = $1
       ORDER BY h.created_at DESC`,
      [assetId]
    );
    return result.rows.map((row) => ({
      ...mapHistory(row),
    }));
  },

  async countByStatus(): Promise<Record<string, number>> {
    const result = await getPool().query(
      `SELECT status, COUNT(*) FROM assets GROUP BY status`
    );
    const counts: Record<string, number> = {};
    for (const row of result.rows) {
      counts[String(row.status)] = Number(row.count);
    }
    return counts;
  },
};
