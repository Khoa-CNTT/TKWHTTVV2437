export interface IAdOrder {
  id?: string;
  amount: number;
  idAdvertising: string;
  idUser?: string;
  methodPay: string;
  quantity: number;
  status?: string;
  idProperty: string;
}

export interface IAdOrderAdmin {
  amount: number;
  methodPay: string;
  status: string;
  id: string;
  createdAt: string;
  property: {
    name: string;
  };
  user: {
    firstName: string;
    lastName: string;
  };
  advertising: {
    name: string;
    price: number;
    type: number;
  };
}
