// features/catalog/types/category.dto.ts
export interface CategoryResponseDTO {
  id: string;
  name: string;
  slug: string;
  parentId: string | null;
  imageUrl: string | null;
  isActive: boolean;
}

// ارث‌بری تایپ درختی از تایپ اصلی
export interface CategoryTreeNodeDTO extends CategoryResponseDTO {
  children: CategoryTreeNodeDTO[];
}

export interface UpdateCategoryInput {
  name?: string;
  slug?: string;
  parentId?: string | null;
  isActive?: boolean;
  imageUrl?: string | null;
}
