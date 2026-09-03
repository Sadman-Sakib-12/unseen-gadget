import { createEmailClient, type SendMailOptions } from "@unseen-gadget/email";
import { env } from "../config/env";

export * from "@unseen-gadget/email";

const emailClient = createEmailClient({
  host: env.SMTP_HOST,
  port: env.SMTP_PORT,
  user: env.SMTP_USER,
  pass: env.SMTP_PASS,
  from: env.SMTP_USER || "noreply@unseengadget.com",
});

export interface SendMailArgs {
  to: string;
  subject: string;
  text: string;
  html?: string;
}

export async function sendMail(args: SendMailArgs): Promise<void> {
  await emailClient.send(args as SendMailOptions);
}

export const EmailService = { send: sendMail, client: emailClient };

export default EmailService;