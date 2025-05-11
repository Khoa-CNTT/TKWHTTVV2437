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

export interface ICommissionPaymentAdmin {
  id: string;
  status: string;
  createdAt: string;
  property: {
    name: string;
  };
  user: {
    firstName: string;
    lastName: string;
  };
  commissionAmount: number;
  commissionRate: number;
  totalRevenue: number;
  paymentDate: string;
  methodPay: string;
  month: number;
  year: number;
}
