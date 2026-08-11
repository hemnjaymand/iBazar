import { brandRepository } from "../repositories/brand.repository";
import { BusinessError } from "@/server/errors/business-error";
import { ErrorCodes } from "@/server/errors/error-codes";
import type { CreateBrandInput } from "../schemas/brand.schema";
import { toBrandResponseDTO } from "../mappers/brand.mapper";

export async function createBrandService(input: CreateBrandInput) {
  const existing = await brandRepository.findBySlug(input.slug);
  if (existing) {
    throw new BusinessError("این slug قبلاً استفاده شده است", ErrorCodes.SLUG_ALREADY_EXISTS);
  }
  const brand = await brandRepository.create(input);
  return toBrandResponseDTO(brand);
}
