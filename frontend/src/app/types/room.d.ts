export interface IImage {
  id: string;
  image: string;
}

export interface IRoom {
  title: string;
  price: number;
  images: { id: string; image: string }[]; // Cập nhật kiểu dữ liệu của images
  location: string;
  quantityReview: string;
  name: string;
  rating: string;
  property: { city: { name: string }; name: string };
  slug: string;
  reviewCount: number;
  averageRating: number;
}
