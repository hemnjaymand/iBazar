import { orderRepository } from "../repositories/order.repository";
import { BusinessError } from "@/server/errors/business-error";
import { ErrorCodes } from "@/server/errors/error-codes";
import { toOrderDTO } from "../mappers/order.mapper";
import type { OrderStatus } from "../types/order.dto";

const ALLOWED_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  PENDING: ["PAID", "CANCELLED"],
  PAID: ["PROCESSING", "CANCELLED", "REFUNDED"],
  PROCESSING: ["SHIPPED", "CANCELLED"],
  SHIPPED: ["DELIVERED"],
  DELIVERED: ["REFUNDED"],
  CANCELLED: [],
  REFUNDED: [],
};

export async function updateOrderStatusService(orderId: string, newStatus: OrderStatus) {
  const order = await orderRepository.findById(orderId);
  if (!order) {
    throw new BusinessError("سفارش یافت نشد", ErrorCodes.ORDER_NOT_FOUND);
  }

  const currentStatus = order.status as OrderStatus;
  const allowedNext = ALLOWED_TRANSITIONS[currentStatus] ?? [];
  
  if (!allowedNext.includes(newStatus)) {
    throw new BusinessError(
      `انتقال وضعیت از ${currentStatus} به ${newStatus} مجاز نیست`,
      ErrorCodes.INVALID_ORDER_STATUS_TRANSITION
    );
  }

  // متد آپدیت در ریپازیتوری باید تضمین کند که items اینکلود شده‌اند
  const updatedOrder = await orderRepository.updateStatus(orderId, newStatus);
  return toOrderDTO(updatedOrder);
}