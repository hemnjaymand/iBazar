
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
  name: string;
  slug: string;
  description: string | null;

  categoryId: string;
  brandId: string | null;

  isActive: boolean;
  isPublished: boolean;

  createdAt: Date;
  updatedAt: Date;

  imageUrl: string | null;

  defaultVariant: ProductDefaultVariantDTO | null;

  items: unknown[];
}

export interface ProductDetailDTO {
  id: string;
  name: string;
  slug: string;

  categoryId: string;
  brandId: string | null;

  description: string | null;

  isPublished: boolean;

  imageUrl: string | null;

  variants: VariantResponseDTO[];

  defaultVariant: VariantResponseDTO | null;
}
