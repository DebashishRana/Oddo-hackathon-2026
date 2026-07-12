import { getPool } from "../../config/database";
import type { Department } from "../models";

const mapDept = (row: Record<string, unknown>): Department => ({
  id: Number(row.id),
  name: String(row.name),
  code: (row.code as string | null) ?? null,
  parent_department_id: row.parent_department_id != null ? Number(row.parent_department_id) : null,
  head_user_id: row.head_user_id != null ? Number(row.head_user_id) : null,
  status: (row.status as "active" | "inactive"),
  created_at: new Date(String(row.created_at)),
  updated_at: new Date(String(row.updated_at)),
});

export type CreateDepartmentInput = {
  name: string;
  code?: string | null;
  parentDepartmentId?: number | null;
  headUserId?: number | null;
  status?: "active" | "inactive";
};

export type UpdateDepartmentInput = Partial<CreateDepartmentInput>;

export const departmentRepository = {
  async list(onlyActive = false): Promise<Department[]> {
    const where = onlyActive ? "WHERE status = 'active'" : "";
    const result = await getPool().query(
      `SELECT id, name, code, parent_department_id, head_user_id, status, created_at, updated_at
       FROM departments ${where} ORDER BY name ASC`
    );
    return result.rows.map(mapDept);
  },

  async findById(id: number): Promise<Department | null> {
    const result = await getPool().query(
      `SELECT id, name, code, parent_department_id, head_user_id, status, created_at, updated_at
       FROM departments WHERE id = $1 LIMIT 1`,
      [id]
    );
    return result.rows[0] ? mapDept(result.rows[0]) : null;
  },

  async findByName(name: string): Promise<Department | null> {
    const result = await getPool().query(
      `SELECT id, name, code, parent_department_id, head_user_id, status, created_at, updated_at
       FROM departments WHERE LOWER(name) = LOWER($1) LIMIT 1`,
      [name]
    );
    return result.rows[0] ? mapDept(result.rows[0]) : null;
  },

  async create(input: CreateDepartmentInput): Promise<Department> {
    const result = await getPool().query(
      `INSERT INTO departments (name, code, parent_department_id, head_user_id, status)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, name, code, parent_department_id, head_user_id, status, created_at, updated_at`,
      [
        input.name,
        input.code ?? null,
        input.parentDepartmentId ?? null,
        input.headUserId ?? null,
        input.status ?? "active",
      ]
    );
    return mapDept(result.rows[0]);
  },

  async update(id: number, input: UpdateDepartmentInput): Promise<Department | null> {
    const fields: string[] = [];
    const values: Array<string | number | null> = [];
    let idx = 1;

    if (input.name !== undefined) { fields.push(`name = $${idx++}`); values.push(input.name); }
    if (input.code !== undefined) { fields.push(`code = $${idx++}`); values.push(input.code ?? null); }
    if (input.parentDepartmentId !== undefined) { fields.push(`parent_department_id = $${idx++}`); values.push(input.parentDepartmentId ?? null); }
    if (input.headUserId !== undefined) { fields.push(`head_user_id = $${idx++}`); values.push(input.headUserId ?? null); }
    if (input.status !== undefined) { fields.push(`status = $${idx++}`); values.push(input.status); }

    if (!fields.length) return this.findById(id);

    values.push(id);
    const result = await getPool().query(
      `UPDATE departments SET ${fields.join(", ")}, updated_at = NOW()
       WHERE id = $${idx}
       RETURNING id, name, code, parent_department_id, head_user_id, status, created_at, updated_at`,
      values
    );
    return result.rows[0] ? mapDept(result.rows[0]) : null;
  },
};
