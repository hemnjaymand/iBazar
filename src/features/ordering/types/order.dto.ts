// features/ordering/types/order.dto.ts
export type OrderStatus = "PENDING" | "PAID" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED" | "REFUNDED";

export interface OrderItemDTO {
  productName: string;
  sku: string;
  unitPrice: string;
  quantity: number;
  lineTotal: string;
}

export interface OrderDTO {
  id: string;
  orderNumber: string;
  status: OrderStatus;
  items: OrderItemDTO[];
  subtotal: string;
  discountTotal: string;
  shippingCost: string;
  total: string;
  createdAt: string;
  shippingAddress: {
    fullName: string;
    city: string;
    addressLine: string;
  } | null;
}