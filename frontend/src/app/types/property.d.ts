import { IAddress } from "./address";
import { IAmenity } from "./amenity";
import { IHightlight } from "./highlight";

export interface IImage {
  id: string;
  image: string;
}

export interface IProperty {
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
}

export interface IPropertyCreate {
  categoryId?: string;
  city?: string;
  country?: string;
  description?: string;
  district?: string;
  street?: string;
  name?: string;
  amenities?: string[];
  highlights?: string[];
  images?: {id?: string, image?: string}[];
} 
