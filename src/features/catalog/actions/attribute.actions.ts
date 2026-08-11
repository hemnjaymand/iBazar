"use server";
import { prisma } from "../../../../lib/prisma";

import { createAttributeSchema } from "../schemas/attribute.schema";
import { assignVariantAttributesSchema } from "../schemas/variant-attribute.schema";
import { createAttributeService } from "../services/create-attribute.service";
import { assignVariantAttributesService } from "../services/assign-variant-attributes.service";
import { ok, fail } from "@/shared/types/result";
import { ApplicationError } from "@/server/errors/application-error";
import { requireAdmin } from "@/server/auth/guards";

export async function createAttributeAction(input: unknown) {
  await requireAdmin();
  const parsed = createAttributeSchema.safeParse(input);
  if (!parsed.success) return fail("VALIDATION_ERROR", "اطلاعات نامعتبر است");

  try {
    const attribute = await createAttributeService(parsed.data);
    return ok(attribute);
  } catch (error) {
    if (error instanceof ApplicationError)
      return fail(error.code, error.message);
    return fail("INTERNAL_ERROR", "خطای غیرمنتظره");
  }
}

export async function deleteAttributeAction(id: string) {
  await requireAdmin();

  try {
    await prisma.attribute.delete({ where: { id } });
    return ok(true);
  } catch (error) {
    if (error instanceof ApplicationError)
      return fail(error.code, error.message);
    return fail("INTERNAL_ERROR", "خطای غیرمنتظره");
  }
}

export async function assignVariantAttributesAction(input: unknown) {
  await requireAdmin();
  const parsed = assignVariantAttributesSchema.safeParse(input);
  if (!parsed.success) return fail("VALIDATION_ERROR", "اطلاعات نامعتبر است");

  try {
    await assignVariantAttributesService(
      parsed.data.variantId,
      parsed.data.attributeValueIds,
    );
    return ok(true);
  } catch (error) {
    if (error instanceof ApplicationError)
      return fail(error.code, error.message);
    return fail("INTERNAL_ERROR", "خطای غیرمنتظره");
  }
}
