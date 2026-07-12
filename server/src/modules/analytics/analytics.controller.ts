import { Request, Response } from "express";
import { analyticsService } from "./analytics.service";
import { ok } from "../../utils/apiResponse";

export class AnalyticsController {
  async utilization(_req: Request, res: Response) {
    const data = await analyticsService.utilization();
    return ok(res, "Asset utilisation data retrieved.", data);
  }

  async maintenance(_req: Request, res: Response) {
    const data = await analyticsService.maintenance();
    return ok(res, "Maintenance analytics retrieved.", data);
  }

  async departments(_req: Request, res: Response) {
    const data = await analyticsService.departments();
    return ok(res, "Department allocation data retrieved.", data);
  }

  async bookings(_req: Request, res: Response) {
    const data = await analyticsService.bookings();
    return ok(res, "Booking heatmap data retrieved.", data);
  }

  async report(req: Request, res: Response) {
    const type = typeof req.params.type === "string" ? req.params.type : "";
    const csv = await analyticsService.reportCsv(type);
    res.setHeader("Content-Type", "text/csv; charset=utf-8");
    res.setHeader("Content-Disposition", `attachment; filename="${type || "report"}.csv"`);
    return res.send(csv);
  }
}

export const analyticsController = new AnalyticsController();
