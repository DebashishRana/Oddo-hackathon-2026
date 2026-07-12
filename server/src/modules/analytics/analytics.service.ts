import { AppError } from "../../utils/errors";

const utilizationSeries = [42, 46, 44, 51, 53, 56, 58, 61, 63, 66, 68, 71];
const maintenanceSeries = [12, 15, 14, 18, 22, 19, 21, 24, 20, 17, 23, 26];

const utilizationTop = [
  { name: "MacBook Pro 16", department: "IT", category: "Electronics", allocations: 42, usageDays: 287, idleDays: 6 },
  { name: "Dell Docking Hub", department: "IT", category: "Electronics", allocations: 36, usageDays: 254, idleDays: 12 },
  { name: "Conference Room A", department: "Facilities", category: "Rooms", allocations: 31, usageDays: 198, idleDays: 4 },
  { name: "Delivery Van 02", department: "Operations", category: "Vehicles", allocations: 27, usageDays: 176, idleDays: 18 },
];

const utilizationIdle = utilizationTop
  .slice()
  .sort((a, b) => b.idleDays - a.idleDays)
  .map((asset) => ({ ...asset }));

const maintenanceAssets = [
  { name: "Delivery Van 02", department: "Operations", category: "Vehicles", events: 9, cost: 18400, dueInDays: 4 },
  { name: "Conference Room A", department: "Facilities", category: "Rooms", events: 7, cost: 8200, dueInDays: 8 },
  { name: "MacBook Pro 16", department: "IT", category: "Electronics", events: 6, cost: 12400, dueInDays: 13 },
  { name: "Projector Unit 4", department: "IT", category: "Electronics", events: 5, cost: 6600, dueInDays: 21 },
];

const categoryMaintenance = [
  { category: "Electronics", events: 52 },
  { category: "Furniture", events: 31 },
  { category: "Vehicles", events: 18 },
  { category: "Rooms", events: 14 },
];

const departmentSummary = [
  { department: "Operations", total: 820, allocated: 602, available: 148, maintenance: 38, retired: 32 },
  { department: "IT", total: 540, allocated: 398, available: 92, maintenance: 34, retired: 16 },
  { department: "Facilities", total: 310, allocated: 192, available: 74, maintenance: 27, retired: 17 },
  { department: "Finance", total: 160, allocated: 98, available: 41, maintenance: 8, retired: 13 },
];

const bookingResources = [
  {
    name: "Room Alpha",
    type: "Room",
    location: "HQ - 2nd Floor",
    utilization: [
      [1, 1, 2, 4, 4, 3, 2, 1, 1],
      [1, 2, 3, 4, 4, 3, 3, 2, 1],
      [1, 1, 2, 3, 4, 4, 3, 2, 1],
      [1, 1, 2, 2, 3, 4, 4, 3, 2],
      [0, 1, 1, 2, 3, 4, 4, 3, 2],
      [0, 0, 1, 1, 2, 3, 4, 3, 2],
      [0, 0, 0, 1, 1, 2, 3, 3, 2],
    ],
  },
  {
    name: "Delivery Van 02",
    type: "Vehicle",
    location: "Warehouse",
    utilization: [
      [0, 1, 1, 2, 3, 3, 2, 1, 0],
      [0, 1, 2, 3, 3, 3, 2, 1, 0],
      [0, 0, 1, 2, 4, 4, 3, 1, 0],
      [0, 0, 1, 2, 3, 4, 4, 2, 1],
      [0, 0, 0, 1, 2, 3, 4, 3, 1],
      [0, 0, 0, 1, 1, 2, 3, 2, 1],
      [0, 0, 0, 0, 1, 1, 2, 2, 1],
    ],
  },
];

const toCsv = (rows: Record<string, string | number>[]) => {
  const headers = rows.length ? Object.keys(rows[0]) : [];
  return [headers.join(","), ...rows.map((row) => headers.map((header) => JSON.stringify(row[header] ?? "")).join(","))].join("\n");
};

export const analyticsService = {
  utilization() {
    return {
      kpis: {
        totalAssets: 1840,
        allocatedAssets: 1206,
        idleAssets: 318,
        underMaintenance: 74,
        utilizationRate: 68,
      },
      series: utilizationSeries.map((value, index) => ({ period: `M${index + 1}`, utilization_rate: value / 100 })),
      topUsed: utilizationTop,
      topIdle: utilizationIdle,
    };
  },

  maintenance() {
    return {
      kpis: {
        openMaintenanceRequests: 74,
        averageMaintenanceFrequency: 4.8,
        totalMaintenanceCost: 45600,
        assetsDueForMaintenance: 12,
      },
      categoryCounts: categoryMaintenance,
      costSeries: maintenanceSeries.map((value, index) => ({ period: `M${index + 1}`, cost: value * 1000 })),
      highFrequency: maintenanceAssets,
      retirementRisk: maintenanceAssets.slice().sort((a, b) => a.dueInDays - b.dueInDays),
    };
  },

  departments() {
    return {
      summaries: departmentSummary,
    };
  },

  bookings() {
    return {
      kpis: {
        totalBookings: 1842,
        peakHour: "1 pm - 3 pm",
        peakDays: ["Tue", "Thu"],
        averageUtilization: 0.68,
      },
      resources: bookingResources,
    };
  },

  reportRows(type: string) {
    switch (type) {
      case "asset-utilization":
        return utilizationTop.map((asset) => ({
          asset: asset.name,
          department: asset.department,
          category: asset.category,
          allocations: asset.allocations,
          usage_days: asset.usageDays,
          idle_days: asset.idleDays,
        }));
      case "maintenance-summary":
        return maintenanceAssets.map((asset) => ({
          asset: asset.name,
          department: asset.department,
          category: asset.category,
          maintenance_events: asset.events,
          cost: asset.cost,
          due_in_days: asset.dueInDays,
        }));
      case "department-summary":
        return departmentSummary.map((item) => ({
          department: item.department,
          total_assets: item.total,
          allocated: item.allocated,
          available: item.available,
          under_maintenance: item.maintenance,
          retired: item.retired,
        }));
      case "resource-bookings":
        return bookingResources.map((resource) => ({
          resource: resource.name,
          type: resource.type,
          location: resource.location,
          peak_utilization: Math.max(...resource.utilization.flat()) * 25,
        }));
      default:
        throw new AppError("Unknown report type", 400, "REPORT_TYPE_INVALID", "Unknown report type.");
    }
  },

  reportCsv(type: string) {
    return toCsv(this.reportRows(type));
  },
};
