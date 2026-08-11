import { brandRepository } from "../repositories/brand.repository";

import { BusinessError } from "@/server/errors/business-error";
import { ErrorCodes } from "@/server/errors/error-codes";
import { toBrandResponseDTO } from "../mappers/brand.mapper";

export async function updateBrandService(
  id: string,
  data: Partial<{
    name: string;
    slug: string;
    logoUrl: string | null;
    isActive: boolean;
  }>,
) {
  const existing = await brandRepository.findById(id);
  if (!existing) {
    throw new BusinessError("برند یافت نشد", ErrorCodes.BRAND_NOT_FOUND);
  }
  const updated = await brandRepository.update(id, data);
  return toBrandResponseDTO(updated);
}
