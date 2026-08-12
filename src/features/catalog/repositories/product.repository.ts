import "server-only";
import { prisma } from "../../../../lib/prisma";
import { Prisma } from "../../../../prisma/generated/client";
import { ProductWithVariants } from "../mappers";
import { variantInclude } from "../prisma/product.include";

export interface CreateProductWithVariantInput {
  name: string;
  slug: string;
  description?: string;
  categoryId: string;
  brandId?: string;
  defaultVariant: {
    sku: string;
    price: number;
    compareAtPrice?: number;
    stock: number;
  };
}

export const productRepository = {
  findById(id: string) {
    return prisma.product.findUnique({
      where: { id },

      include: {
        images: {
          orderBy: {
            sortOrder: "asc",
          },
        },

        variants: {
          include: variantInclude,
        },

        category: {
          select: {
            id: true,
            name: true,
          },
        },

        brand: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  },
  findBySlug(slug: string) {
    return prisma.product.findUnique({
      where: {
        slug,
      },

      include: {
        images: {
          orderBy: {
            sortOrder: "asc",
          },
        },

        variants: {
          include: variantInclude,
        },
      },
    });
  },
  findManyByIds(ids: string[]) {
    return prisma.product.findMany({
      where: {
        id: {
          in: ids,
        },
      },

      include: {
        images: {
          orderBy: {
            sortOrder: "asc",
          },
          take: 1,
        },

        variants: {
          include: variantInclude,
        },
      },
    });
  },
  findManyPublished(params: {
    skip: number;
    take: number;
    categoryId?: string;
  }) {
    return prisma.product.findMany({
      where: {
        isPublished: true,
        ...(params.categoryId ? { categoryId: params.categoryId } : {}),
      },

      include: {
        images: {
          orderBy: {
            sortOrder: "asc",
          },
          take: 1,
        },

        variants: {
          include: variantInclude,
        },
      },

      skip: params.skip,
      take: params.take,

      orderBy: {
        createdAt: "desc",
      },
    });
  },

  countPublished(categoryId?: string) {
    return prisma.product.count({
      where: {
        isPublished: true,
        ...(categoryId ? { categoryId } : {}),
      },
    });
  },
  findAllForAdmin(params: { skip: number; take: number }) {
    return prisma.product.findMany({
      include: {
        images: {
          orderBy: {
            sortOrder: "asc",
          },
          take: 1,
        },

        variants: {
          include: variantInclude,
        },

        category: {
          select: {
            id: true,
            name: true,
          },
        },

        brand: {
          select: {
            id: true,
            name: true,
          },
        },
      },

      skip: params.skip,
      take: params.take,

      orderBy: {
        createdAt: "desc",
      },
    });
  },

  countAllForAdmin() {
    return prisma.product.count();
  },
  /**
   * تایپ ورودی این‌جا دقیقاً همون فیلدهایی رو می‌گیره که واقعاً لازمه —
   * نه Prisma.ProductCreateInput خام (که شامل فیلدهای رابطه‌ای پیچیده‌تری
   * می‌شد و مجبورمون می‌کرد از "as any" برای دور زدنش استفاده کنیم).
   */
  createWithDefaultVariant(
    data: CreateProductWithVariantInput,
  ): Promise<ProductWithVariants> {
    const { defaultVariant, categoryId, brandId, ...rest } = data;
    return prisma.$transaction(async (tx) => {
      const product = await tx.product.create({
        data: {
          ...rest,
          category: { connect: { id: categoryId } },
          ...(brandId ? { brand: { connect: { id: brandId } } } : {}),
        },
      });
      const variant = await tx.variant.create({
        data: { ...defaultVariant, productId: product.id, isDefault: true },
        include: variantInclude,
      });
      return { ...product, images: [], variants: [variant] };
    });
  },
  update(id: string, data: Prisma.ProductUpdateInput) {
    return prisma.product.update({
      where: { id },
      data,
      include: { variants: { include: variantInclude } },
    });
  },
  updateVariant(
    id: string,
    data: {
      sku?: string;
      price?: number;
      compareAtPrice?: number | null;
      stock?: number;
    },
  ) {
    return prisma.variant.update({
      where: { id },
      data,
    });
  },
  softDelete(id: string) {
    return prisma.product.update({
      where: {
        id,
      },

      data: {
        isActive: false,
        isPublished: false,
      },

      include: {
        images: {
          orderBy: {
            sortOrder: "asc",
          },
        },

        variants: {
          include: variantInclude,
        },
      },
    });
  },

  findSkuExists(sku: string) {
    return prisma.variant.findUnique({ where: { sku } });
  },
  findDiscounted(limit: number) {
    return prisma.product.findMany({
      where: {
        isPublished: true,
        variants: { some: { isDefault: true, compareAtPrice: { not: null } } },
      },
      include: {
        variants: { include: variantInclude },
        images: { take: 1, orderBy: { sortOrder: "asc" } },
      },
      take: limit,
      orderBy: { createdAt: "desc" },
    });
  },
};

//
