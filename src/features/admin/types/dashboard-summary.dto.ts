// features/administration/types/dashboard-summary.dto.ts
export interface DashboardSummaryDTO {
  revenueThisMonth: string;
  orderCountThisMonth: number;
  lowStockCount: number;
  publishedProductCount: number;
  dailyRevenue: { date: string; amount: number }[];
}