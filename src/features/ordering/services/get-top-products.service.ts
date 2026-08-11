import { prisma } from "../../../../lib/prisma";

export interface TopProductRow {
  productName: string;
  totalRevenue: number;
  totalQuantity: number;
}

/**
 * چون OrderItem عمداً از Product/Variant واقعی جداست (Snapshot تاریخی،
 * طبق تصمیم فاز ۶)، این Aggregate روی خودِ نام محصولِ ثبت‌شده در سفارش
 * انجام می‌شه، نه روی جدول Product زنده — یعنی حتی اگه محصولی بعداً
 * حذف/تغییرنام بشه، آمار فروش تاریخی درست می‌مونه.
 */
export async function getTopProductsService(
  limit = 5,
): Promise<TopProductRow[]> {
  const grouped = await prisma.orderItem.groupBy({
    by: ["productName"],
    _sum: { quantity: true },
    orderBy: { _sum: { quantity: "desc" } },
    take: limit,
  });

  // مبلغ فروش هر محصول رو جدا محاسبه می‌کنیم چون unitPrice برای هر سفارش
  // می‌تونه فرق کنه (Snapshot قیمت لحظه‌ی خرید)، پس نمی‌شه با groupBy ساده جمعش زد
  const results: TopProductRow[] = [];
  for (const g of grouped) {
    const items = await prisma.orderItem.findMany({
      where: { productName: g.productName },
    });
    const totalRevenue = items.reduce(
      (sum, i) => sum + i.unitPrice.toNumber() * i.quantity,
      0,
    );
    results.push({
      productName: g.productName,
      totalQuantity: g._sum.quantity ?? 0,
      totalRevenue,
    });
  }

  return results;
}
