import { getPool } from "../../config/database";
import type { SampleEntity } from "../models";

const mapSampleEntity = (row: Record<string, unknown>): SampleEntity => ({
  id: Number(row.id),
  name: String(row.name),
  status: String(row.status),
  owner_user_id: row.owner_user_id === null ? null : Number(row.owner_user_id),
  created_at: new Date(String(row.created_at)),
});

export type CreateSampleEntityInput = {
  name: string;
  status?: string;
  ownerUserId?: number | null;
};

export const sampleEntityRepository = {
  async list(): Promise<SampleEntity[]> {
    const result = await getPool().query(
      "SELECT id, name, status, owner_user_id, created_at FROM sample_entities ORDER BY created_at DESC"
    );
    return result.rows.map(mapSampleEntity);
  },

  async create(input: CreateSampleEntityInput): Promise<SampleEntity> {
    const result = await getPool().query(
      `INSERT INTO sample_entities (name, status, owner_user_id)
       VALUES ($1, $2, $3)
       RETURNING id, name, status, owner_user_id, created_at`,
      [input.name, input.status || "draft", input.ownerUserId || null]
    );

    return mapSampleEntity(result.rows[0]);
  },
};
