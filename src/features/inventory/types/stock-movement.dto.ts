// features/inventory/types/stock-movement.dto.ts
export interface StockMovementDTO {
  id: string;
  type: string;
  quantity: number;
  reason: string | null;
  createdAt: string; // ISO string
}

export interface InventoryRowDTO {
  variantId: string;
  productName: string;
  sku: string;
  stock: number;
  lowStockThreshold: number;
  isLowStock: boolean;
}