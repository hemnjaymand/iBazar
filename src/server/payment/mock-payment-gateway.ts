// server/payment/mock-payment-gateway.ts
// پیاده‌سازی موقت تا درگاه واقعی انتخاب بشه — کل بقیه‌ی کد به این وابسته نیست
import type { PaymentGateway } from "./payment-gateway";

export const mockPaymentGateway: PaymentGateway = {
  async createPayment({ amount, orderId }) {
    return { success: true, transactionId: `mock_${orderId}`, redirectUrl: `/orders/${orderId}/confirmation` };
  },
  async verifyPayment({ transactionId }) {
    return { success: true, transactionId };
  },
};