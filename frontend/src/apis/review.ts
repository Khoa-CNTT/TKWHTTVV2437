import { IReviewPost, IReviewUpdate } from "@/app/types/review";

const apisReview = {
  getReviewByProperty: async (propertyId: string) => {
    const response = await fetch(
      `${process.env.URL_SERVER_API}/review/rating-by-property/${propertyId}`,
      {
        method: "GET",
        cache: "no-store",
      }
    );

    return response.json();
  },
  getListReviewByPropertyId: async (
    propertyId: string,
    query?: Record<string, string | number>
  ) => {
    const queryString = new URLSearchParams(
      query as Record<string, string>
    ).toString();

    const response = await fetch(
      `${process.env.URL_SERVER_API}/review/list-review/${propertyId}?${queryString}`,
      {
        method: "GET",
        cache: "no-store",
      }
    );

    return response.json();
  },

  getReviewByUserId: async (query: Record<string, string | number>) => {
    // Tạo query string từ object query
    const queryString = new URLSearchParams(
      query as Record<string, string>
    ).toString();

    const response = await fetch(
      `${process.env.URL_SERVER_API}/review/review-by-user?${queryString}`,
      {
        method: "GET",
        cache: "no-store",
      }
    );

    return response.json();
  },

  createReview: async (data: IReviewPost) => {
    const response = await fetch(
      `${process.env.URL_SERVER_API}/review/create-review`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json", // Specify JSON content type
        },
        body: JSON.stringify(data),
      }
    );
    return response.json();
  },

  updateReview: async (data: IReviewUpdate) => {
    const response = await fetch(
      `${process.env.URL_SERVER_API}/review/update-review`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json", // Specify JSON content type
        },
        body: JSON.stringify(data),
      }
    );
    return response.json();
  },
};

export default apisReview;
