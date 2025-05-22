import { IAddress } from "./address";
import { IAmenity } from "./amenity";
import { IHightlight } from "./highlight";

export interface IImage {
  id: string;
  image: string;
}

export interface IProperty {
  id: string;
  title: string;
  price: number;
  images: { id: string; image: string }[]; // Cập nhật kiểu dữ liệu của images
  location: string;
  quantityReview: string;
  name: string;
  rating: string;
  city: { id: string; name: string };
  slug: string;
  reviewCount: number;
  averageRating: number;
  description: Text;
  propertyAddress: IAddress;
  hightlight: IHightlight[];
  amenities: IAmenity[];
  idCategory: string;
  propertyAddress: IAddress;
  advertising: string;
  expiredAd: string;
  idUser: string;
  user: IUser;
  status: string;
}

export interface IPropertyTop10Commission {
  name: string;
  propertyAddress: IAddress;
  id: string;
  totalCommission: number;
  totalOrder: number;
  images: { id: string; image: string }[];
  status: string;
}

export interface IPropertyCreate {
  categoryId?: string;
  userId?: string;
  city?: string;
  country?: string;
  description?: string;
  district?: string;
  street?: string;
  name?: string;
  amenities?: string[];
  highlights?: string[];
  images?: { id?: string; image?: string }[];
}

export interface IPropertyAdmin {
  id: string;
  name: string;
  category: ICategory;
  city: ICity;
  users: IUser;
  propertyAddress: IAddress;
  status: string;
  approved: number;
  reject: number;
  images: IImage[];
}
