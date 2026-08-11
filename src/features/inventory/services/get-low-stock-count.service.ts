import { prisma } from "../../../../lib/prisma";

export async function getLowStockCountService(): Promise<number> {
  // Prisma هنوز مقایسه‌ی دو ستون را در where مستقیم پشتیبانی نمی‌کند، پس Raw SQL:
  const result = await prisma.$queryRaw<{ count: bigint }[]>`
    SELECT COUNT(*)::bigint as count
    FROM variants
    WHERE stock <= "lowStockThreshold" AND "isActive" = true
  `;
  return Number(result[0]?.count ?? 0);
}
