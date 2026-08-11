
import { Page } from "@prisma/client/client";
import { prisma } from "../../../../lib/prisma";

export const pageRepository = {
  findPublishedBySlug(slug: string): Promise<Page | null> {
    return prisma.page.findFirst({
      where: { slug, isPublished: true },
    });
  },

  findBySlug(slug: string): Promise<Page | null> {
    return prisma.page.findUnique({
      where: { slug },
    });
  },

  findAll(): Promise<Page[]> {
    return prisma.page.findMany({
      orderBy: { title: "asc" },
    });
  },

  upsert(data: {
    slug: string;
    title: string;
    htmlContent: string;
    isPublished: boolean;
  }): Promise<Page> {
    return prisma.page.upsert({
      where: { slug: data.slug },
      update: data,
      create: data,
    });
  },

  delete(slug: string): Promise<Page> {
    return prisma.page.delete({
      where: { slug },
    });
  },
};
