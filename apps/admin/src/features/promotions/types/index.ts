export interface Promotion {
  id: string;
  name: string;
  title?: string;
  badge?: string;
  description?: string;
  type: string;
  discountType: string;
  discountValue: number;
  applicableTo: string;
  startDate?: string | null;
  endDate?: string | null;
  status: string;
  ctaLabel?: string;
  ctaHref?: string;
  icon?: string;
  gradient?: string;
  sortOrder?: number;
  active?: boolean;
  createdAt?: string;
  updatedAt?: string;
}
