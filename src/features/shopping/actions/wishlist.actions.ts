"use server";

import { addToWishlistSchema, removeFromWishlistSchema } from "../schemas/wishlist.schema";
import { addToWishlistService } from "../services/add-to-wishlist.service";
import { removeFromWishlistService } from "../services/remove-from-wishlist.service";
import { getWishlistService } from "../services/get-wishlist.service";
import { ok, fail } from "@/shared/types/result";
import { ApplicationError } from "@/server/errors/application-error";
import { requireUser } from "@/server/auth/guards";

export async function getWishlistAction() {
  try {
    const user = await requireUser();
    const items = await getWishlistService(user.id);
    return ok(items);
  } catch (error) {
    if (error instanceof ApplicationError) return fail(error.code, error.message);
    return fail("INTERNAL_ERROR", "خطای غیرمنتظره");
  }
}

export async function addToWishlistAction(input: unknown) {
  const parsed = addToWishlistSchema.safeParse(input);
  if (!parsed.success) return fail("VALIDATION_ERROR", "اطلاعات نامعتبر است");

  try {
    const user = await requireUser();
    await addToWishlistService(parsed.data, user.id);
    return ok(true);
  } catch (error) {
    if (error instanceof ApplicationError) return fail(error.code, error.message);
    return fail("INTERNAL_ERROR", "خطای غیرمنتظره");
  }
}

export async function removeFromWishlistAction(input: unknown) {
  const parsed = removeFromWishlistSchema.safeParse(input);
  if (!parsed.success) return fail("VALIDATION_ERROR", "اطلاعات نامعتبر است");

  try {
    const user = await requireUser();
    await removeFromWishlistService(parsed.data, user.id);
    return ok(true);
  } catch (error) {
    if (error instanceof ApplicationError) return fail(error.code, error.message);
    return fail("INTERNAL_ERROR", "خطای غیرمنتظره");
  }
}
