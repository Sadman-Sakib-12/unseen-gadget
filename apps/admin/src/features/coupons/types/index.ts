export interface Coupon {
  id: string;
  code: string;
  discountType: string;
  discountValue: number;
  minimumOrder: number;
  maximumDiscount: number;
  usageLimit: number;
  usedCount: number;
  expiryDate: string;
  status: string;
}
