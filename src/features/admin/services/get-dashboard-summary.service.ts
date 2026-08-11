// features/administration/services/get-dashboard-summary.service.ts
import { getRevenueSummaryService } from "@/features/ordering";
import { getPublishedProductCountService } from "@/features/catalog";
import type { DashboardSummaryDTO } from "../types/dashboard-summary.dto";
import { getLowStockCountService } from "@/features/inventory/services/get-low-stock-count.service";

export async function getDashboardSummaryService(): Promise<DashboardSummaryDTO> {
  const [revenue, lowStockCount, publishedProductCount] = await Promise.all([
    getRevenueSummaryService(),
    getLowStockCountService(),
    getPublishedProductCountService(),
  ]);

  return {
    revenueThisMonth: revenue.total,
    orderCountThisMonth: revenue.orderCount,
    lowStockCount,
    publishedProductCount,
    dailyRevenue: revenue.daily,
  };
}