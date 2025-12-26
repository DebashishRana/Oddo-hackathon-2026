import { requireAdminAccess } from "@/lib/admin-auth";
import { getAllDiscountCodes, getDiscountStats, type DiscountCode } from "@/lib/database";
import { DiscountManagement } from "@/components/admin/discount-management";

export const runtime = 'nodejs';

interface DiscountStats {
  totalCodes: number;
  activeCodes: number;
  expiredCodes: number;
  usedCodes: number;
  totalUsage: number;
}

export default async function AdminDiscountsPage() {
  // This will redirect non-admin users
  await requireAdminAccess();

  // Get discount codes and stats
  let discountCodes: DiscountCode[] = [];
  let stats: DiscountStats = {
    totalCodes: 0,
    activeCodes: 0,
    expiredCodes: 0,
    usedCodes: 0,
    totalUsage: 0
  };

  try {
    [discountCodes, stats] = await Promise.all([
      getAllDiscountCodes(),
      getDiscountStats()
    ]);
  } catch (error) {
    console.error("Error fetching discount data:", error);
    discountCodes = [];
    stats = {
      totalCodes: 0,
      activeCodes: 0,
      expiredCodes: 0,
      usedCodes: 0,
      totalUsage: 0
    };
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Discount Code Management</h1>
        <p className="text-muted-foreground">
          Create and manage promotional discount codes for your application.
        </p>
        {/* Debug info to verify real data */}
        <div className="text-xs text-muted-foreground mt-2">
          Last updated: {new Date().toLocaleString()} | Total Codes: {stats.totalCodes} | Active: {stats.activeCodes} | Data Source: PostgreSQL Database
        </div>
      </div>

      <DiscountManagement 
        initialDiscounts={discountCodes} 
        initialStats={stats}
      />
    </div>
  );
}
