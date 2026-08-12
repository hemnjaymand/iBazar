import { getDashboardSummaryService } from "@/features/admin/services/get-dashboard-summary.service";
import {
  getRecentOrdersService,
  getOrdersCountByDayService,
  getTopProductsService,
} from "@/features/ordering";

import { DashboardMetricCards } from "@/features/admin/components/dashboard-metric-cards";
import { RevenueChart } from "@/features/admin/components/revenue-chart";
import { RecentOrdersTable } from "@/features/admin/components/recent-orders-table";

import { getRecentActivityService } from "@/features/identity/services/get-recent-activity.service";
import { OrdersBarChart } from "@/features/identity/components/orders-bar-chart";
import { TopProductsChart } from "@/features/identity/components/top-products-chart";
import { ActivityFeed } from "@/features/identity/components/activity-feed";

export default async function AdminDashboard() {
  const [summary, recentOrders, ordersByDay, topProducts, activity] =
    await Promise.all([
      getDashboardSummaryService(),
      getRecentOrdersService(5),
      getOrdersCountByDayService(14),
      getTopProductsService(5),
      getRecentActivityService(8),
    ]);

  return (
    <main className="min-h-screen bg-[var(--color-background)] text-[var(--color-foreground)]">
      <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        {/* =====================================================
            PAGE HEADER
        ====================================================== */}
        <header className="mb-8">
          <div className="flex flex-col gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-[var(--color-foreground)] sm:text-3xl">
              داشبورد مدیریت
            </h1>

            <p className="text-sm leading-6 text-[var(--color-muted-foreground)]">
              نمای کلی از وضعیت فروشگاه و فعالیت‌های اخیر
            </p>
          </div>
        </header>

        {/* =====================================================
            METRICS
        ====================================================== */}
        <section aria-label="آمار کلی">
          <DashboardMetricCards summary={summary} />
        </section>

        {/* =====================================================
            CHARTS - ROW 1
        ====================================================== */}
        <section className="mt-8">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Revenue Chart */}
            <div
              className="
                overflow-hidden
                rounded-2xl
                border border-[var(--color-border)]
                bg-[var(--color-card)]
                shadow-sm
                transition-shadow
                hover:shadow-md
              "
            >
              <div
                className="
                  flex items-center justify-between
                  border-b border-[var(--color-border)]
                  px-5 py-4
                "
              >
                <div>
                  <h2 className="text-sm font-semibold text-[var(--color-foreground)]">
                    روند درآمد روزانه
                  </h2>

                  <p className="mt-1 text-xs text-[var(--color-muted-foreground)]">
                    وضعیت درآمد در روزهای اخیر
                  </p>
                </div>
              </div>

              <div className="p-5">
                <RevenueChart data={summary.dailyRevenue} />
              </div>
            </div>

            {/* Orders Chart */}
            <div
              className="
                overflow-hidden
                rounded-2xl
                border border-[var(--color-border)]
                bg-[var(--color-card)]
                shadow-sm
                transition-shadow
                hover:shadow-md
              "
            >
              <div
                className="
                  flex items-center justify-between
                  border-b border-[var(--color-border)]
                  px-5 py-4
                "
              >
                <div>
                  <h2 className="text-sm font-semibold text-[var(--color-foreground)]">
                    تعداد سفارش‌ها
                  </h2>

                  <p className="mt-1 text-xs text-[var(--color-muted-foreground)]">
                    ۱۴ روز اخیر
                  </p>
                </div>
              </div>

              <div className="p-5">
                <OrdersBarChart data={ordersByDay} />
              </div>
            </div>
          </div>
        </section>

        {/* =====================================================
            CHARTS + TABLES - ROW 2
        ====================================================== */}
        <section className="mt-6">
          <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
            {/* Main Column */}
            <div className="flex min-w-0 flex-col gap-6">
              {/* Top Products */}
              <div
                className="
                  overflow-hidden
                  rounded-2xl
                  border border-[var(--color-border)]
                  bg-[var(--color-card)]
                  shadow-sm
                "
              >
                <div
                  className="
                    border-b border-[var(--color-border)]
                    px-5 py-4
                  "
                >
                  <h2 className="text-sm font-semibold text-[var(--color-foreground)]">
                    پرفروش‌ترین محصولات
                  </h2>

                  <p className="mt-1 text-xs text-[var(--color-muted-foreground)]">
                    محصولات با بیشترین میزان فروش
                  </p>
                </div>

                <div className="p-5">
                  <TopProductsChart data={topProducts} />
                </div>
              </div>

              {/* Recent Orders */}
              <div
                className="
                  overflow-hidden
                  rounded-2xl
                  border border-[var(--color-border)]
                  bg-[var(--color-card)]
                  shadow-sm
                "
              >
                <div
                  className="
                    flex items-center justify-between
                    border-b border-[var(--color-border)]
                    px-5 py-4
                  "
                >
                  <div>
                    <h2 className="text-sm font-semibold text-[var(--color-foreground)]">
                      آخرین سفارش‌ها
                    </h2>

                    <p className="mt-1 text-xs text-[var(--color-muted-foreground)]">
                      آخرین سفارش‌های ثبت‌شده
                    </p>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <RecentOrdersTable orders={recentOrders} />
                </div>
              </div>
            </div>

            {/* Activity */}
            <aside
              className="
                h-fit
                overflow-hidden
                rounded-2xl
                border border-[var(--color-border)]
                bg-[var(--color-card)]
                shadow-sm
              "
            >
              <div
                className="
                  border-b border-[var(--color-border)]
                  px-5 py-4
                "
              >
                <h2 className="text-sm font-semibold text-[var(--color-foreground)]">
                  فعالیت‌های اخیر
                </h2>

                <p className="mt-1 text-xs text-[var(--color-muted-foreground)]">
                  آخرین فعالیت‌های انجام‌شده
                </p>
              </div>

              <div className="p-5">
                <ActivityFeed items={activity} />
              </div>
            </aside>
          </div>
        </section>
      </div>
    </main>
  );
}
