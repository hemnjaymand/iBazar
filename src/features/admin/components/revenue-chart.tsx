"use client";

import dynamic from "next/dynamic";

export function ChartSkeleton() {
  return (
    <div className="h-[260px] flex items-center justify-center text-sm text-[var(--color-muted-foreground)]">
      در حال بارگذاری نمودار…
    </div>
  );
}

export const RevenueChart = dynamic(
  () => import("./revenue-chart-inner").then((m) => m.RevenueChartInner),
  {
    ssr: false,
    loading: () => <ChartSkeleton />,
  }
);