import { sampleEntityRepository } from "../../db/repositories/sample-entity.repository";

export class SampleEntityService {
  list() {
    return sampleEntityRepository.list();
  }

  create(input: { name: string; status?: string; ownerUserId?: number | null }) {
    return sampleEntityRepository.create(input);
  }
}

export const sampleEntityService = new SampleEntityService();
