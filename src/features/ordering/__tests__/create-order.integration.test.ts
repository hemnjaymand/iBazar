// features/ordering/__tests__/create-order.integration.test.ts
import { describe, it, expect, beforeEach } from "vitest";
import { createOrderService } from "../services/create-order.service";
import type { CreateOrderInput } from "../schemas/create-order.schema";
import { prisma } from "../../../../lib/prisma";

describe("createOrderService (integration)", () => {
  beforeEach(async () => {
    // ترتیب پاک‌سازی بر اساس وابستگی روابط (Foreign Keys)
    await prisma.$transaction([
      prisma.orderItem.deleteMany(),
      prisma.order.deleteMany(),
      prisma.cartItem.deleteMany(),
      prisma.cart.deleteMany(),
      prisma.variantAttributeValue.deleteMany(),
      prisma.variant.deleteMany(),
      prisma.productImage.deleteMany(),
      prisma.product.deleteMany(),
      prisma.category.deleteMany(),
      prisma.user.deleteMany(),
    ]);
  });

  it("rolls back the entire order if stock decrement fails mid-transaction", async () => {
    // ۱. ساخت کاربر نمونه
    const user = await prisma.user.create({
      data: {
        id: "test-user-1",
        email: "test@example.com",
        name: "کاربر تست",
        passwordHash: "mock_hashed_password_123",
      },
    });

    // ۲. ساخت دسته‌بندی و محصول نمونه
    const category = await prisma.category.create({
      data: { name: "دسته تست", slug: "test-category" },
    });

    const product = await prisma.product.create({
      data: {
        name: "محصول تست",
        slug: "test-product",
        categoryId: category.id,
        isPublished: true,
      },
    });

    // ۳. ساخت Variant با موجودی ۱ عدد
    const variant = await prisma.variant.create({
      data: {
        productId: product.id,
        sku: "TEST-SKU-1",
        price: 100000,
        stock: 1, // موجودی محدود
      },
    });

    // ۴. ساخت سبد خرید با تعداد ۲ عدد (بیشتر از موجودی دیتابیس)
    await prisma.cart.create({
      data: {
        userId: user.id,
        items: {
          create: {
            variantId: variant.id,
            // ✅ فقط فیلدهای مجاز در CartItem
            quantity: 2, // درخواست بیشتر از موجودی
            priceAtAdd: variant.price, // قیمت لحظه‌ی افزودن
          },
        },
      },
    });

    // ۵. داده ورودی استاندارد فرم (Type-Safe)
    const orderInput: CreateOrderInput = {
      shippingAddress: {
        fullName: "علی محمدی",
        phone: "09123456789",
        addressLine: "تهران، خیابان آزادی، پلاک ۱",
        city: "تهران",
        postalCode: "1234567890",
      },
    };

    // Act & Assert: فراخوانی سرویس باید به دلیل عدم موجودی شکست بخورد
    await expect(
      createOrderService(orderInput, { userId: user.id })
    ).rejects.toThrow();

    // بررسی اینکه به دلیل Rollback شدن تراکنش، هیچ Order یا OrderItem یتیمی ثبت نشده باشد
    const orderCount = await prisma.order.count();
    const orderItemCount = await prisma.orderItem.count();

    expect(orderCount).toBe(0);
    expect(orderItemCount).toBe(0);

    // بررسی اینکه موجودی واریانت تغییری نکرده است (Rollback)
    const updatedVariant = await prisma.variant.findUnique({
      where: { id: variant.id },
    });
    expect(updatedVariant?.stock).toBe(1);
  });
});