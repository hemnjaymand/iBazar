"use client";

import dynamic from "next/dynamic";

export const TopProductsChart = dynamic(
  () =>
    import("./top-products-chart-inner").then((m) => m.TopProductsChartInner),
  {
    ssr: false,
    loading: () => (
      <div 
        className="h-[300px] w-full flex flex-col justify-center gap-5 py-4 px-2 animate-pulse bg-[var(--color-card)] rounded-xl"
        aria-busy="true"
        aria-label="در حال بارگذاری نمودار پرفروش‌ترین محصولات"
      >
        {/* تولید ۵ ردیف افقی تزئینی برای شبیه‌سازی لودینگ محصولات */}
        {[85, 45, 95, 60, 35].map((width, index) => (
          <div key={index} className="flex items-center gap-4 w-full">
            {/* شبیه‌ساز لیبل محور Y (نام محصول) */}
            <div className="h-4 w-24 bg-[var(--color-border)]/60 rounded-md shrink-0" />
            
            {/* شبیه‌ساز نوار افقی (میزان فروش) */}
            <div 
              className="h-6 bg-[var(--color-border)]/40 rounded-md" 
              style={{ width: `${width}%` }} 
            />
          </div>
        ))}
      </div>
    ),
  }
);