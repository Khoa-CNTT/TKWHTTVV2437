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
};

export default apisReview;
