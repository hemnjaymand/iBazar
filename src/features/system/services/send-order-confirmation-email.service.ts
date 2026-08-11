// features/system/services/send-order-confirmation-email.service.ts
import { resendEmailGateway } from "@/server/email/resend-email-gateway";
import { logger } from "@/server/logger/logger";

export async function sendOrderConfirmationEmailService(to: string, orderNumber: string, total: string) {
  const result = await resendEmailGateway.send({
    to,
    subject: `سفارش شما ثبت شد — ${orderNumber}`,
    html: `<p>سفارش شما با شماره‌ی ${orderNumber} به مبلغ ${total} ثبت شد.</p>`,
  });
  if (!result.success) {
    logger.error({ orderNumber }, "failed to send order confirmation email");
  }
}