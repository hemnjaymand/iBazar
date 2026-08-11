import { Brand } from "@prisma/client/client";
import type { BrandResponseDTO } from "../types/brand.dto";

export function toBrandResponseDTO(b: Brand): BrandResponseDTO {
  return {
    id: b.id,
    name: b.name,
    slug: b.slug,
    logoUrl: b.logoUrl,
    isActive: b.isActive,
    parentId: null,
    children: [],
  };
}
