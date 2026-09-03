import nodemailer, { type Transporter } from "nodemailer";
import type { EmailConfig, SendMailOptions } from "./types";

export class EmailClient {
  private transporter: Transporter | null = null;
  private config: EmailConfig;

  constructor(config: EmailConfig = {}) {
    this.config = config;
    if (config.host) {
      const isGmail = config.host.toLowerCase().includes("gmail");
      this.transporter = isGmail
        ? nodemailer.createTransport({
            service: "gmail",
            auth: config.user ? { user: config.user, pass: config.pass } : undefined,
          })
        : nodemailer.createTransport({
            host: config.host,
            port: config.port ?? 587,
            secure: (config.port ?? 587) === 465,
            auth: config.user ? { user: config.user, pass: config.pass } : undefined,
            tls: { rejectUnauthorized: false },
          });
    }
  }

  public async send(options: SendMailOptions): Promise<boolean> {
    if (!this.transporter) {
      console.log(`[Email:DevMode] To: ${options.to} | Subject: "${options.subject}"`);
      console.log(options.text);
      return true;
    }

    try {
      const defaultFrom = this.config.user
        ? `"Unseen Gadget" <${this.config.user}>`
        : "noreply@unseengadget.com";

      const info = await this.transporter.sendMail({
        from: options.from || defaultFrom,
        to: options.to,
        subject: options.subject,
        text: options.text,
        html: options.html,
      });
      console.log(`[EmailClient] Sent successfully to ${options.to}, messageId: ${info.messageId}`);
      return true;
    } catch (error) {
      console.error("[EmailClient] Send error:", error);
      return false;
    }
  }
}

export function createEmailClient(config?: EmailConfig): EmailClient {
  return new EmailClient(config);
}
