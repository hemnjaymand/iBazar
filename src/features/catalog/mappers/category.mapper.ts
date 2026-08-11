// features/catalog/mappers/category.mapper.ts
import type { Category } from "@prisma/client";
import type { CategoryResponseDTO } from "../types/category.dto";

export function toCategoryResponseDTO(c: Category): CategoryResponseDTO {
  return {
    id: c.id,
    name: c.name,
    slug: c.slug,
    parentId: c.parentId,
    imageUrl: null,
    isActive: c.isActive,
  };
}
