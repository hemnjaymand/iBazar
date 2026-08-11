// e2e/checkout-flow.spec.ts
import { test, expect } from "@playwright/test";

test("guest can complete checkout end to end", async ({ page }) => {
  await page.goto("/products/sample-product");
  await page.getByRole("button", { name: "افزودن به سبد" }).click();
  await page.getByRole("link", { name: "سبد خرید" }).click();
  await page.getByRole("link", { name: "ادامه‌ی خرید" }).click();

  await page.getByLabel("نام کامل").fill("علی محمدی");
  await page.getByLabel("شماره تماس").fill("09120000000");
  // ... تکمیل آدرس

  await page.getByRole("button", { name: "ثبت سفارش" }).click();
  await expect(page).toHaveURL(/\/orders\/.+\/confirmation/);
  await expect(page.getByText("سفارش شما ثبت شد")).toBeVisible();
});