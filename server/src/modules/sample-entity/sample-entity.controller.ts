import { Request, Response } from "express";
import { ok } from "../../utils/apiResponse";
import { sampleEntityService } from "./sample-entity.service";

const requireString = (value: unknown, field: string) => {
  if (typeof value !== "string" || !value.trim()) {
    throw new Error(`Invalid ${field}`);
  }

  return value.trim();
};

export class SampleEntityController {
  async list(_req: Request, res: Response) {
    const entities = await sampleEntityService.list();
    return ok(res, "Sample entities retrieved.", { entities });
  }

  async create(req: Request, res: Response) {
    const name = requireString(req.body.name, "name");
    const status = typeof req.body.status === "string" ? req.body.status.trim() : undefined;
    const entity = await sampleEntityService.create({
      name,
      status,
      ownerUserId: req.user?.id ?? null,
    });

    return ok(res, "Sample entity created.", { entity });
  }
}

export const sampleEntityController = new SampleEntityController();
