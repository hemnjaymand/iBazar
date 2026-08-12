// features/catalog/services/publish-product.service.ts

import { BusinessError } from "@/server/errors/business-error";
import { ErrorCodes } from "@/server/errors/error-codes";
import { prisma } from "../../../../lib/prisma";

export async function publishProductService(productId: string) {
  const product = await prisma.product.findUnique({
    where: { id: productId },
    include: { variants: true },
  });

  if (!product) {
    throw new BusinessError(
      "محصول یافت نشد",
      ErrorCodes.PRODUCT_NOT_FOUND,
    );
  }

  const hasSellableVariant = product.variants.some(
    (v) => v.isActive && v.price.toNumber() > 0,
  );

  if (!hasSellableVariant) {
    throw new BusinessError(
      "محصول باید حداقل یک Variant قابل‌فروش داشته باشد",
      ErrorCodes.PRODUCT_NOT_SELLABLE,
    );
  }

  return prisma.product.update({
    where: { id: productId },
    data: {
      isPublished: true,
    },
  });
}