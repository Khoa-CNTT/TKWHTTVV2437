export interface ICommissionPayment {
  id: string;
  idUser: string;
  idPropertyId: string;
  month: number;
  year: number;
  totalRevenue: number;
  commissionAmount: number;
  commissionRate: number;
  status: string;
  paymentDate: string;
  methodPay: string;
  orderQuantity: number;
}
