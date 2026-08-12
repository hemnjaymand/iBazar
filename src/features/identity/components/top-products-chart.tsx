
"use client";

import dynamic from "next/dynamic";

export const TopProductsChart = dynamic(
  () =>
    import("./top-products-chart-inner").then(
      (module) => module.TopProductsChartInner
    ),
  {
    // نمودار فقط در Client رندر شود.
    // این کار از مشکلات SSR/Hydration در Recharts جلوگیری می‌کند.
    ssr: false,

    // Skeleton هنگام بارگذاری نمودار
    loading: () => (
      <div
        className="
          flex
          h-[300px]
          w-full
          flex-col
          justify-center
          gap-5
          rounded-xl
          bg-[var(--color-card)]
          px-2
          py-4
          animate-pulse
        "
        aria-busy="true"
        aria-label="در حال بارگذاری نمودار پرفروش‌ترین محصولات"
      >
        {[85, 45, 95, 60, 35].map((width, index) => (
          <div
            key={index}
            className="flex w-full items-center gap-4"
          >
            {/* شبیه‌ساز نام محصول */}
            <div
              className="
                h-4
                w-24
                shrink-0
                rounded-md
                bg-[var(--color-border)]/60
              "
            />

            {/* شبیه‌ساز نوار فروش */}
            <div
              className="
                h-6
                rounded-md
                bg-[var(--color-border)]/40
              "
              style={{
                width: `${width}%`,
              }}
            />
          </div>
        ))}
      </div>
    ),
  }
);
