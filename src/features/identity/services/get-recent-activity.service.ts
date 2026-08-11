import { getRecentOrdersService } from "@/features/ordering";
import type { ActivityItemDTO } from "../types/activity-item.dto";
import { prisma } from "../../../../lib/prisma";

/**
 * این سرویس، مثل getDashboardSummaryService، فقط Aggregator است — از
 * چند منبع مختلف (سفارش‌های اخیر از طریق Public API، و کاربران/موجودی
 * مستقیم از Prisma چون فعلاً Public API معادلی براشون نساختیم) یک فید
 * زمانی واحد می‌سازه.
 */
export async function getRecentActivityService(
  limit = 10,
): Promise<ActivityItemDTO[]> {
  const [orders, recentUsers, lowStockVariants] = await Promise.all([
    getRecentOrdersService(5),
    prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      select: { id: true, name: true, email: true, createdAt: true },
    }),
    prisma.variant.findMany({
      where: { stock: { lte: 5 }, isActive: true },
      take: 5,
      orderBy: { updatedAt: "desc" },
      select: {
        id: true,
        sku: true,
        stock: true,
        updatedAt: true,
        product: { select: { name: true } },
      },
    }),
  ]);

  const items: ActivityItemDTO[] = [
    ...orders.map((o) => ({
      id: `order-${o.id}`,
      type: "ORDER_PLACED" as const,
      message: `سفارش جدید ${o.orderNumber} ثبت شد`,
      timestamp: o.createdAt,
    })),
    ...recentUsers.map((u) => ({
      id: `user-${u.id}`,
      type: "USER_REGISTERED" as const,
      message: `${u.name ?? u.email} عضو فروشگاه شد`,
      timestamp: u.createdAt.toISOString(),
    })),
    ...lowStockVariants.map((v) => ({
      id: `stock-${v.id}`,
      type: "LOW_STOCK" as const,
      message: `موجودی ${v.product.name} (${v.sku}) به ${v.stock} رسید`,
      timestamp: v.updatedAt.toISOString(),
    })),
  ];

  return items
    .sort((a, b) => b.timestamp.localeCompare(a.timestamp))
    .slice(0, limit);
}
