export interface ProductTableRow {
  id: string;
  name: string;
  slug: string;
  price: number;
  stock: number;
  isPublished: boolean;
  isActive: boolean;
  createdAt: Date;
  categoryName: string;
}
