// server/email/resend-email-gateway.ts
import { Resend } from "resend";
import { EmailGateway } from "./email-gateway";


const resend = new Resend(process.env.RESEND_API_KEY);

export const resendEmailGateway: EmailGateway = {
  async send({ to, subject, html }) {
    const result = await resend.emails.send({
      from: "store@yourdomain.com",
      to,
      subject,
      html,
    });
    return { success: !result.error };
  },
};