import type  { ProductListItemDTO } from "@/features/catalog/types/product-list-item.dto";
import type { Product } from "@prisma/client";

type ProductWithVariants = Product & {
  variants?: { price: number; stock: number }[];
  category?: { name: string };
};

export function toProductListItemDTO(product: ProductWithVariants): ProductListItemDTO {
  const defaultVariant = product.variants?.[0];

  return {
    id: product.id,
    name: product.name,
    slug: product.slug,
    isPublished: product.isPublished,
    price: defaultVariant?.price?.toString() ?? "0",
    stock: defaultVariant?.stock ?? 0,
    createdAt: product.createdAt.toISOString(),
    categoryName: product.category?.name ?? "—",
  };
}