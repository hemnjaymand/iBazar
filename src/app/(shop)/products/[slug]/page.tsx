import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Header } from "@/app/_components/header";
import { ProductGallery } from "@/features/catalog/components/product-gallery";
import { VariantSelector } from "@/features/catalog/components/variant-selector";
import { productRepository } from "@/features/catalog/repositories/product.repository";
import { toProductDetailDTO } from "@/features/catalog/mappers/product.mapper";
import { toProductImageDTO } from "@/features/catalog/mappers/product-image.mapper";
import { prisma } from "../../../../../lib/prisma";


export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await productRepository.findBySlug(slug);
  if (!product) return {};
  return {
    title: product.name,
    description: product.description?.slice(0, 160),
  };
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await productRepository.findBySlug(slug);

  if (!product || !product.isPublished) {
    notFound();
  }

  const productDTO = toProductDetailDTO(product);
  const images = await prisma.productImage.findMany({
    where: { productId: product.id },
    orderBy: { sortOrder: "asc" },
  });
  const imagesDTO = images.map(toProductImageDTO); // ✅ استفاده از مپر استاندارد

  return (
    <div className="min-h-screen">
      <Header />
      <main className="mx-auto max-w-7xl px-4 py-8 grid md:grid-cols-2 gap-10">
        <ProductGallery images={imagesDTO} />
        <div>
          <h1 className="text-xl font-bold mb-2">{productDTO.name}</h1>
          {productDTO.description && (
            <p className="text-sm text-[var(--color-muted-foreground)] leading-7 mb-6">
              {productDTO.description}
            </p>
          )}
          <VariantSelector variants={productDTO.variants} />
        </div>
      </main>
    </div>
  );
}
