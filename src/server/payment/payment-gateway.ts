export interface PaymentResult {
  success: boolean;
  transactionId?: string;
  redirectUrl?: string;
}

export interface PaymentGateway {
  createPayment(params: { amount: number; orderId: string }): Promise<PaymentResult>;
  verifyPayment(params: { transactionId: string }): Promise<PaymentResult>;
}
