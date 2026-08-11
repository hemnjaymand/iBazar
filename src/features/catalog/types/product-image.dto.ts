export interface ProductImageDTO {
  id: string;
  productId: string;
  url: string;
  altText: string | null;
  sortOrder: number;
}