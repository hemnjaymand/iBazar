import { brandRepository } from "../repositories/brand.repository";
import { toBrandResponseDTO } from "../mappers/brand.mapper";
import type { BrandResponseDTO } from "../types/brand.dto";

export async function listBrandsForSelectService(): Promise<BrandResponseDTO[]> {
  const brands = await brandRepository.findAll(); // فرض بر این است که findAll وجود دارد
  return brands.map(toBrandResponseDTO);
}