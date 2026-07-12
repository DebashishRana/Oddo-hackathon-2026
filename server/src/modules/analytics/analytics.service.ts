import { getPool } from "../../config/database";
import { AppError } from "../../utils/errors";

const toCsv = (rows: Record<string, string | number>[]) => {
  const headers = rows.length ? Object.keys(rows[0]) : [];
  return [headers.join(","), ...rows.map((row) => headers.map((header) => JSON.stringify(row[header] ?? "")).join(","))].join("\n");
};

export const analyticsService = {
  async utilization() {
    const pool = getPool();

    const kpiResult = await pool.query(`
      SELECT
        COUNT(*) FILTER (WHERE status NOT IN ('retired','disposed')) AS total_assets,
        COUNT(*) FILTER (WHERE status = 'allocated') AS allocated_assets,
        COUNT(*) FILTER (WHERE status = 'available') AS idle_assets,
        COUNT(*) FILTER (WHERE status = 'under_maintenance') AS under_maintenance
      FROM assets
    `);
    const kpiRow = kpiResult.rows[0];
    const total = Number(kpiRow.total_assets) || 1;
    const allocated = Number(kpiRow.allocated_assets);
    const utilizationRate = Math.round((allocated / total) * 100);

    // Monthly allocation counts over last 12 months
    const seriesResult = await pool.query(`
      SELECT TO_CHAR(DATE_TRUNC('month', created_at), 'Mon') AS period,
             COUNT(*) AS count
      FROM asset_allocations
      WHERE created_at >= NOW() - INTERVAL '12 months'
      GROUP BY DATE_TRUNC('month', created_at)
      ORDER BY DATE_TRUNC('month', created_at) ASC
    `);
    const seriesMap: Record<string, number> = {};
    for (const row of seriesResult.rows) {
      seriesMap[String(row.period)] = Number(row.count);
    }
    const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    const series = months.map((m) => ({ period: m, utilization_rate: (seriesMap[m] ?? 0) / 100 }));

    // Top used assets by allocation count
    const topUsedResult = await pool.query(`
      SELECT a.name, COALESCE(d.name, 'Unassigned') AS department,
             COALESCE(c.name, 'Uncategorized') AS category,
             COUNT(aa.id) AS allocations
      FROM assets a
      LEFT JOIN asset_allocations aa ON aa.asset_id = a.id
      LEFT JOIN departments d ON d.id = a.department_id
      LEFT JOIN asset_categories c ON c.id = a.category_id
      GROUP BY a.id, d.name, c.name
      ORDER BY allocations DESC
      LIMIT 10
    `);

    const topUsed = topUsedResult.rows.map((r) => ({
      name: String(r.name),
      department: String(r.department),
      category: String(r.category),
      allocations: Number(r.allocations),
      usageDays: Number(r.allocations) * 7,
      idleDays: Math.max(0, 30 - Number(r.allocations) * 3),
    }));

    const topIdle = [...topUsed].sort((a, b) => b.idleDays - a.idleDays);

    return {
      kpis: {
        totalAssets: Number(kpiRow.total_assets),
        allocatedAssets: allocated,
        idleAssets: Number(kpiRow.idle_assets),
        underMaintenance: Number(kpiRow.under_maintenance),
        utilizationRate,
      },
      series,
      topUsed,
      topIdle,
    };
  },

  async maintenance() {
    const pool = getPool();

    const kpiResult = await pool.query(`
      SELECT
        COUNT(*) FILTER (WHERE status NOT IN ('resolved','rejected')) AS open_requests,
        COUNT(*) FILTER (WHERE status = 'resolved') AS resolved,
        COUNT(DISTINCT asset_id) AS assets_under_maintenance
      FROM maintenance_requests
    `);
    const kpiRow = kpiResult.rows[0];

    const categoryResult = await pool.query(`
      SELECT COALESCE(c.name, 'Uncategorized') AS category, COUNT(mr.id) AS events
      FROM maintenance_requests mr
      LEFT JOIN assets a ON a.id = mr.asset_id
      LEFT JOIN asset_categories c ON c.id = a.category_id
      GROUP BY c.name
      ORDER BY events DESC
    `);

    const seriesResult = await pool.query(`
      SELECT TO_CHAR(DATE_TRUNC('month', created_at), 'Mon') AS period, COUNT(*) AS count
      FROM maintenance_requests
      WHERE created_at >= NOW() - INTERVAL '12 months'
      GROUP BY DATE_TRUNC('month', created_at)
      ORDER BY DATE_TRUNC('month', created_at) ASC
    `);

    const costSeriesMap: Record<string, number> = {};
    for (const row of seriesResult.rows) costSeriesMap[String(row.period)] = Number(row.count);
    const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

    const highFreqResult = await pool.query(`
      SELECT a.name, COALESCE(d.name,'Unassigned') AS department, COALESCE(c.name,'Uncategorized') AS category,
             COUNT(mr.id) AS events
      FROM maintenance_requests mr
      LEFT JOIN assets a ON a.id = mr.asset_id
      LEFT JOIN departments d ON d.id = a.department_id
      LEFT JOIN asset_categories c ON c.id = a.category_id
      GROUP BY a.id, d.name, c.name
      ORDER BY events DESC
      LIMIT 5
    `);

    return {
      kpis: {
        openMaintenanceRequests: Number(kpiRow.open_requests),
        averageMaintenanceFrequency: 0,
        totalMaintenanceCost: 0,
        assetsDueForMaintenance: Number(kpiRow.assets_under_maintenance),
      },
      categoryCounts: categoryResult.rows.map((r) => ({ category: String(r.category), events: Number(r.events) })),
      costSeries: months.map((m) => ({ period: m, cost: (costSeriesMap[m] ?? 0) * 1000 })),
      highFrequency: highFreqResult.rows.map((r) => ({
        name: String(r.name),
        department: String(r.department),
        category: String(r.category),
        events: Number(r.events),
        cost: 0,
        dueInDays: 0,
      })),
      retirementRisk: [],
    };
  },

  async departments() {
    const pool = getPool();

    const result = await pool.query(`
      SELECT
        COALESCE(d.name, 'Unassigned') AS department,
        COUNT(a.id) AS total,
        COUNT(a.id) FILTER (WHERE a.status = 'allocated') AS allocated,
        COUNT(a.id) FILTER (WHERE a.status = 'available') AS available,
        COUNT(a.id) FILTER (WHERE a.status = 'under_maintenance') AS maintenance,
        COUNT(a.id) FILTER (WHERE a.status = 'retired') AS retired
      FROM assets a
      LEFT JOIN departments d ON d.id = a.department_id
      GROUP BY d.name
      ORDER BY total DESC
    `);

    return {
      summaries: result.rows.map((r) => ({
        department: String(r.department),
        total: Number(r.total),
        allocated: Number(r.allocated),
        available: Number(r.available),
        maintenance: Number(r.maintenance),
        retired: Number(r.retired),
      })),
    };
  },

  async bookings() {
    const pool = getPool();

    const kpiResult = await pool.query(`
      SELECT
        COUNT(*) AS total_bookings,
        COUNT(*) FILTER (WHERE status IN ('upcoming','ongoing')) AS active_bookings
      FROM resource_bookings
    `);

    const resourceResult = await pool.query(`
      SELECT a.name, COALESCE(c.name, 'Asset') AS type, COALESCE(a.location, 'Unknown') AS location,
             COUNT(rb.id) AS booking_count
      FROM resource_bookings rb
      JOIN assets a ON a.id = rb.asset_id
      LEFT JOIN asset_categories c ON c.id = a.category_id
      GROUP BY a.id, c.name
      ORDER BY booking_count DESC
      LIMIT 10
    `);

    const total = Number(kpiResult.rows[0].total_bookings);
    const active = Number(kpiResult.rows[0].active_bookings);
    const avgUtil = total > 0 ? active / total : 0;

    return {
      kpis: {
        totalBookings: total,
        peakHour: "N/A",
        peakDays: [],
        averageUtilization: avgUtil,
      },
      resources: resourceResult.rows.map((r) => ({
        name: String(r.name),
        type: String(r.type),
        location: String(r.location),
        utilization: [[Number(r.booking_count)]],
      })),
    };
  },

  async reportRows(type: string) {
    const pool = getPool();

    switch (type) {
      case "asset-utilization": {
        const result = await pool.query(`
          SELECT a.name AS asset, COALESCE(d.name,'Unassigned') AS department,
                 COALESCE(c.name,'Uncategorized') AS category,
                 COUNT(aa.id) AS allocations
          FROM assets a
          LEFT JOIN asset_allocations aa ON aa.asset_id = a.id
          LEFT JOIN departments d ON d.id = a.department_id
          LEFT JOIN asset_categories c ON c.id = a.category_id
          GROUP BY a.id, d.name, c.name
          ORDER BY allocations DESC
          LIMIT 50
        `);
        return result.rows.map((r) => ({
          asset: String(r.asset),
          department: String(r.department),
          category: String(r.category),
          allocations: Number(r.allocations),
          usage_days: Number(r.allocations) * 7,
          idle_days: Math.max(0, 30 - Number(r.allocations) * 3),
        }));
      }
      case "maintenance-summary": {
        const result = await pool.query(`
          SELECT a.name AS asset, COALESCE(d.name,'Unassigned') AS department,
                 COALESCE(c.name,'Uncategorized') AS category,
                 COUNT(mr.id) AS maintenance_events
          FROM assets a
          LEFT JOIN maintenance_requests mr ON mr.asset_id = a.id
          LEFT JOIN departments d ON d.id = a.department_id
          LEFT JOIN asset_categories c ON c.id = a.category_id
          GROUP BY a.id, d.name, c.name
          ORDER BY maintenance_events DESC
          LIMIT 50
        `);
        return result.rows.map((r) => ({
          asset: String(r.asset),
          department: String(r.department),
          category: String(r.category),
          maintenance_events: Number(r.maintenance_events),
          cost: 0,
          due_in_days: 0,
        }));
      }
      case "department-summary": {
        const result = await pool.query(`
          SELECT COALESCE(d.name,'Unassigned') AS department,
                 COUNT(a.id) AS total_assets,
                 COUNT(a.id) FILTER (WHERE a.status='allocated') AS allocated,
                 COUNT(a.id) FILTER (WHERE a.status='available') AS available,
                 COUNT(a.id) FILTER (WHERE a.status='under_maintenance') AS under_maintenance,
                 COUNT(a.id) FILTER (WHERE a.status='retired') AS retired
          FROM assets a
          LEFT JOIN departments d ON d.id = a.department_id
          GROUP BY d.name
          ORDER BY total_assets DESC
        `);
        return result.rows.map((r) => ({
          department: String(r.department),
          total_assets: Number(r.total_assets),
          allocated: Number(r.allocated),
          available: Number(r.available),
          under_maintenance: Number(r.under_maintenance),
          retired: Number(r.retired),
        }));
      }
      case "resource-bookings": {
        const result = await pool.query(`
          SELECT a.name AS resource, COALESCE(c.name,'Asset') AS type,
                 COALESCE(a.location,'Unknown') AS location,
                 COUNT(rb.id) AS booking_count
          FROM resource_bookings rb
          JOIN assets a ON a.id = rb.asset_id
          LEFT JOIN asset_categories c ON c.id = a.category_id
          GROUP BY a.id, c.name
          ORDER BY booking_count DESC
          LIMIT 50
        `);
        return result.rows.map((r) => ({
          resource: String(r.resource),
          type: String(r.type),
          location: String(r.location),
          peak_utilization: Number(r.booking_count),
        }));
      }
      default:
        throw new AppError("Unknown report type", 400, "REPORT_TYPE_INVALID", "Unknown report type.");
    }
  },

  async reportCsv(type: string) {
    const rows = await this.reportRows(type);
    return toCsv(rows as Record<string, string | number>[]);
  },
};
