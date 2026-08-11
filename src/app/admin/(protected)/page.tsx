// app/admin/page.tsx
import { getDashboardSummaryService } from "@/features/admin/services/get-dashboard-summary.service";
import { getRecentOrdersService, getOrdersCountByDayService, getTopProductsService } from "@/features/ordering";
import { DashboardMetricCards } from "@/features/admin/components/dashboard-metric-cards";
import { RevenueChart } from "@/features/admin/components/revenue-chart";
import { RecentOrdersTable } from "@/features/admin/components/recent-orders-table";
import { getRecentActivityService } from "@/features/identity/services/get-recent-activity.service";
import { OrdersBarChart } from "@/features/identity/components/orders-bar-chart";
import { TopProductsChart } from "@/features/identity/components/top-products-chart";
import { ActivityFeed } from "@/features/identity/components/activity-feed";
import { AdminSidebar } from "@/features/admin/components/admin-sidebar";

export default async function AdminDashboard() {
  const [summary, recentOrders, ordersByDay, topProducts, activity] = await Promise.all([
    getDashboardSummaryService(),
    getRecentOrdersService(5),
    getOrdersCountByDayService(14),
    getTopProductsService(5),
    getRecentActivityService(8),
  ]);
  // console.log({ summary, ordersByDay, topProducts });
  return (
    <div className="min-h-screen bg-[var(--color-background)] text-[var(--color-foreground)]">
     
      <div className="mx-auto max-w-7xl px-4 py-8 space-y-8">
             {/* 1. تگ aside با عرض ثابت برای جلوگیری از انقباض flex */}
        {/* Header */}
   
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold tracking-tight">داشبورد مدیریت</h1>
        </div>

        {/* Metrics */}
        <DashboardMetricCards summary={summary} />

        {/* Charts Section 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] p-5 shadow-sm transition-shadow hover:shadow-md">
            <h2 className="text-base font-semibold mb-6 text-gray-800 dark:text-gray-100">روند درآمد روزانه</h2>
            <RevenueChart data={summary.dailyRevenue} />
          </div>
          
          <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] p-5 shadow-sm transition-shadow hover:shadow-md">
            <h2 className="text-base font-semibold mb-6 text-gray-800 dark:text-gray-100">تعداد سفارش روزانه (۱۴ روز اخیر)</h2>
            <OrdersBarChart data={ordersByDay} />
          </div>
        </div>

        {/* Charts & Tables Section 2 */}
        <div className="grid grid-cols-1 xl:grid-cols-[1fr_350px] gap-6">
          <div className="flex flex-col gap-6">
            <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] p-5 shadow-sm">
              <h2 className="text-base font-semibold mb-6 text-gray-800 dark:text-gray-100">پرفروش‌ترین محصولات</h2>
              <TopProductsChart data={topProducts} />
            </div>
            
            <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] p-5 shadow-sm">
              <h2 className="text-base font-semibold mb-4 text-gray-800 dark:text-gray-100">آخرین سفارش‌ها</h2>
              <RecentOrdersTable orders={recentOrders} />
            </div>
          </div>

          <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] p-5 shadow-sm self-start">
            <h2 className="text-base font-semibold mb-6 text-gray-800 dark:text-gray-100">فعالیت‌های اخیر</h2>
            <ActivityFeed items={activity} />
          </div>
        </div>

      </div>
    </div>
  );
}