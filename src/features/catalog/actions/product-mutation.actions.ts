"use server";

import { revalidateTag } from "next/cache";

import {
  toggleProductPublishSchema,
} from "../schemas/product.schema";

import { updateProductService } from "../services/update-product.service";
import { deleteProductService } from "../services/delete-product.service";

import { ok, fail } from "@/shared/types/result";
import { ApplicationError } from "@/server/errors/application-error";
import { requireAdmin } from "@/server/auth/guards";
import { CacheTags } from "@/config/cache";

export async function toggleProductPublishAction(
  input: unknown,
) {
  await requireAdmin();

  const parsed =
    toggleProductPublishSchema.safeParse(input);

  if (!parsed.success) {
    return fail(
      "VALIDATION_ERROR",
      "اطلاعات نامعتبر است",
    );
  }

  try {
    const { id, isPublished } = parsed.data;

    await updateProductService(id, {
      isPublished,
    });

    revalidateTag(
      CacheTags.PRODUCTS,
      "default",
    );

    return ok(true);
  } catch (error) {
    if (error instanceof ApplicationError) {
      return fail(
        error.code,
        error.message,
      );
    }

    return fail(
      "INTERNAL_ERROR",
      "خطای غیرمنتظره",
    );
  }
}

export async function deleteProductAction(
  id: string,
) {
  await requireAdmin();

  try {
    const product =
      await deleteProductService(id);

    revalidateTag(
      CacheTags.PRODUCTS,
      "default",
    );

    return ok(product);
  } catch (error) {
    if (error instanceof ApplicationError) {
      return fail(
        error.code,
        error.message,
      );
    }

    return fail(
      "INTERNAL_ERROR",
      "خطای غیرمنتظره",
    );
  }
}