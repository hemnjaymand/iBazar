"use server";

import { z } from "zod";
import { searchProductsFulltextService } from "@/features/catalog/services/search-products-fulltext.service";
import { ok, fail } from "@/shared/types/result";

const searchSchema = z.object({ query: z.string().min(1).max(200) });

export async function getSearchSuggestionsAction(input: unknown) {
  const parsed = searchSchema.safeParse(input);
  if (!parsed.success) return fail("VALIDATION_ERROR", "عبارت جست‌وجو نامعتبر است");

  try {
    // برای پیشنهادها فقط ۵ نتیجه‌ی اول کافی‌ست، نه لیست کامل صفحه‌ی نتایج
    const results = await searchProductsFulltextService(parsed.data.query);
    return ok(results.slice(0, 5));
  } catch {
    return fail("INTERNAL_ERROR", "خطا در جست‌وجو");
  }
}
