import { getPool } from "../../config/database";
import type { Role } from "../models";

const mapRole = (row: Record<string, unknown>): Role => ({
  id: Number(row.id),
  slug: String(row.slug),
  name: String(row.name),
  created_at: new Date(String(row.created_at)),
});

export const roleRepository = {
  async findBySlug(slug: string): Promise<Role | null> {
    const result = await getPool().query("SELECT id, slug, name, created_at FROM roles WHERE slug = $1 LIMIT 1", [slug]);
    return result.rows[0] ? mapRole(result.rows[0]) : null;
  },
};
