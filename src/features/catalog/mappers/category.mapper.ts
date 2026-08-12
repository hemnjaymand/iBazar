// features/catalog/mappers/category.mapper.ts
import { Category } from "@prisma/client/client";
import type { CategoryResponseDTO } from "../types/category.dto";

export function toCategoryResponseDTO(c: Category): CategoryResponseDTO {
  return {
    id: c.id,
    name: c.name,
    slug: c.slug,
    parentId: c.parentId,
    imageUrl: c.imageUrl,
    isActive: c.isActive,
  };
}
