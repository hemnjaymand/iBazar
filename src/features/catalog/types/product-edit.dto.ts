
export interface ProductEditVariantDTO {
  id: string;
  sku: string;
  price: number;
  compareAtPrice: number | null;
  stock: number;
}

export interface ProductEditImageDTO {
  id: string;
  url: string;
  altText: string | null;
  sortOrder: number;
}

export interface ProductEditDTO {
  id: string;
  name: string;
  slug: string;
  description: string | null;

  categoryId: string;
  brandId: string | null;

  isPublished: boolean;
  isActive: boolean;

  defaultVariant: {
    id: string;
    sku: string;
    price: number;
    compareAtPrice: number | null;
    stock: number;
  };

  images: ProductEditImageDTO[];
}
