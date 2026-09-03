export interface EmailConfig {
  host?: string;
  port?: number;
  user?: string;
  pass?: string;
  from?: string;
}

export interface SendMailOptions {
  to: string;
  subject: string;
  text: string;
  html?: string;
  from?: string;
}

export interface EmailTemplateResult {
  subject: string;
  text: string;
  html: string;
}

export interface OrderItemSummary {
  name: string;
  quantity: number;
  price: number;
}
