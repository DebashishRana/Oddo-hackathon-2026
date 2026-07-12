import { Request, Response } from "express";
import { ok } from "../../utils/apiResponse";
import { dashboardService } from "./dashboard.service";

export class DashboardController {
  async kpis(_req: Request, res: Response) {
    const kpis = await dashboardService.getKpis();
    return ok(res, "KPIs retrieved.", { kpis });
  }
}

export const dashboardController = new DashboardController();
