"use server";

import { z } from "zod";
import { updateAttributeService } from "../services/update-attribute.service";
import { addAttributeValueService } from "../services/add-attribute-value.service";
import { deleteAttributeService } from "../services/delete-attribute.service";
import { ok, fail } from "@/shared/types/result";
import { ApplicationError } from "@/server/errors/application-error";
import { requireAdmin } from "@/server/auth/guards";

const updateAttributeSchema = z.object({
  id: z.string().cuid(),
  name: z.string().min(2).max(60),
});

const addAttributeValueSchema = z.object({
  attributeId: z.string().cuid(),
  value: z.string().min(1).max(60),
  slug: z.string().min(1).max(60).regex(/^[a-z0-9-]+$/),
});

export async function updateAttributeAction(input: unknown) {
  await requireAdmin();
  const parsed = updateAttributeSchema.safeParse(input);
  if (!parsed.success) return fail("VALIDATION_ERROR", "اطلاعات نامعتبر است");

  try {
    const attribute = await updateAttributeService(parsed.data.id, parsed.data.name);
    return ok(attribute);
  } catch (error) {
    if (error instanceof ApplicationError) return fail(error.code, error.message);
    return fail("INTERNAL_ERROR", "خطای غیرمنتظره");
  }
}

export async function addAttributeValueAction(input: unknown) {
  await requireAdmin();
  const parsed = addAttributeValueSchema.safeParse(input);
  if (!parsed.success) return fail("VALIDATION_ERROR", "اطلاعات نامعتبر است");

  try {
    const value = await addAttributeValueService(parsed.data.attributeId, parsed.data.value, parsed.data.slug);
    return ok(value);
  } catch (error) {
    if (error instanceof ApplicationError) return fail(error.code, error.message);
    return fail("INTERNAL_ERROR", "خطای غیرمنتظره");
  }
}

export async function deleteAttributeAction(id: string) {
  await requireAdmin();
  try {
    await deleteAttributeService(id);
    return ok(true);
  } catch (error) {
    if (error instanceof ApplicationError) return fail(error.code, error.message);
    return fail("INTERNAL_ERROR", "خطای غیرمنتظره");
  }
}