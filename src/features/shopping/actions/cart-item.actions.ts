"use server";

import { cookies } from "next/headers";
import { z } from "zod";
import { updateCartItemService } from "../services/update-cart-item.service";
import { removeCartItemService } from "../services/remove-cart-item.service";
import { ok, fail } from "@/shared/types/result";
import { ApplicationError } from "@/server/errors/application-error";
import { auth } from "@/server/auth";
import { revalidatePath } from "next/cache";

const updateItemSchema = z.object({
  itemId: z.string().cuid(),
  quantity: z.coerce.number().int().min(1).max(99),
});

async function resolveIdentity() {
  const session = await auth();
  if (session?.user) return { userId: session.user.id };
  const cookieStore = await cookies();
  return { sessionToken: cookieStore.get("guest_cart_token")?.value };
}

export async function updateCartItemAction(input: unknown) {
  const parsed = updateItemSchema.safeParse(input);
  if (!parsed.success) return fail("VALIDATION_ERROR", "اطلاعات نامعتبر است");

  try {
    const identity = await resolveIdentity();
    const cart = await updateCartItemService(
      parsed.data.itemId,
      parsed.data.quantity,
      identity,
    );
    return ok(cart);
  } catch (error) {
    if (error instanceof ApplicationError)
      return fail(error.code, error.message);
    return fail("INTERNAL_ERROR", "خطای غیرمنتظره");
  }
}

export async function removeCartItemAction(itemId: string) {
  try {
    revalidatePath('/cart');
    const identity = await resolveIdentity();
    const cart = await removeCartItemService(itemId, identity);
    return ok(cart);
  } catch (error) {
    if (error instanceof ApplicationError)
      return fail(error.code, error.message);
    return fail("INTERNAL_ERROR", "خطای غیرمنتظره");
  }
}
