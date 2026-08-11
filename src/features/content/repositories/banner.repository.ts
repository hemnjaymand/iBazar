// features/content/repositories/banner.repository.ts
import { BannerPlacement } from "@prisma/client/enums";
import { prisma } from "../../../../lib/prisma";

export const bannerRepository = {
  findActiveByPlacement(placement: BannerPlacement) {
    return prisma.banner.findMany({
      where: { placement, isActive: true },
      orderBy: { sortOrder: "asc" },
    });
  },
  findAll() {
    return prisma.banner.findMany({
      orderBy: [{ placement: "asc" }, { sortOrder: "asc" }],
    });
  },
  create(data: {
    title: string;
    imageUrl: string;
    linkUrl?: string;
    placement: BannerPlacement;
    sortOrder: number;
  }) {
    return prisma.banner.create({ data });
  },
  delete(id: string) {
    return prisma.banner.delete({ where: { id } });
  },
};
