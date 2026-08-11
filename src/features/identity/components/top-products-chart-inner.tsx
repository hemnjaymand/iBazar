"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import type { TopProductRow } from "@/features/ordering";

export function TopProductsChartInner({ data }: { data: TopProductRow[] }) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={data} layout="vertical" margin={{ right: 16 }}>
        <XAxis type="number" tick={{ fontSize: 11 }} />
        <YAxis
          type="category"
          dataKey="productName"
          tick={{ fontSize: 11 }}
          width={120}
        />
        <Tooltip
          formatter={(value) => [
            `${Number((value as number) ?? 0).toLocaleString("fa-IR")} تومان`,
            "مبلغ فروش",
          ]}
          labelStyle={{ direction: "rtl" }}
        />
        <Bar
          dataKey="totalRevenue"
          fill="var(--color-accent)"
          radius={[0, 4, 4, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
