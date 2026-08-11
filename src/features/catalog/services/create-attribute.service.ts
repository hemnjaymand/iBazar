import { attributeRepository } from "../repositories/attribute.repository";

import { BusinessError } from "@/server/errors/business-error";
import { ErrorCodes } from "@/server/errors/error-codes";
import type { CreateAttributeInput } from "../schemas/attribute.schema";
import { prisma } from "../../../../lib/prisma";

export async function createAttributeService(input: CreateAttributeInput) {
  const existing = await prisma.attribute.findUnique({
    where: { slug: input.slug },
  });
  if (existing) {
    throw new BusinessError(
      "این Attribute قبلاً وجود دارد",
      ErrorCodes.ATTRIBUTE_ALREADY_EXISTS,
    );
  }
  return attributeRepository.createWithValues(input);
}
