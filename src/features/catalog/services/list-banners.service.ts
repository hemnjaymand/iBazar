import { bannerRepository } from "@/features/content";
import { toBannerDTO } from "@/features/content/lib/banner.mapper";

export async function listBannersService() {
  const banners = await bannerRepository.findAll();
  return banners.map(toBannerDTO);
}