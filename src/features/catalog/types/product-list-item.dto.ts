// features/catalog/types/product-list-item.dto.ts
export interface ProductListItemDTO {
  id: string;
  name: string;
  slug: string;
  isPublished: boolean;
  price: string;
  stock: number;
  createdAt: string;
  // در صورت نیاز اضافه کنید
  description?: string;
  categoryId?: string;
  brandId?: string;
  categoryName?: string;
}