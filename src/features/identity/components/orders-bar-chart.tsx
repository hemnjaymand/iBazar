"use client";

import dynamic from "next/dynamic";

export const OrdersBarChart = dynamic(
  () => import("./orders-bar-chart-inner").then((m) => m.OrdersBarChartInner),
  {
    // غیرفعال کردن رندر سمت سرور برای جلوگیری از خطاهای Hydration در Recharts
    ssr: false,

    // استفاده از Skeleton Loader به جای متن ساده
    loading: () => (
      <div
        className="h-[280px] w-full flex items-end justify-between gap-3 px-4 pb-8 pt-10 animate-pulse bg-[var(--color-card)] rounded-xl"
        aria-busy="true"
        aria-label="در حال بارگذاری نمودار سفارشات"
      >
        {/* تولید ۷ ستون میله‌ای تزئینی برای حالت لودینگ */}
        {[40, 70, 45, 90, 60, 30, 80].map((height, index) => (
          <div
            key={index}
            className="w-full bg-[var(--color-border)]/50 rounded-t-md"
            style={{ height: `${height}%` }}
          />
        ))}
      </div>
    ),
  },
);
