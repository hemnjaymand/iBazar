import { Prisma } from "@prisma/client/client";
import { variantInclude } from "./product.include";

export type ProductFindByIdPayload = Prisma.ProductGetPayload<{
  include: {
    images: true;
    variants: {
      include: typeof variantInclude;
    };
    category: {
      select: {
        id: true;
        name: true;
      };
    };
    brand: {
      select: {
        id: true;
        name: true;
      };
    };
  };
}>;
