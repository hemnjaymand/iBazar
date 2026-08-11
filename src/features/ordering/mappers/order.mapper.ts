import { Order, OrderItem } from "@prisma/client/client";
import type { OrderDTO, OrderItemDTO, OrderStatus } from "../types/order.dto";

export function toOrderItemDTO(item: OrderItem): OrderItemDTO {
  const lineTotal = item.unitPrice.toNumber() * item.quantity;
  return {
    productName: item.productName,
    sku: item.sku,
    unitPrice: item.unitPrice.toString(),
    quantity: item.quantity,
    lineTotal: lineTotal.toFixed(2),
  };
}

export function toOrderDTO(order: Order & { items: OrderItem[] }): OrderDTO {
  const shippingAddress = order.shippingAddress as {
    fullName: string;
    city: string;
    addressLine: string;
  } | null;

  return {
    id: order.id,
    orderNumber: order.orderNumber,
    status: order.status as OrderStatus,
    items: order.items.map(toOrderItemDTO),
    subtotal: order.subtotal.toString(),
    discountTotal: order.discountTotal?.toString() ?? "0",
    shippingCost: order.shippingCost.toString(),
    total: order.total.toString(),
    createdAt: order.createdAt.toISOString(),
    shippingAddress: shippingAddress
      ? {
          fullName: shippingAddress.fullName,
          city: shippingAddress.city,
          addressLine: shippingAddress.addressLine,
        }
      : null,
  };
}