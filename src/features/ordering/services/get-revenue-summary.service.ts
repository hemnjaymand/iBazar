// نمونه‌ی سرویسی که باید به features/ordering اضافه بشه:
// features/ordering/services/get-revenue-summary.service.ts

import { prisma } from "../../../../lib/prisma";

export async function getRevenueSummaryService() {
  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const orders = await prisma.order.findMany({
    where: { createdAt: { gte: startOfMonth }, status: { in: ["PAID", "PROCESSING", "SHIPPED", "DELIVERED"] } },
  });

  const total = orders.reduce((sum, o) => sum + o.total.toNumber(), 0);
  const dailyMap = new Map<string, number>();
  for (const o of orders) {
    const day = o.createdAt.toISOString().slice(0, 10);
    dailyMap.set(day, (dailyMap.get(day) ?? 0) + o.total.toNumber());
  }

  return {
    total: total.toFixed(2),
    orderCount: orders.length,
    daily: Array.from(dailyMap.entries()).map(([date, amount]) => ({ date, amount })),
  };
}