import { getPool } from "../../config/database";
import { activityService } from "../../services/activity.service";

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

    // Fire overdue-return notifications (at most once per allocation per day)
    await this.notifyOverdueReturns().catch(() => undefined);

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

  async notifyOverdueReturns() {
    const pool = getPool();
    const result = await pool.query(`
      SELECT aa.id, aa.allocated_to_user_id, a.name AS asset_name, a.asset_tag
      FROM asset_allocations aa
      JOIN assets a ON a.id = aa.asset_id
      WHERE aa.status = 'active'
        AND aa.expected_return_date IS NOT NULL
        AND aa.expected_return_date < CURRENT_DATE
        AND aa.allocated_to_user_id IS NOT NULL
        AND NOT EXISTS (
          SELECT 1 FROM notifications n
          WHERE n.user_id = aa.allocated_to_user_id
            AND n.type = 'overdue_return'
            AND n.entity_type = 'allocation'
            AND n.entity_id = aa.id
            AND n.created_at >= CURRENT_DATE
        )
      LIMIT 50
    `);

    for (const row of result.rows) {
      await activityService.notify({
        userId: Number(row.allocated_to_user_id),
        type: "overdue_return",
        title: "Overdue return alert",
        body: `${row.asset_name} (${row.asset_tag}) is past its expected return date.`,
        entityType: "allocation",
        entityId: Number(row.id),
      });
    }

    if (result.rows.length > 0) {
      await activityService.notifyRoles(["admin", "asset_manager"], {
        type: "overdue_return",
        title: "Overdue returns detected",
        body: `${result.rows.length} allocation(s) are past their expected return date.`,
        entityType: "allocation",
        entityId: null,
      });
    }
  },
};
