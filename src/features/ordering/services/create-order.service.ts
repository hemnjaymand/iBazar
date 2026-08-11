// features/ordering/services/create-order.service.ts
import { couponRepository } from "../../discount/repositories/coupon.repository";
import { validateCouponService } from "../../discount/service/validate-coupon.service";
import {
  getCartForCheckoutService,
  clearCartService,
} from "@/features/shopping";
import { decreaseStockForSaleService } from "@/features/inventory";
import { mockPaymentGateway } from "@/server/payment/mock-payment-gateway"; // در فاز واقعی با درگاه اصلی جایگزین می‌شود
import { BusinessError } from "@/server/errors/business-error";
import { ErrorCodes } from "@/server/errors/error-codes";
import type { CreateOrderInput } from "../schemas/create-order.schema";
import { toOrderDTO } from "../mappers/order.mapper";
import { prisma } from "../../../../lib/prisma";

function generateOrderNumber() {
  return `ORD-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;
}

export async function createOrderService(
  input: CreateOrderInput,
  identity: { userId?: string; sessionToken?: string },
) {
  const cart = await getCartForCheckoutService(identity);
  if (!cart || cart.items.length === 0) {
    throw new BusinessError("سبد خرید خالی است", ErrorCodes.CART_EMPTY);
  }

  const subtotal = parseFloat(cart.subtotal);
  let discountTotal = 0;
  let couponId: string | undefined;

  if (input.couponCode) {
    const { coupon, discount } = await validateCouponService(
      input.couponCode,
      subtotal,
    );
    discountTotal = discount;
    couponId = coupon.id;
  }

  const shippingCost = 0; // آماده برای اضافه کردن لاجیک حمل و نقل
  const total = subtotal - discountTotal + shippingCost;

  // اجرای تراکنش یکپارچه دیتابیس
  const order = await prisma.$transaction(async (tx) => {
    // ۱. ثبت سفارش
    const created = await tx.order.create({
      data: {
        orderNumber: generateOrderNumber(),
        userId: identity.userId,
        guestEmail: input.guestEmail,
        subtotal,
        discountTotal,
        shippingCost,
        total,
        couponId,
        shippingAddress: input.shippingAddress,
        items: {
          create: cart.items.map((item) => ({
            variantId: item.variantId,
            productName: item.productName,
            sku: item.sku,
            unitPrice: item.priceAtAdd,
            quantity: item.quantity,
          })),
        },
      },
      include: { items: true },
    });

    // ۲. کسر موجودی انبار
    for (const item of cart.items) {
      await decreaseStockForSaleService(
        item.variantId,
        item.quantity,
        created.id,
      );
    }

    // ۳. افزایش تعداد استفاده از کد تخفیف
    if (couponId) {
      await tx.coupon.update({
        where: { id: couponId },
        data: { usedCount: { increment: 1 } },
      });
    }

    return created;
  });

  // ۴. پاکسازی سبد خرید
  await clearCartService(identity);

  // ۵. اتصال به درگاه پرداخت
  const payment = await mockPaymentGateway.createPayment({
    amount: total,
    orderId: order.id,
  });
  if (!payment.success) {
    throw new BusinessError(
      "ارتباط با درگاه پرداخت ناموفق بود",
      ErrorCodes.PAYMENT_FAILED,
    );
  }

  return { order: toOrderDTO(order), redirectUrl: payment.redirectUrl };
}
