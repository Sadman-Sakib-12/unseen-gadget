export interface GeneralSettings {
  storeName: string;
  storeEmail: string;
  storePhone: string;
  storeAddress: string;
  currency: string;
  timezone: string;
  language: string;
  logo: string | null;
  favicon: string | null;
}

export interface OrderSettings {
  autoConfirmOrders: boolean;
  allowCancellation: boolean;
  cancellationWindowHours: number;
  requireShippingAddress: boolean;
  minimumOrderAmount: number;
  orderPrefix: string;
}

export interface PaymentSettings {
  acceptCashOnDelivery: boolean;
  acceptCardPayments: boolean;
  acceptBankTransfer: boolean;
  acceptMobileBanking: boolean;
  bkashNumber?: string;
  nagadNumber?: string;
  rocketNumber?: string;
  mobileBankingInstructions?: string;
  currency: string;
  taxRate: number;
  taxIncluded: boolean;
}

export interface EmailSettings {
  smtpHost: string;
  smtpPort: number;
  smtpUser: string;
  smtpPassword: string;
  senderEmail: string;
  senderName: string;
  sendOrderConfirmation: boolean;
  sendShippingUpdate: boolean;
  sendMarketingEmails: boolean;
}

export interface ShippingSettings {
  freeShippingThreshold: number;
  defaultShippingCost: number;
  expressShippingCost: number;
  shippingZones: { name: string; cost: number }[];
  estimatedDeliveryDays: { standard: number; express: number };
}

export interface Settings {
  general: GeneralSettings;
  order: OrderSettings;
  payment: PaymentSettings;
  email: EmailSettings;
  shipping: ShippingSettings;
}
