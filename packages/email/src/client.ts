import nodemailer, { type Transporter } from "nodemailer";
import type { EmailConfig, SendMailOptions } from "./types";

export class EmailClient {
  private transporter: Transporter | null = null;
  private config: EmailConfig;

  constructor(config: EmailConfig = {}) {
    this.config = config;
    if (config.host || config.user) {
      const host = config.host || "smtp.gmail.com";
      const port = Number(config.port) || 587;
      const isSecure = port === 465;

      this.transporter = nodemailer.createTransport({
        host,
        port,
        secure: isSecure,
        family: 4, // Force IPv4 to avoid cloud container IPv6 DNS timeout hangs
        auth: config.user && config.pass ? { user: config.user, pass: config.pass } : undefined,
        tls: {
          rejectUnauthorized: false,
        },
        connectionTimeout: 10000,
        greetingTimeout: 10000,
        socketTimeout: 15000,
      } as any);
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
