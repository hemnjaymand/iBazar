// features/shopping/actions/cart.actions.ts
"use server";

import { cookies } from "next/headers";
import { addToCartSchema, updateCartItemSchema } from "../schemas/cart.schema";
import { addToCartService } from "../services/add-to-cart.service";
import { cartRepository } from "../repositories/cart.repository";
import { toCartDTO } from "../mappers/cart.mapper";
import { ok, fail } from "@/shared/types/result";
import { ApplicationError } from "@/server/errors/application-error";
import { auth } from "@/server/auth";
import { randomUUID } from "crypto";

async function resolveIdentity() {
  const session = await auth();
  if (session?.user) return { userId: session.user.id };

  const cookieStore = await cookies();
  let token = cookieStore.get("guest_cart_token")?.value;
  if (!token) {
    token = randomUUID();
    cookieStore.set("guest_cart_token", token, {
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 30,
    });
  }
  return { sessionToken: token };
}

export async function getCartAction() {
  const identity = await resolveIdentity();
  const cart = identity.userId
    ? await cartRepository.findByUserId(identity.userId)
    : identity.sessionToken
      ? await cartRepository.findBySessionToken(identity.sessionToken)
      : null;

  return ok(
    cart
      ? toCartDTO(cart)
      : { id: "", items: [], subtotal: "0.00", itemCount: 0 },
  );
}

export async function addToCartAction(input: unknown) {
  const parsed = addToCartSchema.safeParse(input);
  if (!parsed.success) return fail("VALIDATION_ERROR", "اطلاعات نامعتبر است");

  try {
    const identity = await resolveIdentity();
    const cart = await addToCartService(parsed.data, identity);
    return ok(cart);
  } catch (error) {
    if (error instanceof ApplicationError)
      return fail(error.code, error.message);
    return fail("INTERNAL_ERROR", "خطای غیرمنتظره");
  }
}
