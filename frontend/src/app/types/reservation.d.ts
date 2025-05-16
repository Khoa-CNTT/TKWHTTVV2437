export interface IReservation {
  id: string;
  nameRoom: string;
  firstName: string;
  lastName: string;
  message: string | null;
  checkIn: Dayjs;
  checkOut: Dayjs;
  totalPrice: number;
  status: string;
  email: string;
  phone: string;
  createdAt: Dayjs;
  imageBanking: string | null;
  numberAccount: string;
  nameAccount: string;
  nameBank: string;
  statusUser: string;
  code: string;
  returnImgBanking?: string | null;
  reason?: string | null;
}

export interface IReservationObject {
  id: string;
  idUser: string;
  idRoom: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  imageBanking: string | null;
  message: string | null;
  numberAccount: string;
  nameAccount: string;
  nameBank: string;
  statusUser: string;
  code: string;
  returnImgBanking: string | null;
  checkIndate: string; // ISO date string
  checkOutdate: string; // ISO date string
  numGuest: number | null;
  totalPrice: number;
  status: string;
  createdAt: string;
  updatedAt: string;
  rooms: Room;
}

export interface Room {
  name: string;
  price: number;
  property: Property;
  images?: ImageRoom[];
}

export interface Property {
  id: string;
  address: string;
  name: string;
  propertyAddress: PropertyAddress;
  images?: PropertyImage[];
}

export interface PropertyAddress {
  street: string | null;
  city: string | null;
  district: string | null;
  ward: string | null;
  country: string | null;
}

export interface ImageRoom {
  id: string;
  image: string;
  idRoom: string;
}

export interface PropertyImage {
  id: string;
  image: string;
  idProperty: string;
}
