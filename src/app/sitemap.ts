// app/sitemap.ts
import type { MetadataRoute } from "next";
import { prisma } from "../../lib/prisma";




export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const products = await prisma.product.findMany({
    where: { isPublished: true },
    select: { slug: true, updatedAt: true },
  });

  return products.map((p) => ({
    url: `https://yourdomain.com/products/${p.slug}`,
    lastModified: p.updatedAt,
  }));
}