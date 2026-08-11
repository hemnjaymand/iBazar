"use server";

import { revalidatePath } from "next/cache"; // ✅ تغییر import
import { z } from "zod";
import { upsertPageSchema } from "../schemas/page.schema";
import { upsertPageService } from "../services/upsert-page.service";
import { pageRepository } from "../repositories/page.repository";
import { ok, fail } from "@/shared/types/result";
import { ApplicationError } from "@/server/errors/application-error";
import { requireAdmin } from "@/server/auth/guards";

export async function upsertPageAction(input: unknown) {
  await requireAdmin();
  const parsed = upsertPageSchema.safeParse(input);
  if (!parsed.success) return fail("VALIDATION_ERROR", "اطلاعات نامعتبر است");

  try {
    const page = await upsertPageService(parsed.data);
    revalidatePath("/admin/pages"); // بازنویسی لیست صفحات
    revalidatePath(`/pages/${page.slug}`); // بازنویسی صفحه‌ی خاص
    return ok(page);
  } catch (error) {
    if (error instanceof ApplicationError) return fail(error.code, error.message);
    console.error("Upsert page error:", error);
    return fail("INTERNAL_ERROR", "خطای غیرمنتظره در ذخیره صفحه");
  }
}

export async function deletePageAction(slug: string) {
  await requireAdmin();

  const slugValidation = z.string().min(1).safeParse(slug);
  if (!slugValidation.success) {
    return fail("VALIDATION_ERROR", "شناسه صفحه نامعتبر است");
  }

  try {
    const existing = await pageRepository.findBySlug(slug);
    if (!existing) {
      return fail("NOT_FOUND", "صفحه مورد نظر یافت نشد");
    }

    await pageRepository.delete(slug);
    revalidatePath("/admin/pages");
    revalidatePath(`/pages/${slug}`);
    return ok(true);
  } catch (error) {
    if (error instanceof ApplicationError) return fail(error.code, error.message);
    console.error("Delete page error:", error);
    return fail("INTERNAL_ERROR", "خطای غیرمنتظره در حذف صفحه");
  }
}