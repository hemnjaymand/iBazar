import { prisma } from "../../../../lib/prisma";
import {
  toProductListItemDTO,
  VariantWithAttributes,
} from "../mappers/product.mapper";
import type { ProductListItemDTO } from "../types/product.dto";
import type { Prisma } from "@prisma/client";

interface SearchProductsOptions {
  page?: number;
  categoryId?: string;
  limit?: number;
  search?: string;
  isPublished?: boolean;
}

interface PaginatedResult<T> {
  items: T[];
  total: number;
  totalPages: number;
  currentPage: number;
  limit: number;
}

const productSearchInclude = {
  images: {
    orderBy: {
      sortOrder: "asc",
    },
    take: 1,
  },

  variants: {
    include: {
      attributeValues: {
        include: {
          attributeValue: {
            include: {
              attribute: true,
            },
          },
        },
      },
    },
  },
} satisfies Prisma.ProductInclude;

type ProductWithSearchRelations = Prisma.ProductGetPayload<{
  include: typeof productSearchInclude;
}>;

export async function searchProductsService({
  page = 1,
  categoryId,
  limit = 12,
  search,
  isPublished = true,
}: SearchProductsOptions = {}): Promise<PaginatedResult<ProductListItemDTO>> {
  const offset = (page - 1) * limit;

  const where: Prisma.ProductWhereInput = {
    ...(categoryId && {
      categoryId,
    }),

    ...(search && {
      name: {
        contains: search,
        mode: "insensitive",
      },
    }),

    ...(isPublished !== undefined && {
      isPublished,
    }),
  };

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,

      skip: offset,

      take: limit,

      orderBy: {
        createdAt: "desc",
      },

      include: productSearchInclude,
    }),

    prisma.product.count({
      where,
    }),
  ]);

  const items = products.map((product: ProductWithSearchRelations) =>
    toProductListItemDTO(product),
  );

  return {
    items,
    total,
    totalPages: Math.ceil(total / limit),
    currentPage: page,
    limit,
  };
}
