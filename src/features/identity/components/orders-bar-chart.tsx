
"use client";

import dynamic from "next/dynamic";

export const OrdersBarChart = dynamic(
  () =>
    import("./orders-bar-chart-inner").then(
      (module) => module.OrdersBarChartInner
    ),
  {
    // Recharts فقط در Client اجرا شود
    // تا مشکل SSR و Hydration ایجاد نشود.
    ssr: false,

    // Skeleton هنگام بارگذاری نمودار
    loading: () => (
      <div
        className="
          flex
          h-[280px]
          w-full
          items-end
          justify-between
          gap-3
          rounded-xl
          bg-[var(--color-card)]
          px-4
          pb-8
          pt-10
          animate-pulse
        "
        aria-busy="true"
        aria-label="در حال بارگذاری نمودار سفارشات"
      >
        {[40, 70, 45, 90, 60, 30, 80].map((height, index) => (
          <div
            key={index}
            className="
              w-full
              rounded-t-md
              bg-[var(--color-border)]/50
            "
            style={{
              height: `${height}%`,
            }}
          />
        ))}
      </div>
    ),
  }
);
