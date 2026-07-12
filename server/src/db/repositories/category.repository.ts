import { getPool } from "../../config/database";
import type { AssetCategory } from "../models";

const mapCategory = (row: Record<string, unknown>): AssetCategory => ({
  id: Number(row.id),
  name: String(row.name),
  description: (row.description as string | null) ?? null,
  custom_fields: (row.custom_fields as Record<string, unknown>) ?? {},
  created_at: new Date(String(row.created_at)),
  updated_at: new Date(String(row.updated_at)),
});

export type CreateCategoryInput = {
  name: string;
  description?: string | null;
  customFields?: Record<string, unknown>;
};

export type UpdateCategoryInput = Partial<CreateCategoryInput>;

export const categoryRepository = {
  async list(): Promise<AssetCategory[]> {
    const result = await getPool().query(
      `SELECT id, name, description, custom_fields, created_at, updated_at
       FROM asset_categories ORDER BY name ASC`
    );
    return result.rows.map(mapCategory);
  },

  async findById(id: number): Promise<AssetCategory | null> {
    const result = await getPool().query(
      `SELECT id, name, description, custom_fields, created_at, updated_at
       FROM asset_categories WHERE id = $1 LIMIT 1`,
      [id]
    );
    return result.rows[0] ? mapCategory(result.rows[0]) : null;
  },

  async findByName(name: string): Promise<AssetCategory | null> {
    const result = await getPool().query(
      `SELECT id, name, description, custom_fields, created_at, updated_at
       FROM asset_categories WHERE LOWER(name) = LOWER($1) LIMIT 1`,
      [name]
    );
    return result.rows[0] ? mapCategory(result.rows[0]) : null;
  },

  async create(input: CreateCategoryInput): Promise<AssetCategory> {
    const result = await getPool().query(
      `INSERT INTO asset_categories (name, description, custom_fields)
       VALUES ($1, $2, $3::jsonb)
       RETURNING id, name, description, custom_fields, created_at, updated_at`,
      [input.name, input.description ?? null, JSON.stringify(input.customFields ?? {})]
    );
    return mapCategory(result.rows[0]);
  },

  async update(id: number, input: UpdateCategoryInput): Promise<AssetCategory | null> {
    const fields: string[] = [];
    const values: Array<string | null> = [];
    let idx = 1;

    if (input.name !== undefined) { fields.push(`name = $${idx++}`); values.push(input.name); }
    if (input.description !== undefined) { fields.push(`description = $${idx++}`); values.push(input.description ?? null); }
    if (input.customFields !== undefined) { fields.push(`custom_fields = $${idx++}::jsonb`); values.push(JSON.stringify(input.customFields)); }

    if (!fields.length) return this.findById(id);

    values.push(String(id));
    const result = await getPool().query(
      `UPDATE asset_categories SET ${fields.join(", ")}, updated_at = NOW()
       WHERE id = $${idx}
       RETURNING id, name, description, custom_fields, created_at, updated_at`,
      values
    );
    return result.rows[0] ? mapCategory(result.rows[0]) : null;
  },
};
