export interface IAdOrder {
  id?: string;
  amount: number;
  idAdvertising: string;
  idUser?: string;
  methodPay: string;
  quantity: number;
  status?: string;
}
