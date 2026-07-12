import { Request, Response } from "express";
import { analyticsService } from "./analytics.service";
import { ok } from "../../utils/apiResponse";

export class AnalyticsController {
  async utilization(_req: Request, res: Response) {
    return ok(res, "Asset utilisation data retrieved.", analyticsService.utilization());
  }

  async maintenance(_req: Request, res: Response) {
    return ok(res, "Maintenance analytics retrieved.", analyticsService.maintenance());
  }

  async departments(_req: Request, res: Response) {
    return ok(res, "Department allocation data retrieved.", analyticsService.departments());
  }

  async bookings(_req: Request, res: Response) {
    return ok(res, "Booking heatmap data retrieved.", analyticsService.bookings());
  }

  async report(req: Request, res: Response) {
    const type = typeof req.params.type === "string" ? req.params.type : "";
    const csv = analyticsService.reportCsv(type);
    res.setHeader("Content-Type", "text/csv; charset=utf-8");
    res.setHeader("Content-Disposition", `attachment; filename="${type || "report"}.csv"`);
    return res.send(csv);
  }
}

export const analyticsController = new AnalyticsController();
