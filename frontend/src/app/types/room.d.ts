import { IAmenity } from "./amenity";

export interface IRoom {
  id: string;
  name: string;
  price: number;
  maxPerson: number;
  status: string;
  description: string;
  price: number;
  code: string;
  quantity: number;
  amenities: IAmenity[];
  images: { id: string; image: string }[];
}

export interface IRoomCreate {
  propertyId?: string;
  name?: string;
  maxPerson?: number;
  code?: string;
  quantity?: number;
  status?: string;
  amenities?: string[];
  summaries?: string[];
  images?: {id: string, image: string}[];
}
