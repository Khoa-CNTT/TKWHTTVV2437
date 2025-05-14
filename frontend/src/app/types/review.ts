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

export interface IReviewPost {
  idUser: string;
  idProperty: string;
  rating: number;
  text: string;
}

export interface IReviewUpdate {
  id: string;
  rating: number;
  text: string;
}
