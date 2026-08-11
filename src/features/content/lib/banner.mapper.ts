import { Banner } from "@prisma/client/client";
import { BannerDTO } from "../types";

export function toBannerDTO(banner: Banner): BannerDTO {
  return {
    id: banner.id,
    title: banner.title,
    imageUrl: banner.imageUrl,
    linkUrl: banner.linkUrl,
    sortOrder: banner.sortOrder,
    placement:banner.placement
  };
}
