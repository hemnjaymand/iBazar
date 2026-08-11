import { prisma } from "../../../../lib/prisma";


export const variantAttributeRepository = {
  replaceForVariant(variantId: string, attributeValueIds: string[]) {
    return prisma.$transaction([
      prisma.variantAttributeValue.deleteMany({ where: { variantId } }),
      prisma.variantAttributeValue.createMany({
        data: attributeValueIds.map((attributeValueId) => ({
          variantId,
          attributeValueId,
        })),
      }),
    ]);
  },
};
