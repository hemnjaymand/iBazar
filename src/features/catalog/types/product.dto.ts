import type { VariantResponseDTO } from "./variant.dto";

export interface ProductDefaultVariantDTO {
  id: string;
  price: number;
  compareAtPrice: number | null;
  sku: string;
  inventory: number;
   imageUrl: string | null; 
}
 
export interface ProductListItemDTO {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  categoryId: string;
  brandId: string | null;
  isActive: boolean;
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
  defaultVariant: ProductDefaultVariantDTO | null;
  items: ProductListItemDTO[]
  imageUrl: string | null; 
}

export interface ProductDetailDTO {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  categoryId: string;
  brandId: string | null;
  isPublished: boolean;
  variants: VariantResponseDTO[];
  defaultVariant: VariantResponseDTO | null;
   imageUrl: string | null; 
}
