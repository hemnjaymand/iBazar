// features/catalog/types/brand.dto.ts
export interface BrandResponseDTO {
  id: string;
  name: string;
  slug: string;
  logoUrl: string | null;
  isActive: boolean;
  parentId: string | null;
  children: BrandResponseDTO[];
}
