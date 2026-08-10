export interface Promotion {
  id: string;
  name: string;
  type: string;
  discountType: string;
  discountValue: number;
  applicableTo: string;
  startDate: string;
  endDate: string;
  status: string;
  description: string;
}
