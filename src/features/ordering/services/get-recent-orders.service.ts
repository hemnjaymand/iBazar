import { prisma } from "../../../../lib/prisma";

export interface OrderSummaryDTO {
  id: string;
  orderNumber: string;
  status: string;
  total: string;
  createdAt: string;
}

export async function getRecentOrdersService(limit = 10): Promise<OrderSummaryDTO[]> {
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    take: limit,
  });

  return orders.map((o) => ({
    id: o.id,
    orderNumber: o.orderNumber,
    status: o.status,
    total: o.total.toString(),
    createdAt: o.createdAt.toISOString(),
  }));
}
