// features/ordering/repositories/order.repository.ts
import { prisma } from "../../../../lib/prisma";
import type { OrderStatus } from "../types/order.dto";

export const orderRepository = {
  create(data: Parameters<typeof prisma.order.create>[0]["data"]) {
    return prisma.order.create({
      data,
      include: { items: true },
    });
  },

  findById(id: string) {
    return prisma.order.findUnique({
      where: { id },
      include: { items: true },
    });
  },

  findByUser(userId: string) {
    return prisma.order.findMany({
      where: { userId },
      include: { items: true },
      orderBy: { createdAt: "desc" },
    });
  },

  findAllForAdmin({ skip, take }: { skip: number; take: number }) {
    return prisma.order.findMany({
      skip,
      take,
      include: { items: true },
      orderBy: { createdAt: "desc" },
    });
  },

  updateStatus(id: string, status: OrderStatus) {
    return prisma.order.update({
      where: { id },
      data: { status },
      include: { items: true },
    });
  },
};
