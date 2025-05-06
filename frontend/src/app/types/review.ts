export interface IReview {
  id: string;
  rating: number;
  text: string;
  createdAt: string;
  user: {
    id: string;
    lastName: string;
    firstName: string;
    avatar: string;
  };
}
