export interface IReservation {
  id: string;
  loaiphong: string;
  firstName: string;
  lastName: string;
  checkIn: Dayjs;
  checkOut: Dayjs;
  totalPrice: number;
  status: string;
  ngayDat: Dayjs;
  email: string;
  phone: string;
  deposit: number;
  createdAt: Dayjs;
  imageBanking: string | null;
}
