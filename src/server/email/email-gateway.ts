// server/email/email-gateway.ts
export interface EmailGateway {
  send(params: { to: string; subject: string; html: string }): Promise<{ success: boolean }>;
}