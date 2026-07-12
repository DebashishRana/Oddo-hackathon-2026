import { getPool } from "../../config/database";

export const dashboardService = {
  async getKpis() {
    const pool = getPool();

    const [assetCounts, maintenanceToday, activeBookings, pendingTransfers, upcomingReturns, overdueReturns] = await Promise.all([
      pool.query(`
        SELECT
          SUM(CASE WHEN status = 'available' THEN 1 ELSE 0 END) AS available,
          SUM(CASE WHEN status = 'allocated' THEN 1 ELSE 0 END) AS allocated,
          SUM(CASE WHEN status = 'under_maintenance' THEN 1 ELSE 0 END) AS under_maintenance,
          COUNT(*) AS total
        FROM assets
        WHERE status NOT IN ('retired', 'disposed')
      `),
      pool.query(`
        SELECT COUNT(*) FROM maintenance_requests
        WHERE created_at >= CURRENT_DATE
      `),
      pool.query(`
        SELECT COUNT(*) FROM resource_bookings
        WHERE status IN ('upcoming', 'ongoing')
      `),
      pool.query(`
        SELECT COUNT(*) FROM transfer_requests
        WHERE status = 'requested'
      `),
      pool.query(`
        SELECT COUNT(*) FROM asset_allocations
        WHERE status = 'active'
          AND expected_return_date IS NOT NULL
          AND expected_return_date >= CURRENT_DATE
          AND expected_return_date <= CURRENT_DATE + INTERVAL '7 days'
      `),
      pool.query(`
        SELECT COUNT(*) FROM asset_allocations
        WHERE status = 'active'
          AND expected_return_date IS NOT NULL
          AND expected_return_date < CURRENT_DATE
      `),
    ]);

    const assetRow = assetCounts.rows[0];
    return {
      assetsAvailable: Number(assetRow.available ?? 0),
      assetsAllocated: Number(assetRow.allocated ?? 0),
      assetsUnderMaintenance: Number(assetRow.under_maintenance ?? 0),
      totalAssets: Number(assetRow.total ?? 0),
      maintenanceToday: Number(maintenanceToday.rows[0].count),
      activeBookings: Number(activeBookings.rows[0].count),
      pendingTransfers: Number(pendingTransfers.rows[0].count),
      upcomingReturns: Number(upcomingReturns.rows[0].count),
      overdueReturns: Number(overdueReturns.rows[0].count),
    };
  },
};
