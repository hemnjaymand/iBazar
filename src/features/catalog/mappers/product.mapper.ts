import type { AdminProductListItem } from "../services/list-products-for-admin.service";
import type { ProductTableRow } from "../types/product-table-row.dto";

import type {
  ProductDetailDTO,
  ProductListItemDTO,
  ProductDefaultVariantDTO,
} from "../types/product.dto";
import { VariantResponseDTO } from "../types";
import {
  Attribute,
  AttributeValue,
  Product,
  Variant,
  VariantAttributeValue,
} from "@prisma/client/client";

export type VariantWithAttributes = Variant & {
  attributeValues: (VariantAttributeValue & {
    attributeValue: AttributeValue & {
      attribute: Attribute;
    };
  })[];
};

export type ProductWithVariants = Product & {
  variants: VariantWithAttributes[];

  images?: {
    id?: string;
    url: string;
    altText?: string | null;
    sortOrder?: number;
  }[];
};

// انتخاب Variant پیش‌فرض
function pickDefaultVariant(variants: VariantWithAttributes[]) {
  return variants.find((variant) => variant.isDefault) ?? variants[0];
}

// انتخاب تصویر اصلی محصول
function getProductImage(images?: { url: string }[]): string | null {
  if (!images || images.length === 0) {
    return null;
  }

  return images[0].url;
}

// تبدیل Variant به DTO
function toDefaultVariantDTO(
  variant: VariantWithAttributes,
  images?: { url: string }[],
): ProductDefaultVariantDTO {
  return {
    id: variant.id,

    price: variant.price.toNumber(),

    compareAtPrice: variant.compareAtPrice
      ? variant.compareAtPrice?.toNumber()
      : null,

    sku: variant.sku,

    inventory: variant.stock,

    imageUrl: getProductImage(images),
  };
}

// Variant Detail DTO
export function toVariantResponseDTO(
  variant: VariantWithAttributes,
): VariantResponseDTO {
  return {
    id: variant.id,

    sku: variant.sku,

    price: variant.price.toString(),

    compareAtPrice: variant.compareAtPrice?.toString() ?? null,

    stock: variant.stock,

    isDefault: variant.isDefault,

    isActive: variant.isActive,

    attributes: variant.attributeValues.map((item) => ({
      attributeName: item.attributeValue.attribute.name,

      valueId: item.attributeValue.id,

      value: item.attributeValue.value,
    })),
  };
}
// Product List DTO
export function toProductListItemDTO(
  product: ProductWithVariants,
): ProductListItemDTO {
  const defaultVariant = pickDefaultVariant(product.variants);

  const imageUrl = getProductImage(product.images);

  console.log("PRODUCT MAPPER:", {
    name: product.name,
    imageUrl,
    images: product.images,
  });

  return {
    id: product.id,

    name: product.name,

    slug: product.slug,

    description: product.description,

    categoryId: product.categoryId,

    brandId: product.brandId,

    isActive: product.isActive,

    isPublished: product.isPublished,

    createdAt: product.createdAt,

    updatedAt: product.updatedAt,

    imageUrl,

    defaultVariant: defaultVariant
      ? toDefaultVariantDTO(defaultVariant, product.images)
      : null,

    items: [],
  };
}

// Product Detail DTO

export function toProductDetailDTO(
  product: ProductWithVariants,
): ProductDetailDTO {
  const defaultVariant = pickDefaultVariant(product.variants);

  return {
    id: product.id,
    name: product.name,
    slug: product.slug,

    categoryId: product.categoryId,
    brandId: product.brandId,

    description: product.description,

    isPublished: product.isPublished,

    imageUrl: getProductImage(product.images),

    variants: product.variants.map(toVariantResponseDTO),

    defaultVariant: defaultVariant
      ? toVariantResponseDTO(defaultVariant)
      : null,
  };
}

// Admin Table DTO
export function toProductTableRow(
  product: AdminProductListItem,
): ProductTableRow {
  return {
    id: product.id,

    name: product.name,

    slug: product.slug,

    price: product.price,

    stock: product.stock,

    isActive: product.isActive,

    isPublished: product.isPublished,

    createdAt: product.createdAt,

    categoryName: product.categoryName,
  };
}

import type { ProductEditDTO } from "../types/product-edit.dto";
import { ProductFindByIdPayload } from "../prisma/product.payload";
import { BusinessError } from "@/server/errors/business-error";
import { ErrorCodes } from "@/server/errors/error-codes";

type ProductEditMapperInput = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  categoryId: string;
  brandId: string | null;
  isPublished: boolean;
  isActive: boolean;

  variants: Array<{
    id: string;
    sku: string;
    price: {
      toNumber(): number;
    };
    compareAtPrice: {
      toNumber(): number;
    } | null;
    stock: number;
    isDefault: boolean;
  }>;

  images: Array<{
    id: string;
    url: string;
    altText: string | null;
    sortOrder: number;
  }>;
};

export function toProductEditDTO(
  product: ProductFindByIdPayload,
): ProductEditDTO {
  const defaultVariant =
    product.variants.find((variant) => variant.isDefault) ??
    product.variants[0];
  if (!defaultVariant) {
    throw new BusinessError(
      "محصول باید حداقل یک Variant داشته باشد",
      ErrorCodes.PRODUCT_VARIANT_NOT_FOUND,
    );
  }
  return {
    id: product.id,
    name: product.name,
    slug: product.slug,
    description: product.description,
    categoryId: product.categoryId,
    brandId: product.brandId,
    isPublished: product.isPublished,
    isActive: product.isActive,
    defaultVariant: {
      id: defaultVariant.id,
      sku: defaultVariant.sku,
      price: defaultVariant.price.toNumber(),
      compareAtPrice: defaultVariant.compareAtPrice?.toNumber() ?? null,
      stock: defaultVariant.stock,
    },
    images: product.images.map((image) => ({
      id: image.id,
      url: image.url,
      altText: image.altText,
      sortOrder: image.sortOrder,
    })),
  };
}
