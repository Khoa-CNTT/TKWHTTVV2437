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
}
