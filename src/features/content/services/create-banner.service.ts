// features/content/services/create-banner.service.ts
import { bannerRepository } from "../repositories/banner.repository";
import { toBannerDTO } from "../lib/banner.mapper";
import type { CreateBannerInput } from "../schemas/banner.schema";

export async function createBannerService(input: CreateBannerInput) {
  const banner = await bannerRepository.create(input);
  return toBannerDTO(banner);
}